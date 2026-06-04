'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export interface ApiSchema {
  [key: string]: 'text' | 'number' | 'email' | 'date' | 'select' | 'boolean';
}

export interface ApiContextType {
  baseUrl: string;
  setBaseUrl: (url: string) => void;
  schema: ApiSchema;
  setSchema: (schema: ApiSchema) => void;
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
  activeResource: string;
  setActiveResource: (resource: string) => void;
  recordCount: number;
  setRecordCount: (count: number) => void;
  lastResponseTime: number;
  setLastResponseTime: (time: number) => void;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export function ApiProvider({ children }: { children: React.ReactNode }) {
  const [baseUrl, setBaseUrl] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('apiBaseUrl') || '';
    }
    return '';
  });

  const [schema, setSchema] = useState<ApiSchema>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('apiSchema');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  const [isConnected, setIsConnected] = useState(false);
  const [activeResource, setActiveResource] = useState('');
  const [recordCount, setRecordCount] = useState(0);
  const [lastResponseTime, setLastResponseTime] = useState(0);

  const value: ApiContextType = {
    baseUrl,
    setBaseUrl: (url) => {
      setBaseUrl(url);
      if (typeof window !== 'undefined') {
        localStorage.setItem('apiBaseUrl', url);
      }
    },
    schema,
    setSchema: (newSchema) => {
      setSchema(newSchema);
      if (typeof window !== 'undefined') {
        localStorage.setItem('apiSchema', JSON.stringify(newSchema));
      }
    },
    isConnected,
    setIsConnected,
    activeResource,
    setActiveResource,
    recordCount,
    setRecordCount,
    lastResponseTime,
    setLastResponseTime,
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

export function useApi() {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be used within ApiProvider');
  }
  return context;
}
