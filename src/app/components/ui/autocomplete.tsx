import { useState, useRef, useEffect } from 'react';
import { Input } from '@/app/components/ui/input';
import { ChevronDown } from 'lucide-react';

interface AutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  options: string[];
  placeholder?: string;
  className?: string;
  id?: string;
  onValueCommit?: (value: string) => void; // Called when user commits a value (selects or leaves field)
  filterInput?: (value: string) => string; // Optional function to filter/transform input
}

export function Autocomplete({
  value,
  onChange,
  onBlur,
  options,
  placeholder,
  className = '',
  id,
  onValueCommit,
  filterInput,
}: AutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const previousValue = useRef<string>(value);

  useEffect(() => {
    if (value) {
      const filtered = options.filter((option) =>
        option.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(options);
    }
  }, [value, options]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
    if (onValueCommit) {
      onValueCommit(option);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const filteredValue = filterInput ? filterInput(inputValue) : inputValue;
    onChange(filteredValue);
    setIsOpen(true);
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  const handleBlur = () => {
    // Delay to allow click on dropdown item
    setTimeout(() => {
      // Check if value has changed and is not empty
      if (value && value !== previousValue.current && onValueCommit) {
        onValueCommit(value);
      }
      previousValue.current = value;
      
      if (onBlur) onBlur();
    }, 200);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <Input
          id={id}
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={className}
          autoComplete="off"
        />
        <ChevronDown
          className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"
        />
      </div>

      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredOptions.map((option, index) => (
            <div
              key={index}
              className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm"
              onClick={() => handleSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}