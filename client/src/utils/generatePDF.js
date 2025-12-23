import { toPng, toBlob } from 'html-to-image';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';

// --- 1. Standard PDF Download Function ---
export const generatePDF = async (elementId, fileName) => {
    const element = document.getElementById(elementId);
    if (!element) {
        toast.error("Could not find content to print");
        return;
    }

    // Use a unique ID for this toast to avoid conflicts
    const toastId = toast.loading("Generating PDF...");

    try {
        const dataUrl = await toPng(element, { 
            quality: 0.95,
            backgroundColor: '#ffffff',
            width: element.scrollWidth, 
            height: element.scrollHeight, 
            style: {
                overflow: 'visible', 
                height: 'auto',      
                maxHeight: 'none',   
            },
            filter: (node) => !node.classList?.contains('no-print')
        });

        const pdfWidth = 210; 
        const imgProps = new Image();
        imgProps.src = dataUrl;
        
        await new Promise(resolve => { imgProps.onload = resolve; });
        
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        const pdf = new jsPDF('p', 'mm', [pdfWidth, pdfHeight]);

        pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${fileName}.pdf`);
        
        toast.success("PDF Downloaded!", { id: toastId });
        return true; // Success flag

    } catch (error) {
        console.error("PDF Generation Error:", error);
        toast.error("Failed to generate PDF", { id: toastId });
        return false;
    }
};

// --- 2. Smart Share Function (Falls back to PDF) ---
export const shareInvoice = async (elementId, fileName) => {
    const element = document.getElementById(elementId);
    if (!element) return toast.error("Content not found");

    const toastId = toast.loading("Preparing to share...");

    
    // Helper to trigger fallback
    const triggerFallback = async (reason) => {
        toast.loading(`Share failed (${reason}). Downloading PDF instead...`, { id: toastId });
        await generatePDF(elementId, fileName);
    };

    try {
        // A. Check for Native Share Support
        if (!navigator.share || !navigator.canShare) {
            await triggerFallback("Not supported on this device");
            return;
        }

        // B. Calculate Smart Scale (to prevent crashing on long bills)
        const height = element.scrollHeight;
        const width = element.scrollWidth;
        const area = width * height;
        const TARGET_AREA = 4000000; // ~4 Megapixels safe limit for mobile
        
        let safePixelRatio = 2; 

        // Reduce quality if bill is massive
        if (area * 4 > TARGET_AREA) {
            safePixelRatio = Math.sqrt(TARGET_AREA / area);
            if (safePixelRatio < 0.6) safePixelRatio = 0.6; // Minimum readable quality
        }

        // C. Generate JPEG Blob (Lighter than PNG)
        const blob = await toBlob(element, { 
            quality: 0.85, 
            backgroundColor: '#ffffff',
            contentType: 'image/jpeg',
            pixelRatio: safePixelRatio, 
            width: width,
            height: height,
            style: {
                overflow: 'visible',
                height: 'auto',
                maxHeight: 'none',
                transform: 'scale(1)', 
            },
            filter: (node) => !node.classList?.contains('no-print') 
        });

        if (!blob) throw new Error("Image generation failed");

        const file = new File([blob], `${fileName}.jpg`, { type: 'image/jpeg' });

        // D. Attempt to Share
        if (navigator.canShare({ files: [file] })) {
            await navigator.share({
                files: [file],
                title: 'Invoice',
                text: `Here is the invoice for ${fileName}`,
            });
            toast.dismiss(toastId); // Success
        } else {
            throw new Error("Device refused to share file");
        }

    } catch (error) {
        console.error("Share Error:", error);
        
        // Ignore if user simply cancelled the share menu
        if (error.name === 'AbortError') {
            toast.dismiss(toastId);
            return;
        }

        // Fallback to PDF for real errors (like 'bill too long')
        await triggerFallback("Image too large");
    }
};