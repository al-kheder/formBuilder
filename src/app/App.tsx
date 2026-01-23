import { useState } from 'react';
import { Settings, FileDown, Printer, Plus, X, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Input } from '@/app/components/ui/input';
import { FormRenderer } from '@/app/components/FormRenderer';
import { PersonForm } from '@/app/components/PersonForm';
import { useFormPages, FormPage } from '@/hooks/useFormPages';
import { usePositions } from '@/hooks/usePositions';
import { usePdfExport } from '@/hooks/usePdfExport';

const INITIAL_PAGES: FormPage[] = [
  { id: 'auth-1', type: 'authorized', label: 'Authorized Person 1' },
  { id: 'wallet-1', type: 'wallet', label: 'Wallet & Bank Account' },
  { id: 'lynx-1', type: 'lynx', label: 'Lynx & API' },
  { id: 'scope-1', type: 'scope', label: 'Scope of Authority' },
];

export default function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [showPdfMenu, setShowPdfMenu] = useState(false);
  const [newPosition, setNewPosition] = useState('');
  const [additionalPersons, setAdditionalPersons] = useState<number[]>([]);

  const { pages, removePage } = useFormPages(INITIAL_PAGES);
  const { customPositions, addPosition, removePosition } = usePositions();
  const { print, downloadPdf } = usePdfExport();

  const handlePrint = () => {
    setShowPdfMenu(false);
    setShowSettings(false);
    print();
  };

  const handleDownloadPdf = () => {
    setShowPdfMenu(false);
    setShowSettings(false);
    downloadPdf();
  };

  const onAddPosition = () => {
    addPosition(newPosition);
    setNewPosition('');
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
                style={{ color: '#105173' }}
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
                style={{ color: '#105173' }}
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

          <div className="space-y-6">
            {/* Manage Positions Section */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Manage Positions</h4>
              <p className="text-xs text-gray-600 mb-3">
                Add custom positions to the Function/Position dropdown field.
              </p>

              <div className="flex gap-2 mb-4">
                <Input
                  value={newPosition}
                  onChange={(e) => setNewPosition(e.target.value)}
                  placeholder="Enter new position..."
                  className="flex-1 text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      onAddPosition();
                    }
                  }}
                />
                <button
                  onClick={onAddPosition}
                  className="text-white px-3 py-2 rounded transition-all duration-300 hover:opacity-90"
                  style={{ backgroundColor: '#105173' }}
                  aria-label="Add position"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

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
                          onClick={() => removePosition(position)}
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
              <FormRenderer page={page} index={index} />
              
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
