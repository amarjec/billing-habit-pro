import { toPng, toBlob } from 'html-to-image'; // Added toBlob
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';

export const generatePDF = async (elementId, fileName) => {
    const element = document.getElementById(elementId);
    if (!element) {
        toast.error("Could not find content to print");
        return;
    }

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

    } catch (error) {
        console.error("PDF Generation Error:", error);
        toast.error("Failed to generate PDF", { id: toastId });
    }
};

// --- NEW: Mobile Share Function (Optimized for Long Bills) ---
export const shareInvoice = async (elementId, fileName) => {
    const element = document.getElementById(elementId);
    if (!element) return toast.error("Content not found");

    const toastId = toast.loading("Preparing to share...");

    try {
        // OPTIMIZATION 1: Use toBlob directly (Saves memory compared to toPng string)
        // OPTIMIZATION 2: Use JPEG (Smaller file size for long lists)
        // OPTIMIZATION 3: Cap pixelRatio at 2 (Prevents image dimensions from crashing mobile GPU)
        const blob = await toBlob(element, { 
            quality: 0.8, // 0.8 is good balance for JPEG
            backgroundColor: '#ffffff',
            contentType: 'image/jpeg',
            pixelRatio: 2, // Forces manageable resolution on high-end phones
            style: {
                overflow: 'visible',
                height: 'auto',
                maxHeight: 'none',
            },
            filter: (node) => !node.classList?.contains('no-print') 
        });

        if (!blob) throw new Error("Image generation failed");

        const file = new File([blob], `${fileName}.jpg`, { type: 'image/jpeg' });

        // 2. Use Native Mobile Share
        if (navigator.share && navigator.canShare({ files: [file] })) {
            await navigator.share({
                files: [file],
                title: 'Invoice',
                text: `Here is the invoice for ${fileName}`,
            });
            toast.dismiss(toastId); // Success
        } else {
            toast.error("Sharing not supported on this browser", { id: toastId });
        }
    } catch (error) {
        console.error(error);
        toast.error("Share failed (Bill might be too long)", { id: toastId });
    }
};