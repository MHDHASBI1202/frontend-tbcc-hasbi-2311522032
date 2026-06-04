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
      alert('Please enter a field name');
      return;
    }

    if (schema[newFieldName]) {
      alert('Field already exists');
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
      alert('Please enter a resource name');
      return;
    }
    setActiveResource(resourceName);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Resource Name
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={resourceName}
            onChange={(e) => setResourceName(e.target.value)}
            placeholder="e.g., users, products"
            className="flex-1 px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button onClick={handleSetResource} variant="outline">
            Set
          </Button>
        </div>
      </div>

      <div className="border-t border-input pt-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">Schema Fields</h3>

        {Object.keys(schema).length === 0 ? (
          <p className="text-sm text-muted-foreground mb-4">
            No fields defined yet
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
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-2 p-3 bg-muted rounded border border-input">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Add Field
            </label>
            <input
              type="text"
              value={newFieldName}
              onChange={(e) => setNewFieldName(e.target.value)}
              placeholder="Field name"
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
            Add Field
          </Button>
        </div>
      </div>
    </div>
  );
}
