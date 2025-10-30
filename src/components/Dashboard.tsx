import { useState, useEffect } from 'react';
import { Profile, Link, Theme, Template } from '../lib/supabase';
import { profileService } from '../services/profileService';
import { linkService } from '../services/linkService';
import { themeService } from '../services/themeService';
import { templateService } from '../services/templateService';
import LinkManager from './LinkManager';
import ProfileEditor from './ProfileEditor';
import ThemeSelector from './ThemeSelector';
import TemplateGallery from './TemplateGallery';
import LivePreview from './LivePreview';
import Analytics from './Analytics';
import { Layout, Link as LinkIcon, Palette, BarChart3 } from 'lucide-react';

type TabType = 'links' | 'profile' | 'themes' | 'analytics' | 'templates';

interface DashboardProps {
  profileId: string;
}

export default function Dashboard({ profileId }: DashboardProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('templates');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [profileId]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [profileData, linksData, themesData, templatesData] = await Promise.all([
        profileService.getProfileById(profileId),
        linkService.getLinksByProfileId(profileId),
        themeService.getAllThemes(),
        templateService.getAllTemplates()
      ]);

      setProfile(profileData);
      setLinks(linksData);
      setThemes(themesData);
      setTemplates(templatesData);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (updates: Partial<Profile>) => {
    if (!profile) return;
    try {
      const updatedProfile = await profileService.updateProfile(profile.id, updates);
      setProfile(updatedProfile);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleLinksUpdate = (updatedLinks: Link[]) => {
    setLinks(updatedLinks);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-800">Profile not found</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'templates' as TabType, label: 'Templates', icon: Palette },
    { id: 'links' as TabType, label: 'Links', icon: LinkIcon },
    { id: 'profile' as TabType, label: 'Profile', icon: Layout },
    { id: 'analytics' as TabType, label: 'Analytics', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Your profile: <span className="font-medium text-blue-600">/{profile.username}</span>
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200">
                <nav className="flex">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 px-6 py-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                          activeTab === tab.id
                            ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'templates' && (
                  <TemplateGallery
                    templates={templates}
                    currentTemplate={profile.template_name}
                    currentColors={profile.custom_colors}
                    onTemplateSelect={(templateName, colors) =>
                      handleProfileUpdate({ template_name: templateName, custom_colors: colors })
                    }
                    onCustomizeColors={(colors) =>
                      handleProfileUpdate({ custom_colors: colors })
                    }
                  />
                )}
                {activeTab === 'links' && (
                  <LinkManager
                    profileId={profile.id}
                    links={links}
                    onLinksUpdate={handleLinksUpdate}
                  />
                )}
                {activeTab === 'profile' && (
                  <ProfileEditor
                    profile={profile}
                    onUpdate={handleProfileUpdate}
                  />
                )}
                {activeTab === 'analytics' && (
                  <Analytics links={links} />
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <LivePreview profile={profile} links={links} />
          </div>
        </div>
      </div>
    </div>
  );
}
