'use client';

import { useState } from 'react';
import { ApiSchema } from '@/lib/api-context';
import { Button } from '@/components/ui/button';

export interface DynamicFormProps {
  schema: ApiSchema;
  initialData?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  title?: string;
}

export function DynamicForm({
  schema,
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  title,
}: DynamicFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>(
    initialData || {}
  );
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await onSubmit(formData);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (fieldName: string, fieldType: string) => {
    const value = formData[fieldName] ?? '';

    switch (fieldType) {
      case 'text':
      case 'email':
        return (
          <input
            key={fieldName}
            type={fieldType === 'email' ? 'email' : 'text'}
            value={value}
            onChange={(e) => handleChange(fieldName, e.target.value)}
            placeholder={`Enter ${fieldName}`}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isSubmitting}
          />
        );

      case 'number':
        return (
          <input
            key={fieldName}
            type="number"
            value={value}
            onChange={(e) => handleChange(fieldName, parseFloat(e.target.value) || '')}
            placeholder={`Enter ${fieldName}`}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isSubmitting}
          />
        );

      case 'date':
        return (
          <input
            key={fieldName}
            type="date"
            value={value}
            onChange={(e) => handleChange(fieldName, e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isSubmitting}
          />
        );

      case 'boolean':
        return (
          <label
            key={fieldName}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => handleChange(fieldName, e.target.checked)}
              className="w-4 h-4 rounded border-input"
              disabled={isSubmitting}
            />
            <span className="text-sm text-foreground">{fieldName}</span>
          </label>
        );

      case 'select':
        return (
          <select
            key={fieldName}
            value={value}
            onChange={(e) => handleChange(fieldName, e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isSubmitting}
          >
            <option value="">Select {fieldName}</option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </select>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {title && <h3 className="text-lg font-semibold text-foreground">{title}</h3>}

      <div className="space-y-3">
        {Object.entries(schema).map(([fieldName, fieldType]) =>
          renderField(fieldName, fieldType)
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-2 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || Object.keys(schema).length === 0}
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
}
