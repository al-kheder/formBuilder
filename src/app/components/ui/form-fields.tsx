import React from 'react';
import { FieldApi } from '@tanstack/react-form';
import { Label } from '@/app/components/ui/label';
import { Input } from '@/app/components/ui/input';
import { Autocomplete } from '@/app/components/ui/autocomplete';
import { MultiSelect } from '@/app/components/ui/multi-select';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';

interface FormFieldProps {
  field: FieldApi<any, any, any, any>;
  label: string;
  className?: string;
}

interface FormInputProps extends FormFieldProps {
  type?: string;
  placeholder?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  pattern?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FormInput({
  field,
  label,
  type = 'text',
  placeholder,
  className,
  inputMode,
  pattern,
  onChange,
}: FormInputProps) {
  const value = field.state.value;
  const safeValue = typeof value === 'string' || typeof value === 'number' ? value : '';

  return (
    <div className={className}>
      <Label htmlFor={field.name} className="text-sm mb-2 block">
        {label}
      </Label>
      <Input
        id={field.name}
        type={type}
        inputMode={inputMode}
        pattern={pattern}
        value={safeValue}
        onBlur={field.handleBlur}
        onChange={(e) => {
          if (onChange) {
            onChange(e);
          }
          field.handleChange(e.target.value);
        }}
        className="border-gray-300"
        placeholder={placeholder}
      />
    
    </div>
  );
}

interface FormAutocompleteProps extends FormFieldProps {
  options: string[];
  placeholder?: string;
  onValueCommit?: (value: string) => void;
  filterInput?: (value: string) => string;
}

export function FormAutocomplete({
  field,
  label,
  options,
  placeholder,
  onValueCommit,
  filterInput,
  className,
}: FormAutocompleteProps) {
  return (
    <div className={className}>
      <Label htmlFor={field.name} className="text-sm mb-2 block">
        {label}
      </Label>
      <Autocomplete
        id={field.name}
        value={field.state.value ?? ''}
        onChange={(val) => field.handleChange(val)}
        className="border-gray-300"
        options={options}
        onValueCommit={onValueCommit}
        filterInput={filterInput}
        placeholder={placeholder}
      />
      {field.state.meta.errors ? (
        <p className="text-red-500 text-sm mt-1">{field.state.meta.errors.join(', ')}</p>
      ) : null}
    </div>
  );
}

interface FormMultiSelectProps extends FormFieldProps {
  options: string[];
  placeholder?: string;
  maxSelections?: number;
}

export function FormMultiSelect({
  field,
  label,
  options,
  placeholder,
  maxSelections,
  className,
}: FormMultiSelectProps) {
  const value = field.state.value;
  const safeValue = Array.isArray(value) ? value : [];

  return (
    <div className={className}>
      <Label htmlFor={field.name} className="text-sm mb-2 block">
        {label}
      </Label>
      <MultiSelect
        id={field.name}
        value={safeValue}
        onChange={(val) => field.handleChange(val)}
        options={options}
        placeholder={placeholder}
        maxSelections={maxSelections}
      />
      {field.state.meta.errors ? (
        <p className="text-red-500 text-sm mt-1">{field.state.meta.errors.join(', ')}</p>
      ) : null}
    </div>
  );
}

interface RadioOption {
  value: string;
  label: string;
  id: string;
}

interface FormRadioGroupProps extends Omit<FormFieldProps, 'label'> {
  options: RadioOption[];
  label?: string;
}

export function FormRadioGroup({
  field,
  options,
  label,
  className,
}: FormRadioGroupProps) {
  const value = field.state.value;
  // Ensure we pass undefined if value is not string, to avoid [object Object]
  const safeValue = typeof value === 'string' ? value : undefined;

  return (
    <div className={className}>
      {label && <Label className="text-base font-normal mb-4 block">{label}</Label>}
      <RadioGroup
        value={safeValue}
        onValueChange={(val) => field.handleChange(val)}
        className="flex gap-8"
      >
        {options.map((option) => (
          <div
            key={option.value}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => field.handleChange(option.value)}
          >
            <RadioGroupItem value={option.value} id={option.id} />
            <Label htmlFor={option.id} className="cursor-pointer text-base">
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
      {field.state.meta.errors ? (
        <p className="text-red-500 text-sm mt-1">{field.state.meta.errors.join(', ')}</p>
      ) : null}
    </div>
  );
}

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({ title, children, className = "mb-8 pb-6 border-b-2 border-gray-200 form-section" }: FormSectionProps) {
  return (
    <div className={className}>
      <h2 className="text-sm uppercase tracking-wider mb-6" style={{ letterSpacing: '0.1em' }}>
        {title}
      </h2>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}
