'use client';

import { useState } from 'react';
import { useApi } from '@/lib/api-context';
import { Button } from '@/components/ui/button';

const FIELD_TYPES = [
  'text',
  'number',
  'email',
  'date',
  'select',
  'boolean',
];

export function SchemaEditor() {
  const { schema, setSchema, activeResource, setActiveResource } = useApi();
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState('text');
  const [resourceName, setResourceName] = useState(activeResource);

  const handleAddField = () => {
    if (!newFieldName.trim()) {
      alert('Silakan masukkan nama bidang');
      return;
    }

    if (schema[newFieldName]) {
      alert('Bidang sudah ada');
      return;
    }

    setSchema({
      ...schema,
      [newFieldName]: newFieldType,
    });

    setNewFieldName('');
    setNewFieldType('text');
  };

  const handleRemoveField = (fieldName: string) => {
    const { [fieldName]: _, ...updatedSchema } = schema;
    setSchema(updatedSchema);
  };

  const handleChangeFieldType = (fieldName: string, newType: string) => {
    setSchema({
      ...schema,
      [fieldName]: newType,
    });
  };

  const handleSetResource = () => {
    if (!resourceName.trim()) {
      alert('Silakan masukkan nama sumber daya');
      return;
    }
    setActiveResource(resourceName);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Nama Sumber Daya
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={resourceName}
            onChange={(e) => setResourceName(e.target.value)}
            placeholder="misal, pengguna, produk"
            className="flex-1 px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button onClick={handleSetResource} variant="outline">
            Atur
          </Button>
        </div>
      </div>

      <div className="border-t border-input pt-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">Bidang Skema</h3>

        {Object.keys(schema).length === 0 ? (
          <p className="text-sm text-muted-foreground mb-4">
            Belum ada bidang yang ditentukan
          </p>
        ) : (
          <div className="space-y-2 mb-4">
            {Object.entries(schema).map(([fieldName, fieldType]) => (
              <div
                key={fieldName}
                className="flex items-center justify-between p-2 bg-muted rounded border border-input"
              >
                <div className="flex-1">
                  <span className="text-sm font-medium text-foreground">
                    {fieldName}
                  </span>
                  <select
                    value={fieldType}
                    onChange={(e) =>
                      handleChangeFieldType(fieldName, e.target.value)
                    }
                    className="ml-2 px-2 py-1 border border-input rounded text-xs bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {FIELD_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRemoveField(fieldName)}
                >
                  Hapus
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-2 p-3 bg-muted rounded border border-input">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Tambah Bidang
            </label>
            <input
              type="text"
              value={newFieldName}
              onChange={(e) => setNewFieldName(e.target.value)}
              placeholder="Nama bidang"
              className="w-full px-2 py-1 border border-input rounded text-xs bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <select
              value={newFieldType}
              onChange={(e) => setNewFieldType(e.target.value)}
              className="w-full px-2 py-1 border border-input rounded text-xs bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {FIELD_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <Button onClick={handleAddField} size="sm" className="w-full">
            Tambah Bidang
          </Button>
        </div>
      </div>
    </div>
  );
}
