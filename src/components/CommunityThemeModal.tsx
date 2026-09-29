import React, { useState } from 'react';
import { 
  Palette, 
  Check, 
  Sparkles, 
  X, 
  RotateCcw, 
  Building2, 
  ShieldCheck, 
  IndianRupee,
  Layers
} from 'lucide-react';
import { COMMUNITY_COLOR_PRESETS, CommunityPreset, computeThemeVars } from '../lib/theme';
import { Organization } from '../types';

interface CommunityThemeModalProps {
  activeOrg: Organization;
  onClose: () => void;
  onUpdateThemeColor: (color: string) => void;
  isDarkMode?: boolean;
}

export const CommunityThemeModal: React.FC<CommunityThemeModalProps> = ({
  activeOrg,
  onClose,
  onUpdateThemeColor,
  isDarkMode = true,
}) => {
  const [selectedColor, setSelectedColor] = useState<string>(activeOrg.themeColor || '#dc2626');
  const [customHex, setCustomHex] = useState<string>(activeOrg.themeColor || '#dc2626');

  const previewTheme = computeThemeVars(selectedColor, isDarkMode);

  const handleSelectPreset = (preset: CommunityPreset) => {
    setSelectedColor(preset.primary);
    setCustomHex(preset.primary);
  };

  const handleCustomHexChange = (hex: string) => {
    setCustomHex(hex);
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      setSelectedColor(hex);
    }
  };

  const handleSave = () => {
    onUpdateThemeColor(selectedColor);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md transition-colors"
              style={{ backgroundColor: selectedColor }}
            >
              <Palette className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Community Theme & Background Color</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose the official brand color & atmosphere for {activeOrg.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Live Preview Card */}
          <div 
            className="p-4 rounded-2xl border transition-all duration-300"
            style={{ 
              backgroundColor: previewTheme.bg,
              borderColor: previewTheme.border,
            }}
          >
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-black/5 dark:border-white/5">
              <div className="flex items-center gap-2">
                <span 
                  className="w-2.5 h-2.5 rounded-full animate-pulse"
                  style={{ backgroundColor: selectedColor }}
                />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  Full App Preview Atmosphere
                </span>
              </div>
              <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400">
                {selectedColor.toUpperCase()}
              </span>
            </div>

            <div 
              className="p-4 rounded-xl shadow-xs border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              style={{
                backgroundColor: previewTheme.surface,
                borderColor: previewTheme.border,
              }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm"
                  style={{ backgroundColor: selectedColor }}
                >
                  {activeOrg.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                    {activeOrg.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                    <span>{activeOrg.type}</span>
                    <span>·</span>
                    <span 
                      className="font-medium"
                      style={{ color: previewTheme.textAccent }}
                    >
                      Active Theme Color
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-xs transition-opacity hover:opacity-95"
                  style={{ backgroundColor: selectedColor }}
                >
                  Primary CTA
                </button>
                <div 
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium"
                  style={{ 
                    backgroundColor: previewTheme.badgeBg,
                    color: previewTheme.badgeText,
                  }}
                >
                  Verified 80G
                </div>
              </div>
            </div>
          </div>

          {/* Curated Community Color Presets */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Heritage Community Color Presets
              </h3>
              <span className="text-xs text-slate-400">
                {COMMUNITY_COLOR_PRESETS.length} Authentic Palettes
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {COMMUNITY_COLOR_PRESETS.map((preset) => {
                const isSelected = selectedColor.toLowerCase() === preset.primary.toLowerCase();
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`text-left p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer group ${
                      isSelected
                        ? 'border-2 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
                    }`}
                    style={isSelected ? { borderColor: preset.primary, backgroundColor: `${preset.primary}10` } : {}}
                  >
                    <div 
                      className="w-6 h-6 rounded-lg shrink-0 mt-0.5 shadow-xs flex items-center justify-center text-white"
                      style={{ backgroundColor: preset.primary }}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {preset.name}
                        </p>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {preset.category}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Hex Color Picker */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Or Choose Custom Community Hex Code
            </h3>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => handleCustomHexChange(e.target.value)}
                  className="w-11 h-11 rounded-xl cursor-pointer border border-slate-300 dark:border-slate-700 p-0.5 bg-white dark:bg-slate-800"
                />
              </div>
              <div className="flex-1">
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-slate-400 font-mono text-xs">#</span>
                  <input
                    type="text"
                    value={customHex.replace('#', '')}
                    onChange={(e) => handleCustomHexChange(`#${e.target.value}`)}
                    placeholder="dc2626"
                    maxLength={6}
                    className="w-full pl-7 pr-3 py-2 rounded-xl text-xs font-mono uppercase bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCustomHexChange('#dc2626')}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
                title="Reset to Durga Puja Sindoor Red"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500 hidden sm:block">
            Applies to whole web app background, headers, buttons and theme
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white shadow-md transition-all hover:scale-102 cursor-pointer"
              style={{ backgroundColor: selectedColor }}
            >
              Apply Community Color
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
