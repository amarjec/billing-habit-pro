import { toPng } from 'html-to-image';
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