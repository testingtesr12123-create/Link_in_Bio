import { useState } from 'react';
import { Template, Profile } from '../lib/supabase';
import { Check, Palette } from 'lucide-react';
import * as Icons from 'lucide-react';

interface TemplateGalleryProps {
  templates: Template[];
  currentTemplate: string;
  currentColors: Profile['custom_colors'];
  onTemplateSelect: (templateName: string, colors: Profile['custom_colors']) => void;
  onCustomizeColors: (colors: Profile['custom_colors']) => void;
}

export default function TemplateGallery({
  templates,
  currentTemplate,
  currentColors,
  onTemplateSelect,
  onCustomizeColors
}: TemplateGalleryProps) {
  const [showColorEditor, setShowColorEditor] = useState(false);
  const [editingColors, setEditingColors] = useState(currentColors);

  const handleTemplateClick = (template: Template) => {
    onTemplateSelect(template.name, template.default_colors);
    setEditingColors(template.default_colors);
  };

  const handleColorSave = () => {
    onCustomizeColors(editingColors);
    setShowColorEditor(false);
  };

  const renderTemplatePreview = (template: Template) => {
    const colors = currentTemplate === template.name ? currentColors : template.default_colors;

    return (
      <div
        className="h-full rounded-lg overflow-hidden"
        style={{ backgroundColor: colors.background }}
      >
        <div className="p-6 flex flex-col items-center h-full">
          <div
            className="w-16 h-16 rounded-full mb-3"
            style={{ backgroundColor: colors.primary }}
          />
          <div
            className="h-3 w-24 rounded mb-2"
            style={{ backgroundColor: colors.text, opacity: 0.9 }}
          />
          <div
            className="h-2 w-32 rounded mb-4"
            style={{ backgroundColor: colors.text, opacity: 0.6 }}
          />

          {template.layout_type === 'simple' && (
            <>
              <div className="flex gap-2 mb-4">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: colors.text, opacity: 0.7 }}
                  />
                ))}
              </div>
              <div className="w-full space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-8 rounded-full"
                    style={{ backgroundColor: colors.secondary }}
                  />
                ))}
              </div>
            </>
          )}

          {template.layout_type === 'classic' && (
            <div className="w-full space-y-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-10 rounded-lg"
                  style={{ backgroundColor: colors.primary }}
                />
              ))}
            </div>
          )}

          {template.layout_type === 'card' && (
            <div className="w-full space-y-2">
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="h-20 rounded-lg"
                  style={{ backgroundColor: colors.secondary }}
                />
              ))}
            </div>
          )}

          {template.layout_type === 'minimal' && (
            <div className="w-full space-y-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-8 rounded"
                  style={{ backgroundColor: colors.accent }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Select a Template</h2>
          <p className="text-gray-600 mt-1">Pick a style that you like. You can edit it anytime.</p>
        </div>
        <button
          onClick={() => setShowColorEditor(!showColorEditor)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Palette className="w-4 h-4" />
          Customize Colors
        </button>
      </div>

      {showColorEditor && (
        <div className="bg-white border-2 border-blue-500 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Colors</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Background</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={editingColors.background}
                  onChange={(e) => setEditingColors({ ...editingColors, background: e.target.value })}
                  className="w-12 h-12 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={editingColors.background}
                  onChange={(e) => setEditingColors({ ...editingColors, background: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Text</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={editingColors.text}
                  onChange={(e) => setEditingColors({ ...editingColors, text: e.target.value })}
                  className="w-12 h-12 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={editingColors.text}
                  onChange={(e) => setEditingColors({ ...editingColors, text: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Primary</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={editingColors.primary}
                  onChange={(e) => setEditingColors({ ...editingColors, primary: e.target.value })}
                  className="w-12 h-12 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={editingColors.primary}
                  onChange={(e) => setEditingColors({ ...editingColors, primary: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Secondary</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={editingColors.secondary}
                  onChange={(e) => setEditingColors({ ...editingColors, secondary: e.target.value })}
                  className="w-12 h-12 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={editingColors.secondary}
                  onChange={(e) => setEditingColors({ ...editingColors, secondary: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Accent</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={editingColors.accent}
                  onChange={(e) => setEditingColors({ ...editingColors, accent: e.target.value })}
                  className="w-12 h-12 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={editingColors.accent}
                  onChange={(e) => setEditingColors({ ...editingColors, accent: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleColorSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Colors
            </button>
            <button
              onClick={() => {
                setEditingColors(currentColors);
                setShowColorEditor(false);
              }}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => handleTemplateClick(template)}
            className={`relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all border-2 overflow-hidden ${
              currentTemplate === template.name
                ? 'border-blue-600 ring-4 ring-blue-100'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            {currentTemplate === template.name && (
              <div className="absolute top-3 right-3 z-10 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <Check className="w-5 h-5 text-white" />
              </div>
            )}

            <div className="aspect-[3/4]">
              {renderTemplatePreview(template)}
            </div>

            <div className="p-4 bg-white border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 text-lg mb-1">{template.display_name}</h3>
              <p className="text-sm text-gray-600">{template.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
