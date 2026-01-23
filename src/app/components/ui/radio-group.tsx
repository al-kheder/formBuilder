import * as React from 'react';

interface RadioGroupProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

interface RadioGroupItemProps {
  value: string;
  id: string;
  className?: string;
}

const RadioGroupContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
} | null>(null);

export function RadioGroup({ value, onValueChange, children, className = '' }: RadioGroupProps) {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange }}>
      <div className={className}>{children}</div>
    </RadioGroupContext.Provider>
  );
}

export function RadioGroupItem({ value, id, className = '' }: RadioGroupItemProps) {
  const context = React.useContext(RadioGroupContext);
  
  if (!context) {
    throw new Error('RadioGroupItem must be used within RadioGroup');
  }

  const { value: selectedValue, onValueChange } = context;
  const isChecked = selectedValue === value;

  return (
    <input
      type="radio"
      id={id}
      value={value}
      checked={isChecked}
      onChange={() => onValueChange(value)}
      className={`h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer ${className}`}
    />
  );
}
