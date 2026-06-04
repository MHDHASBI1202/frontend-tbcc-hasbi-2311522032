'use client';

import { useApi } from '@/lib/api-context';

export function StatusIndicator() {
  const { isConnected, recordCount, lastResponseTime, activeResource } = useApi();

  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2">
        <div
          className={`w-3 h-3 rounded-full ${
            isConnected ? 'bg-green-500' : 'bg-red-500'
          }`}
        />
        <span className="text-sm text-foreground">
          {isConnected ? 'Terhubung' : 'Terputus'}
        </span>
      </div>

      {isConnected && activeResource && (
        <>
          <div>
            <span className="text-xs text-muted-foreground">Catatan: </span>
            <span className="text-sm font-medium text-foreground">{recordCount}</span>
          </div>

          {lastResponseTime > 0 && (
            <div>
              <span className="text-xs text-muted-foreground">Respons: </span>
              <span className="text-sm font-medium text-foreground">
                {lastResponseTime.toFixed(2)}ms
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
