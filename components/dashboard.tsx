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
      addToast('Catatan berhasil dimuat', 'success');
    } catch (error: any) {
      addToast(error.message || 'Gagal memuat catatan', 'error');
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
        addToast('Catatan berhasil dibuat', 'success');
      } else if (editingRecord?.id) {
        await apiService.updateRecord(api.activeResource, editingRecord.id, data);
        addToast('Catatan berhasil diperbarui', 'success');
      }

      setIsFormOpen(false);
      await fetchRecords();
    } catch (error: any) {
      addToast(error.message || 'Gagal menyimpan catatan', 'error');
    }
  };

  const handleDeleteRecord = async (id: string | number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus catatan ini?')) return;

    if (!api.baseUrl || !api.activeResource) return;

    try {
      const apiService = getApiService(api.baseUrl);
      await apiService.deleteRecord(api.activeResource, id);
      addToast('Catatan berhasil dihapus', 'success');
      await fetchRecords();
    } catch (error: any) {
      addToast(error.message || 'Gagal menghapus catatan', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-input bg-muted sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Tugas Besar Cloud Computing 2026</h1>
            <p className="text-sm text-muted-foreground">
              Tester dan kelola endpoint REST API Anda
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
                  Konfigurasi
                </h2>
                <ApiConfiguration />
              </div>

              {api.isConnected && (
                <div className="bg-card border border-input rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    Skema
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
                  Hubungkan ke API untuk memulai
                </p>
              </div>
            ) : !api.activeResource ? (
              <div className="bg-card border border-input rounded-lg p-8 text-center">
                <p className="text-muted-foreground">
                  Pilih atau konfigurasi sumber daya di sidebar
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
        title={formMode === 'create' ? 'Buat Catatan' : 'Edit Catatan'}
      >
        <DynamicForm
          schema={api.schema}
          initialData={editingRecord || {}}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormOpen(false)}
          title={
            formMode === 'create'
              ? `Buat ${api.activeResource} baru`
              : `Edit ${api.activeResource}`
          }
        />
      </Modal>

      {/* Toasts */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
