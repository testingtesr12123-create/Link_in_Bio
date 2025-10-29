import { Theme } from '../lib/supabase';
import { Check } from 'lucide-react';

interface ThemeSelectorProps {
  currentThemeId: number;
  themes: Theme[];
  onThemeSelect: (themeId: number) => void;
}

export default function ThemeSelector({ currentThemeId, themes, onThemeSelect }: ThemeSelectorProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Choose a Theme</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onThemeSelect(theme.id)}
            className={`relative p-6 rounded-lg border-2 transition-all text-left ${
              currentThemeId === theme.id
                ? 'border-blue-600 shadow-lg'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
            }`}
          >
            {currentThemeId === theme.id && (
              <div className="absolute top-3 right-3 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}

            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 capitalize">{theme.name}</h3>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded border border-gray-300"
                  style={{ backgroundColor: theme.background_color }}
                />
                <span className="text-sm text-gray-600">Background</span>
              </div>

              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded border border-gray-300"
                  style={{ backgroundColor: theme.button_color }}
                />
                <span className="text-sm text-gray-600">Button</span>
              </div>

              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded border border-gray-300"
                  style={{ backgroundColor: theme.text_color }}
                />
                <span className="text-sm text-gray-600">Text</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div
                className={`px-4 py-2 rounded text-center text-sm font-medium ${theme.button_style}`}
                style={{
                  backgroundColor: theme.button_color,
                  color: theme.button_text_color
                }}
              >
                Preview Button
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
