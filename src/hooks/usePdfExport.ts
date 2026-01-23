import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export function usePdfExport() {
  const print = () => {
    // Small delay to allow settings panel to close if open
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const downloadPdf = async (filename = 'crypto-finance-forms.pdf') => {
    // Create a temporary style element to override oklch colors with RGB
    const tempStyle = document.createElement('style');
    tempStyle.id = 'pdf-capture-override';
    tempStyle.innerHTML = `
      .form-page,
      .form-page * {
        color: rgb(0, 0, 0) !important;
        background-color: rgb(255, 255, 255) !important;
        border-color: rgb(209, 213, 219) !important;
      }
      .form-page .bg-white {
        background-color: rgb(255, 255, 255) !important;
      }
      .form-page .bg-gradient-to-br {
        background: linear-gradient(to bottom right, rgb(248, 250, 252), rgb(239, 246, 255), rgb(238, 242, 255)) !important;
      }
      .form-page .bg-blue-600 {
        background-color: rgb(37, 99, 235) !important;
      }
      .form-page .bg-blue-50 {
        background-color: rgb(239, 246, 255) !important;
      }
      .form-page .bg-gray-50 {
        background-color: rgb(249, 250, 251) !important;
      }
      .form-page .text-gray-900 {
        color: rgb(17, 24, 39) !important;
      }
      .form-page .text-gray-800 {
        color: rgb(31, 41, 55) !important;
      }
      .form-page .text-gray-700 {
        color: rgb(55, 65, 81) !important;
      }
      .form-page .text-gray-600 {
        color: rgb(75, 85, 99) !important;
      }
      .form-page .text-blue-600 {
        color: rgb(37, 99, 235) !important;
      }
      .form-page .border-gray-200 {
        border-color: rgb(229, 231, 235) !important;
      }
      .form-page .border-gray-300 {
        border-color: rgb(209, 213, 219) !important;
      }
      .form-page input,
      .form-page select,
      .form-page textarea {
        background-color: rgb(255, 255, 255) !important;
        color: rgb(0, 0, 0) !important;
        border-color: rgb(209, 213, 219) !important;
      }
      .form-page .shadow-2xl {
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
      }
    `;
    document.head.appendChild(tempStyle);
    
    // Wait for styles to apply
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // A4 dimensions in mm
    const a4Width = 210;
    const a4Height = 297;
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Get all form elements
    const formElements = document.querySelectorAll('.form-page');
    
    for (let i = 0; i < formElements.length; i++) {
      const element = formElements[i] as HTMLElement;
      
      try {
        // Capture form as canvas with the override styles applied
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          windowWidth: element.scrollWidth,
          windowHeight: element.scrollHeight,
          onclone: (clonedDoc) => {
            // Ensure the cloned document also has the override styles
            const clonedStyle = clonedDoc.createElement('style');
            clonedStyle.innerHTML = tempStyle.innerHTML;
            clonedDoc.head.appendChild(clonedStyle);
          },
        });
        
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = a4Width;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        // Calculate scale to fit within A4
        let finalHeight = imgHeight;
        let finalWidth = imgWidth;
        
        if (imgHeight > a4Height) {
          // If image is taller than A4, scale it down
          finalHeight = a4Height;
          finalWidth = (canvas.width * a4Height) / canvas.height;
        }
        
        // Center the image on the page
        const xOffset = (a4Width - finalWidth) / 2;
        const yOffset = 0;
        
        // Add new page for each form (except the first one)
        if (i > 0) {
          pdf.addPage();
        }
        
        // Add image to PDF
        pdf.addImage(imgData, 'PNG', xOffset, yOffset, finalWidth, finalHeight);
      } catch (error) {
        console.error('Error capturing form:', error);
      }
    }
    
    // Remove the temporary style element
    document.head.removeChild(tempStyle);
    
    // Download the PDF
    pdf.save(filename);
  };

  return {
    print,
    downloadPdf,
  };
}
