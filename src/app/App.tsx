import { useState } from 'react';
import { Settings, Copy, Trash2, X, Plus, RotateCcw, FileDown, Printer } from 'lucide-react';
import { motion } from 'motion/react';
import { Input } from '@/app/components/ui/input';
import { AuthorizedPersonForm } from '@/app/components/AuthorizedPersonForm';
import { PersonForm } from '@/app/components/PersonForm';
import { WalletBankAccountForm } from '@/app/components/WalletBankAccountForm';
import { LynxAPIForm } from '@/app/components/LynxAPIForm';
import { ScopeAuthorityForm } from '@/app/components/ScopeAuthorityForm';
import { getAllPositions, getCustomPositions, addCustomPosition, removeCustomPosition } from '@/data/positions';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface FormPage {
  id: string;
  type: 'authorized' | 'person' | 'wallet' | 'lynx' | 'scope';
  label: string;
}

export default function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [showPdfMenu, setShowPdfMenu] = useState(false);
  const [customPositions, setCustomPositions] = useState<string[]>(getCustomPositions());
  const [newPosition, setNewPosition] = useState('');
  const [pages, setPages] = useState<FormPage[]>([
    { id: 'auth-1', type: 'authorized', label: 'Authorized Person 1' },
    { id: 'wallet-1', type: 'wallet', label: 'Wallet & Bank Account' },
    { id: 'lynx-1', type: 'lynx', label: 'Lynx & API' },
    { id: 'scope-1', type: 'scope', label: 'Scope of Authority' },
  ]);
  const [removedPages, setRemovedPages] = useState<FormPage[]>([]);
  const [additionalPersons, setAdditionalPersons] = useState<number[]>([]);

  const handleAddPosition = () => {
    if (newPosition.trim() && !getAllPositions().includes(newPosition.trim())) {
      addCustomPosition(newPosition.trim());
      setCustomPositions(getCustomPositions());
      setNewPosition('');
    }
  };

  const handleRemovePosition = (position: string) => {
    removeCustomPosition(position);
    setCustomPositions(getCustomPositions());
  };

  const handleDuplicatePage = (pageId: string) => {
    const pageIndex = pages.findIndex((p) => p.id === pageId);
    if (pageIndex === -1) return;

    const pageToDuplicate = pages[pageIndex];
    const sameTypePages = pages.filter((p) => p.type === pageToDuplicate.type);
    const newId = `${pageToDuplicate.type}-${Date.now()}`;
    
    // Generate a smart label based on the type
    let newLabel: string;
    if (pageToDuplicate.type === 'authorized' || pageToDuplicate.type === 'person') {
      const personNumber = sameTypePages.length + 1;
      newLabel = pageToDuplicate.type === 'authorized' 
        ? `Authorized Person ${personNumber}`
        : `Person ${personNumber}`;
    } else {
      newLabel = `${pageToDuplicate.label} (Copy)`;
    }

    const newPage: FormPage = {
      id: newId,
      type: pageToDuplicate.type,
      label: newLabel,
    };

    // Insert after the duplicated page
    const newPages = [...pages];
    newPages.splice(pageIndex + 1, 0, newPage);
    setPages(newPages);
  };

  const handleRemovePage = (pageId: string) => {
    // Keep at least one form
    if (pages.length <= 1) {
      alert('You must keep at least one form page.');
      return;
    }
    const removedPage = pages.find((p) => p.id === pageId);
    if (removedPage) {
      setRemovedPages([...removedPages, removedPage]);
    }
    setPages((prev) => prev.filter((p) => p.id !== pageId));
  };

  const handleRestorePage = (pageId: string) => {
    const restoredPage = removedPages.find((p) => p.id === pageId);
    if (restoredPage) {
      setPages([...pages, restoredPage]);
      setRemovedPages(removedPages.filter((p) => p.id !== pageId));
    }
  };

  const handlePrint = () => {
    setShowPdfMenu(false);
    setShowSettings(false);
    // Small delay to allow settings panel to close
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleDownloadPdf = async () => {
    setShowPdfMenu(false);
    setShowSettings(false);
    
    // Small delay to allow settings panel to close
    await new Promise(resolve => setTimeout(resolve, 300));
    
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
    pdf.save('crypto-finance-forms.pdf');
  };

  const renderForm = (page: FormPage, index: number) => {
    const personNumber = page.label.includes('Person') 
      ? parseInt(page.label.match(/\d+/)?.[0] || '1')
      : undefined;

    switch (page.type) {
      case 'authorized':
        return <AuthorizedPersonForm key={page.id} personNumber={personNumber} />;
      case 'person':
        return <PersonForm key={page.id} personNumber={personNumber} />;
      case 'wallet':
        return <WalletBankAccountForm key={page.id} />;
      case 'lynx':
        return <LynxAPIForm key={page.id} />;
      case 'scope':
        return <ScopeAuthorityForm key={page.id} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-gray-100 py-12">
      {/* Global Settings Button */}
      <motion.button
        onClick={() => setShowSettings(!showSettings)}
        className="fixed top-8 right-8 z-50 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110"
        style={{ backgroundColor: '#105173' }}
        whileHover={{ rotate: 180 }}
        transition={{ duration: 0.3 }}
        aria-label="Form Settings"
      >
        <Settings className="w-6 h-6" />
      </motion.button>

      {/* PDF Export Button */}
      <div className="fixed top-28 right-8 z-50">
        <div className="relative">
          <motion.button
            onClick={() => setShowPdfMenu(!showPdfMenu)}
            className="text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
            style={{ backgroundColor: '#105173' }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
            aria-label="PDF Options"
          >
            <FileDown className="w-6 h-6" />
          </motion.button>

          {/* PDF Dropdown Menu */}
          {showPdfMenu && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute top-0 right-20 bg-white border border-gray-200 rounded-lg shadow-2xl overflow-hidden z-50 min-w-[180px]"
            >
              <button
                onClick={handlePrint}
                className="w-full px-4 py-3 text-left transition-colors flex items-center gap-3 text-sm border-b border-gray-100"
                style={{ 
                  color: '#105173'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f9ff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '';
                }}
              >
                <Printer className="w-4 h-4" style={{ color: '#105173' }} />
                <span className="font-medium">Print</span>
              </button>
              <button
                onClick={handleDownloadPdf}
                className="w-full px-4 py-3 text-left transition-colors flex items-center gap-3 text-sm"
                style={{ 
                  color: '#105173'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f9ff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '';
                }}
              >
                <FileDown className="w-4 h-4" style={{ color: '#105173' }} />
                <span className="font-medium">Download as PDF</span>
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Global Settings Panel */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className="fixed top-24 right-8 z-40 bg-white shadow-2xl rounded-lg p-6 w-96 border border-gray-200 max-h-[calc(100vh-8rem)] overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Form Settings</h3>
            <button
              onClick={() => setShowSettings(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close settings"
            >
              ×
            </button>
          </div>

          {/* Manage Pages Section */}
          <div className="space-y-6">
            {/* Manage Positions Section */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Manage Positions</h4>
              <p className="text-xs text-gray-600 mb-3">
                Add custom positions to the Function/Position dropdown field.
              </p>

              {/* Add New Position */}
              <div className="flex gap-2 mb-4">
                <Input
                  value={newPosition}
                  onChange={(e) => setNewPosition(e.target.value)}
                  placeholder="Enter new position..."
                  className="flex-1 text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddPosition();
                    }
                  }}
                />
                <button
                  onClick={handleAddPosition}
                  className="text-white px-3 py-2 rounded transition-all duration-300 hover:opacity-90"
                  style={{ backgroundColor: '#105173' }}
                  aria-label="Add position"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Custom Positions List */}
              {customPositions.length > 0 && (
                <div className="border-t border-gray-200 pt-3">
                  <p className="text-xs font-medium text-gray-700 mb-2">Custom Positions:</p>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {customPositions.map((position, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded text-sm group hover:bg-gray-100 transition-colors"
                      >
                        <span className="text-gray-800 flex-1 truncate">{position}</span>
                        <button
                          onClick={() => handleRemovePosition(position)}
                          className="text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                          aria-label={`Remove ${position}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {customPositions.length === 0 && (
                <p className="text-xs text-gray-500 italic">No custom positions added yet.</p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      <div className="space-y-12">
        {pages.map((page, index) => {
          const isAuthorizedForm = page.type === 'authorized' && page.id === 'auth-1';
          const nextPersonNumber = additionalPersons.length > 0 
            ? Math.max(...additionalPersons) + 1 
            : 2;
          
          return (
            <div key={page.id}>
              {renderForm(page, index)}
              
              {/* Render all additional persons */}
              {isAuthorizedForm && additionalPersons.map((personNum) => (
                <div key={`person-${personNum}`} className="relative mt-12">
                  {/* Remove Button - positioned on the left side */}
                  <div className="w-full max-w-4xl mx-auto px-8">
                    <div className="flex items-start justify-start -mb-[72px] relative z-10">
                      <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => setAdditionalPersons(additionalPersons.filter(p => p !== personNum))}
                        className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border-2 border-red-200 hover:border-red-300 p-2 rounded-lg transition-all duration-300 hover:scale-110"
                        title={`Remove Person ${personNum}`}
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                  
                  <PersonForm personNumber={personNum} />
                </div>
              ))}
              
              {/* Add Person Button - appears after all persons */}
              {isAuthorizedForm && (
                <div className="w-full max-w-4xl mx-auto px-8 mt-8">
                  <motion.button
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => setAdditionalPersons([...additionalPersons, nextPersonNumber])}
                    className="w-full text-white py-4 px-6 rounded-lg shadow-lg transition-all duration-300 hover:scale-[1.02] hover:opacity-90 flex items-center justify-center gap-3 font-medium"
                    style={{ 
                      background: 'linear-gradient(to right, #359567, #2d7a56)'
                    }}
                  >
                    <Plus className="w-5 h-5" />
                    Add Person
                  </motion.button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}