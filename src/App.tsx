import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import PublicProfile from './components/PublicProfile';
import ProfileSelector from './components/ProfileSelector';

function App() {
  const [currentView, setCurrentView] = useState<'selector' | 'dashboard' | 'profile'>('selector');
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const path = window.location.pathname;

    if (path === '/' || path === '') {
      setCurrentView('selector');
    } else if (path.startsWith('/dashboard/')) {
      const profileId = path.replace('/dashboard/', '');
      setSelectedProfileId(profileId);
      setCurrentView('dashboard');
    } else {
      const extractedUsername = path.substring(1);
      setUsername(extractedUsername);
      setCurrentView('profile');
    }
  }, []);

  const handleProfileSelect = (profileId: string) => {
    setSelectedProfileId(profileId);
    setCurrentView('dashboard');
    window.history.pushState({}, '', `/dashboard/${profileId}`);
  };

  if (currentView === 'profile' && username) {
    return <PublicProfile username={username} />;
  }

  if (currentView === 'dashboard' && selectedProfileId) {
    return <Dashboard profileId={selectedProfileId} />;
  }

  return <ProfileSelector onProfileSelect={handleProfileSelect} />;
}

export default App;
