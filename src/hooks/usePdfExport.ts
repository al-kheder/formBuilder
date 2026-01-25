import jsPDF from 'jspdf';

interface FormField {
  label: string;
  value: string;
}

interface FormSection {
  title: string;
  fields: FormField[];
}

export function usePdfExport() {
  const print = () => {
    // Add print-specific styles to hide input borders
    const printStyle = document.createElement('style');
    printStyle.id = 'print-override-styles';
    printStyle.innerHTML = `
      @media print {
        input, select, textarea {
          border: none !important;
          background: none !important;
          padding: 0 !important;
        }
      }
    `;
    document.head.appendChild(printStyle);

    setTimeout(() => {
      window.print();
      // Remove print styles after printing
      const styleEl = document.getElementById('print-override-styles');
      if (styleEl) {
        document.head.removeChild(styleEl);
      }
    }, 100);
  };

  const extractFormData = (formElement: HTMLElement): FormSection[] => {
    const sections: FormSection[] = [];

    // Find all form sections
    const sectionElements = formElement.querySelectorAll('.form-section');

    sectionElements.forEach((section) => {
      const sectionTitle = section.querySelector('h2, h3')?.textContent?.trim() || '';
      const fields: FormField[] = [];

      // Extract all labeled inputs
      const labels = section.querySelectorAll('label');
      labels.forEach((label) => {
        const labelText = label.textContent?.trim() || '';
        if (!labelText) return;

        // Find associated input/select/textarea
        const forId = label.getAttribute('for');
        let input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null = null;

        if (forId) {
          input = section.querySelector(`#${forId}`) as any;
        } else {
          // Find next input sibling
          input = label.parentElement?.querySelector('input, select, textarea') as any;
        }

        if (input) {
          let value = '';

          if (input.type === 'checkbox') {
            value = (input as HTMLInputElement).checked ? '☑' : '☐';
          } else if (input.type === 'radio') {
            if ((input as HTMLInputElement).checked) {
              value = '•';
            }
          } else {
            value = input.value || '';
          }

          if (value || input.type === 'checkbox' || input.type === 'radio') {
            fields.push({ label: labelText, value });
          }
        }
      });

      if (sectionTitle || fields.length > 0) {
        sections.push({ title: sectionTitle, fields });
      }
    });

    return sections;
  };

  const downloadPdf = async (filename = 'crypto-finance-forms.pdf') => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    let yPosition = margin;
    let currentPage = 1;

    // Helper function to add logo
    const addLogo = async (pdf: jsPDF, y: number) => {
      try {
        const logoElement = document.querySelector('.logo img') as HTMLImageElement;
        if (logoElement) {
          // Convert logo to base64
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = logoElement.naturalWidth;
          canvas.height = logoElement.naturalHeight;
          ctx?.drawImage(logoElement, 0, 0);
          const logoData = canvas.toDataURL('image/png');

          // Add logo to PDF (top right)
          const logoWidth = 40;
          const logoHeight = (logoElement.naturalHeight / logoElement.naturalWidth) * logoWidth;
          pdf.addImage(logoData, 'PNG', pageWidth - margin - logoWidth, y, logoWidth, logoHeight);

          return logoHeight;
        }
      } catch (error) {
        console.error('Error adding logo:', error);
      }
      return 0;
    };

    // Helper function to check if we need a new page
    const checkNewPage = (requiredSpace: number) => {
      if (yPosition + requiredSpace > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
        currentPage++;
        return true;
      }
      return false;
    };



    // Get all form pages
    const formPages = document.querySelectorAll('.form-page');

    for (let pageIndex = 0; pageIndex < formPages.length; pageIndex++) {
      const formElement = formPages[pageIndex] as HTMLElement;

      if (pageIndex > 0) {
        pdf.addPage();
        yPosition = margin;
      }

      // Add logo at the top of each page
      const logoHeight = await addLogo(pdf, yPosition);

      // Get form header
      const headerElement = formElement.querySelector('.form-header');
      if (headerElement) {
        const title = headerElement.querySelector('h1')?.textContent?.trim();
        const subtitle = headerElement.querySelector('p')?.textContent?.trim();

        yPosition = Math.max(yPosition, logoHeight + margin + 10);

        if (title) {
          pdf.setFontSize(18);
          pdf.setFont('helvetica', 'bold');
          pdf.text(title, margin, yPosition);
          yPosition += 10;
        }

        if (subtitle) {
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'normal');
          pdf.text(subtitle, margin, yPosition);
          yPosition += 10;
        }
      }

      yPosition += 5;

      // Extract and add form data
      const sections = extractFormData(formElement);

      sections.forEach((section, sectionIndex) => {
        // Section title
        if (section.title) {
          checkNewPage(15);

          // Add a line separator if not the first section
          if (sectionIndex > 0) {
            pdf.setDrawColor(200, 200, 200);
            pdf.line(margin, yPosition, pageWidth - margin, yPosition);
            yPosition += 5;
          }

          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          pdf.text(section.title, margin, yPosition);
          yPosition += 8;
        }

        // Section fields
        section.fields.forEach((field) => {
          checkNewPage(12);

          // Field label
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'bold');
          pdf.text(field.label, margin, yPosition);
          yPosition += 5;

          // Field value
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'normal');
          const valueText = field.value || '___________________';
          const lines = pdf.splitTextToSize(valueText, contentWidth - 10);

          lines.forEach((line: string) => {
            checkNewPage(6);
            pdf.text(line, margin + 5, yPosition);
            yPosition += 6;
          });

          yPosition += 2;
        });

        yPosition += 3;
      });
    }

    // Save the PDF
    pdf.save(filename);
  };

  return {
    print,
    downloadPdf,
  };
}
