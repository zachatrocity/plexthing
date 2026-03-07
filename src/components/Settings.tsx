import React, { useState, useEffect } from 'react';
import { deskthing } from '@deskthing/client';

interface PlexSettings {
  plex_server_url?: string;
  plex_token?: string;
  player_identifier?: string;
}

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<PlexSettings>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const currentSettings = await deskthing.getSettings();
      setSettings({
        plex_server_url: currentSettings?.plex_server_url?.value || 'http://localhost:32400',
        plex_token: currentSettings?.plex_token?.value || '',
        player_identifier: currentSettings?.player_identifier?.value || '',
      });
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('');

    try {
      await deskthing.updateSettings({
        plex_server_url: settings.plex_server_url,
        plex_token: settings.plex_token,
        player_identifier: settings.player_identifier,
      });
      setMessage('Settings saved!');
      
      // Request connection test
      deskthing.sendMessageToParent({
        type: 'plex:testConnection',
        payload: {},
      });
    } catch (error) {
      setMessage('Failed to save settings');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (key: keyof PlexSettings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setMessage('');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold text-white">Plex Settings</h2>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Plex Server URL
          </label>
          <input
            type="text"
            value={settings.plex_server_url || ''}
            onChange={(e) => handleChange('plex_server_url', e.target.value)}
            placeholder="http://localhost:32400"
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white text-sm focus:outline-none focus:border-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Your Plex Media Server URL
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Plex Token
          </label>
          <input
            type="password"
            value={settings.plex_token || ''}
            onChange={(e) => handleChange('plex_token', e.target.value)}
            placeholder="Your Plex token"
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white text-sm focus:outline-none focus:border-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            From Settings → Account → Plex Token
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Target Player (Optional)
          </label>
          <input
            type="text"
            value={settings.player_identifier || ''}
            onChange={(e) => handleChange('player_identifier', e.target.value)}
            placeholder="Auto-detect"
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white text-sm focus:outline-none focus:border-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Leave empty for auto-discovery
          </p>
        </div>
      </div>

      {message && (
        <div className={`text-sm ${message.includes('Failed') ? 'text-red-400' : 'text-green-400'}`}>
          {message}
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white rounded font-medium transition-colors"
      >
        {isSaving ? 'Saving...' : 'Save & Connect'}
      </button>
    </div>
  );
};

export default Settings;
