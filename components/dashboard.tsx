'use client';

import { useState, useEffect } from 'react';
import { useApi } from '@/lib/api-context';
import { getApiService } from '@/lib/api-service';
import { DynamicTable } from './dynamic-table';
import { DynamicForm } from './dynamic-form';
import { SchemaEditor } from './schema-editor';
import { ApiConfiguration } from './api-configuration';
import { StatusIndicator } from './status-indicator';
import { Modal } from './modal';
import { useToast, ToastContainer } from './toast';

type FormMode = 'create' | 'edit';

export function Dashboard() {
  const api = useApi();
  const { toasts, addToast, removeToast } = useToast();

  const [records, setRecords] = useState<Record<string, any>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingRecord, setEditingRecord] = useState<Record<string, any> | null>(
    null
  );
  const [formMode, setFormMode] = useState<FormMode>('create');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const recordsPerPage = 10;

  // Fetch records when resource or page changes
  useEffect(() => {
    if (api.isConnected && api.activeResource) {
      fetchRecords();
    }
  }, [api.isConnected, api.activeResource, currentPage]);

  const fetchRecords = async () => {
    if (!api.baseUrl || !api.activeResource) return;

    setIsLoading(true);
    try {
      const apiService = getApiService(api.baseUrl);
      let result;

      if (searchQuery) {
        result = await apiService.searchRecords(api.activeResource, searchQuery);
      } else {
        result = await apiService.getRecords(
          api.activeResource,
          currentPage,
          recordsPerPage
        );
      }

      setRecords(result.data);
      api.setRecordCount(result.total);
      api.setLastResponseTime(result.responseTime);
      addToast('Records loaded successfully', 'success');
    } catch (error: any) {
      addToast(error.message || 'Failed to load records', 'error');
      setRecords([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleNewRecord = () => {
    setEditingRecord(null);
    setFormMode('create');
    setIsFormOpen(true);
  };

  const handleEditRecord = (record: Record<string, any>) => {
    setEditingRecord(record);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: Record<string, any>) => {
    if (!api.baseUrl || !api.activeResource) return;

    try {
      const apiService = getApiService(api.baseUrl);

      if (formMode === 'create') {
        await apiService.createRecord(api.activeResource, data);
        addToast('Record created successfully', 'success');
      } else if (editingRecord?.id) {
        await apiService.updateRecord(api.activeResource, editingRecord.id, data);
        addToast('Record updated successfully', 'success');
      }

      setIsFormOpen(false);
      await fetchRecords();
    } catch (error: any) {
      addToast(error.message || 'Failed to save record', 'error');
    }
  };

  const handleDeleteRecord = async (id: string | number) => {
    if (!confirm('Are you sure you want to delete this record?')) return;

    if (!api.baseUrl || !api.activeResource) return;

    try {
      const apiService = getApiService(api.baseUrl);
      await apiService.deleteRecord(api.activeResource, id);
      addToast('Record deleted successfully', 'success');
      await fetchRecords();
    } catch (error: any) {
      addToast(error.message || 'Failed to delete record', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-input bg-muted sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">API Tester</h1>
            <p className="text-sm text-muted-foreground">
              Test and manage your API endpoints
            </p>
          </div>
          <StatusIndicator />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="space-y-6">
              <div className="bg-card border border-input rounded-lg p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Configuration
                </h2>
                <ApiConfiguration />
              </div>

              {api.isConnected && (
                <div className="bg-card border border-input rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    Schema
                  </h2>
                  <SchemaEditor />
                </div>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {!api.isConnected ? (
              <div className="bg-card border border-input rounded-lg p-8 text-center">
                <p className="text-muted-foreground mb-4">
                  Connect to an API to get started
                </p>
              </div>
            ) : !api.activeResource ? (
              <div className="bg-card border border-input rounded-lg p-8 text-center">
                <p className="text-muted-foreground">
                  Select or configure a resource in the sidebar
                </p>
              </div>
            ) : (
              <div className="bg-card border border-input rounded-lg p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  {api.activeResource}
                </h2>
                <DynamicTable
                  schema={api.schema}
                  data={records}
                  onEdit={handleEditRecord}
                  onDelete={handleDeleteRecord}
                  onNew={handleNewRecord}
                  isLoading={isLoading}
                  currentPage={currentPage}
                  totalRecords={api.recordCount}
                  recordsPerPage={recordsPerPage}
                  onPageChange={setCurrentPage}
                  onSearch={handleSearch}
                  searchQuery={searchQuery}
                />
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={formMode === 'create' ? 'Create Record' : 'Edit Record'}
      >
        <DynamicForm
          schema={api.schema}
          initialData={editingRecord || {}}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormOpen(false)}
          title={
            formMode === 'create'
              ? `Create new ${api.activeResource}`
              : `Edit ${api.activeResource}`
          }
        />
      </Modal>

      {/* Toasts */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
