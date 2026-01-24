import { motion } from 'motion/react';
import { X, Plus, Trash2, Palette, Sparkles, Monitor, Settings } from 'lucide-react';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Checkbox } from '@/app/components/ui/checkbox';
import { useState } from 'react';

interface SettingsPageProps {
    isOpen: boolean;
    onClose: () => void;
    customPositions: string[];
    addPosition: (position: string) => void;
    removePosition: (position: string) => void;
    themeColor: string;
    onThemeColorChange: (color: string) => void;
}

export function SettingsPage({
    isOpen,
    onClose,
    customPositions,
    addPosition,
    removePosition,
    themeColor,
    onThemeColorChange,
}: SettingsPageProps) {
    const [newPosition, setNewPosition] = useState('');
    const [aiEnabled, setAiEnabled] = useState(false);

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 z-[100] bg-gray-50 overflow-y-auto"
        >
            {/* Header */}
            <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200 px-8 py-6 flex items-center justify-between z-10">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                        <Settings className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Form Builder Settings</h2>
                        <p className="text-gray-500 text-sm">Customize your workspace and manage global data</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-3 hover:bg-gray-100 rounded-full transition-all duration-200 hover:rotate-90"
                >
                    <X className="w-8 h-8 text-gray-400 hover:text-gray-600" />
                </button>
            </div>

            <div className="max-w-7xl mx-auto px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column - Tools */}
                    <div className="lg:col-span-7 space-y-8">
                        {/* Intelligence Section */}
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-amber-100 rounded-lg">
                                    <Sparkles className="w-5 h-5 text-amber-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900">Intelligence Tools</h3>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-start gap-5">
                                    <Checkbox
                                        id="ai-assist"
                                        checked={aiEnabled}
                                        onCheckedChange={(c) => setAiEnabled(!!c)}
                                        className="mt-1 w-5 h-5"
                                    />
                                    <div className="space-y-2 flex-1">
                                        <Label htmlFor="ai-assist" className="text-lg font-medium cursor-pointer">Enable AI Assistant</Label>
                                        <p className="text-gray-600 leading-relaxed">
                                            Supercharge your form building with AI. Get smart suggestions for field names, auto-generate validation rules, and detect inconsistencies in real-time.
                                        </p>

                                        {aiEnabled && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                className="pt-6 space-y-4"
                                            >
                                                <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                                                    <Checkbox id="auto-fix" />
                                                    <label htmlFor="auto-fix" className="text-sm font-medium text-gray-700 cursor-pointer">Auto-fix common typos and formatting issues</label>
                                                </div>
                                                <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                                                    <Checkbox id="smart-validation" />
                                                    <label htmlFor="smart-validation" className="text-sm font-medium text-gray-700 cursor-pointer">Suggest smart validation patterns based on field names</label>
                                                </div>
                                                <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                                                    <Checkbox id="predictive" />
                                                    <label htmlFor="predictive" className="text-sm font-medium text-gray-700 cursor-pointer">Predictive field completion</label>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Appearance Section */}
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Palette className="w-5 h-5 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900">Appearance & Design</h3>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow space-y-8">
                                <div>
                                    <Label className="text-base mb-4 block">Primary Brand Color</Label>
                                    <div className="flex flex-wrap gap-4">
                                        {['#105173', '#2563EB', '#7C3AED', '#DB2777', '#059669', '#DC2626', '#D97706'].map(color => (
                                            <button
                                                key={color}
                                                onClick={() => {
                                                    onThemeColorChange(color);
                                                    document.documentElement.style.setProperty('--primary-color', color);
                                                }}
                                                className={`w-12 h-12 rounded-full border-4 transition-all duration-200 shadow-sm ${themeColor === color ? 'border-gray-900 scale-110 ring-2 ring-offset-2 ring-gray-900' : 'border-white hover:scale-105'}`}
                                                style={{ backgroundColor: color }}
                                                aria-label={`Select color ${color}`}
                                            />
                                        ))}
                                    </div>
                                </div>


                            </div>
                        </section>
                    </div>

                    {/* Right Column - Data */}
                    <div className="lg:col-span-5 space-y-8">
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Monitor className="w-5 h-5 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900">Data Management</h3>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow h-fit">
                                <div className="mb-6">
                                    <h4 className="font-semibold text-gray-900 mb-2">Custom Positions</h4>
                                    <p className="text-sm text-gray-500">Manage the list of positions available in dropdowns across all forms.</p>
                                </div>

                                <div className="flex gap-2 mb-6">
                                    <Input
                                        value={newPosition}
                                        onChange={(e) => setNewPosition(e.target.value)}
                                        placeholder="Enter new position..."
                                        className="flex-1"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                addPosition(newPosition);
                                                setNewPosition('');
                                            }
                                        }}
                                    />
                                    <button
                                        onClick={() => {
                                            addPosition(newPosition);
                                            setNewPosition('');
                                        }}
                                        className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                    {customPositions.map((position, index) => (
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            key={index}
                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group border border-transparent hover:border-gray-200 hover:bg-white transition-all"
                                        >
                                            <span className="text-gray-700 font-medium">{position}</span>
                                            <button
                                                onClick={() => removePosition(position)}
                                                className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </motion.div>
                                    ))}
                                    {customPositions.length === 0 && (
                                        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                                            <p className="text-gray-400 font-medium">No custom positions added yet</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
