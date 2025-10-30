import { Profile, Link } from '../lib/supabase';
import { ExternalLink } from 'lucide-react';
import * as Icons from 'lucide-react';

interface LivePreviewProps {
  profile: Profile;
  links: Link[];
}

export default function LivePreview({ profile, links }: LivePreviewProps) {
  const activeLinks = links.filter(link => link.is_active);
  const colors = profile.custom_colors;
  const templateName = profile.template_name || 'simple';

  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName] || Icons.Link;
    return IconComponent;
  };

  const renderSimpleLayout = () => (
    <div className="flex flex-col items-center text-center">
      {profile.profile_image_url && (
        <img
          src={profile.profile_image_url}
          alt={profile.display_name}
          className="w-16 h-16 rounded-full object-cover shadow-lg mb-3 border-2"
          style={{ borderColor: colors.primary }}
        />
      )}
      <h1 className="text-lg font-bold mb-2" style={{ color: colors.text }}>
        {profile.display_name}
      </h1>
      {profile.bio && (
        <p className="text-xs mb-4 px-2" style={{ color: colors.text, opacity: 0.8 }}>
          {profile.bio}
        </p>
      )}
      <div className="w-full space-y-2">
        {activeLinks.slice(0, 4).map((link) => {
          const Icon = getIcon(link.icon);
          return (
            <div
              key={link.id}
              className="w-full px-3 py-2 flex items-center justify-center gap-2 rounded-full text-xs shadow-sm"
              style={{ backgroundColor: colors.secondary, color: colors.text }}
            >
              <Icon className="w-3 h-3" />
              <span className="font-medium">{link.title}</span>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderClassicLayout = () => (
    <div className="flex flex-col items-center text-center">
      {profile.profile_image_url && (
        <img
          src={profile.profile_image_url}
          alt={profile.display_name}
          className="w-20 h-20 rounded-full object-cover shadow-lg mb-3 border-2"
          style={{ borderColor: colors.primary }}
        />
      )}
      <h1 className="text-xl font-bold mb-2" style={{ color: colors.text }}>
        {profile.display_name}
      </h1>
      {profile.bio && (
        <p className="text-xs mb-4 px-2" style={{ color: colors.text, opacity: 0.8 }}>
          {profile.bio}
        </p>
      )}
      <div className="w-full space-y-2">
        {activeLinks.slice(0, 4).map((link) => {
          const Icon = getIcon(link.icon);
          return (
            <div
              key={link.id}
              className="w-full px-4 py-2 flex items-center justify-center gap-2 rounded-lg text-xs shadow-md"
              style={{ backgroundColor: colors.primary, color: colors.secondary }}
            >
              <Icon className="w-3 h-3" />
              <span className="font-medium">{link.title}</span>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderCardLayout = () => (
    <div className="flex flex-col items-center">
      {profile.profile_image_url && (
        <img
          src={profile.profile_image_url}
          alt={profile.display_name}
          className="w-16 h-16 rounded-full object-cover shadow-lg mb-3"
        />
      )}
      <h1 className="text-lg font-bold mb-4 text-center" style={{ color: colors.text }}>
        {profile.display_name}
      </h1>
      <div className="w-full grid grid-cols-2 gap-2">
        {activeLinks.slice(0, 4).map((link) => {
          const Icon = getIcon(link.icon);
          return (
            <div
              key={link.id}
              className="p-3 rounded-lg shadow-md"
              style={{ backgroundColor: colors.secondary }}
            >
              <div className="flex flex-col items-center gap-1">
                <div
                  className="w-8 h-8 rounded flex items-center justify-center"
                  style={{ backgroundColor: colors.accent }}
                >
                  <Icon className="w-4 h-4" style={{ color: colors.text }} />
                </div>
                <span className="text-xs font-medium text-center" style={{ color: colors.text }}>
                  {link.title}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderMinimalLayout = () => (
    <div>
      {profile.profile_image_url && (
        <img
          src={profile.profile_image_url}
          alt={profile.display_name}
          className="w-14 h-14 rounded-full object-cover shadow-md mb-4"
        />
      )}
      <h1 className="text-2xl font-bold mb-4" style={{ color: colors.text }}>
        {profile.display_name}
      </h1>
      <div className="space-y-1.5">
        {activeLinks.slice(0, 4).map((link) => {
          const Icon = getIcon(link.icon);
          return (
            <div
              key={link.id}
              className="px-3 py-2 flex items-center gap-2 rounded text-xs"
              style={{ backgroundColor: colors.accent, color: colors.text }}
            >
              <Icon className="w-3 h-3" />
              <span className="font-medium">{link.title}</span>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderLayout = () => {
    switch (templateName) {
      case 'classic':
        return renderClassicLayout();
      case 'card':
        return renderCardLayout();
      case 'minimal':
        return renderMinimalLayout();
      default:
        return renderSimpleLayout();
    }
  };

  return (
    <div className="sticky top-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Live Preview</h3>
          <a
            href={`/${profile.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
          >
            <ExternalLink className="w-3 h-3" />
            Open
          </a>
        </div>

        <div className="aspect-[9/16] relative overflow-hidden">
          <div
            className="absolute inset-0 overflow-y-auto"
            style={{
              backgroundColor: colors.background,
              backgroundImage: profile.background_image_url ? `url(${profile.background_image_url})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="min-h-full py-8 px-4">
              {activeLinks.length === 0 ? (
                <div className="text-center">
                  {profile.profile_image_url && (
                    <img
                      src={profile.profile_image_url}
                      alt={profile.display_name}
                      className="w-16 h-16 rounded-full object-cover shadow-lg mb-3 mx-auto"
                    />
                  )}
                  <h1 className="text-lg font-bold mb-2" style={{ color: colors.text }}>
                    {profile.display_name}
                  </h1>
                  <p className="text-xs" style={{ color: colors.text, opacity: 0.6 }}>
                    No active links
                  </p>
                </div>
              ) : (
                renderLayout()
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
