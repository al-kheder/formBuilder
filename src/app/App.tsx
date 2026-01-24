import { useState } from 'react';
import { Settings, FileDown, Printer, Plus, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { FormRenderer } from '@/app/components/FormRenderer';
import { PersonForm } from '@/app/components/PersonForm';
import { SettingsPage } from '@/app/components/SettingsPage';
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
  const [additionalPersons, setAdditionalPersons] = useState<number[]>([]);
  const [themeColor, setThemeColor] = useState('#105173');

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-gray-100 py-12">


      {/* Global Settings Button */}
      <motion.button
        onClick={() => setShowSettings(!showSettings)}
        className="fixed top-8 right-8 z-50 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110"
        style={{ backgroundColor: themeColor }}
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
            style={{ backgroundColor: themeColor }}
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
                style={{ color: themeColor }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f9ff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '';
                }}
              >
                <Printer className="w-4 h-4" style={{ color: themeColor }} />
                <span className="font-medium">Print</span>
              </button>
              <button
                onClick={handleDownloadPdf}
                className="w-full px-4 py-3 text-left transition-colors flex items-center gap-3 text-sm"
                style={{ color: themeColor }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f9ff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '';
                }}
              >
                <FileDown className="w-4 h-4" style={{ color: themeColor }} />
                <span className="font-medium">Download as PDF</span>
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Global Settings Page */}
      <SettingsPage
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        customPositions={customPositions}
        addPosition={addPosition}
        removePosition={removePosition}
        themeColor={themeColor}
        onThemeColorChange={setThemeColor}
      />

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
