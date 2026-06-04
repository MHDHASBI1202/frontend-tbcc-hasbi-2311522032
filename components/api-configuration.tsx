'use client';

import { useState } from 'react';
import { useApi } from '@/lib/api-context';
import { getApiService } from '@/lib/api-service';
import { Button } from '@/components/ui/button';

export function ApiConfiguration() {
  const { baseUrl, setBaseUrl, setIsConnected, setSchema } = useApi();
  const [inputUrl, setInputUrl] = useState(baseUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleConnect = async () => {
    if (!inputUrl.trim()) {
      setError('Please enter a base URL');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const apiService = getApiService(inputUrl);
      const isConnected = await apiService.testConnection();

      if (isConnected) {
        setBaseUrl(inputUrl);
        setIsConnected(true);
        setSuccess('Connected successfully!');
        // Reset schema on new connection
        setSchema({});
      } else {
        setError('Failed to connect to the API');
        setIsConnected(false);
      }
    } catch (err: any) {
      setError(err.message || 'Connection failed');
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          API Base URL
        </label>
        <input
          type="text"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          placeholder="https://api.example.com"
          className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={isLoading}
        />
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-100 border border-green-300 rounded text-green-700 text-sm">
          {success}
        </div>
      )}

      <Button
        onClick={handleConnect}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? 'Connecting...' : 'Connect'}
      </Button>
    </div>
  );
}
