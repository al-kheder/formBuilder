import * as React from "react";
import { X } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/app/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/app/components/ui/popover";
import { Badge } from "@/app/components/ui/badge";

interface MultiSelectProps {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  maxSelections?: number;
}

export function MultiSelect({
  options,
  value = [],
  onChange,
  placeholder = "Select items...",
  className = "",
  id,
  maxSelections,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSelect = (selectedValue: string) => {
    // If item is already selected, allow removal
    if (value.includes(selectedValue)) {
      onChange(value.filter((item) => item !== selectedValue));
      return;
    }
    
    // Check if we've reached the maximum selections
    if (maxSelections && value.length >= maxSelections) {
      return; // Don't allow more selections
    }
    
    // Add the new selection
    onChange([...value, selectedValue]);
  };

  const handleRemove = (itemToRemove: string) => {
    onChange(value.filter((item) => item !== itemToRemove));
  };

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          id={id}
          className={`flex min-h-12 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer ${className}`}
          onClick={() => setOpen(!open)}
        >
          <div className="flex flex-wrap gap-1.5 flex-1 py-0.5">
            {value.length > 0 ? (
              value.map((item) => (
                <Badge
                  key={item}
                  variant="secondary"
                  className="mr-1 mb-1 bg-blue-100 text-blue-800 hover:bg-blue-200 px-2.5 py-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(item);
                  }}
                >
                  {item}
                  <button
                    className="ml-1.5 ring-offset-white rounded-full outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.stopPropagation();
                        handleRemove(item);
                      }
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(item);
                    }}
                  >
                    <X className="h-3 w-3 text-blue-600 hover:text-blue-800" />
                  </button>
                </Badge>
              ))
            ) : (
              <span className="text-gray-500">{placeholder}</span>
            )}
          </div>
          <svg
            className="h-4 w-4 opacity-50 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Search..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {maxSelections && value.length >= maxSelections && (
              <div className="px-2 py-3 text-xs text-center text-amber-600 bg-amber-50 border-b border-amber-200">
                Maximum of {maxSelections} {maxSelections === 1 ? 'selection' : 'selections'} reached. Remove one to add another.
              </div>
            )}
            <CommandGroup className="max-h-64 overflow-auto">
              {filteredOptions.map((option) => {
                const isSelected = value.includes(option);
                const isDisabled = maxSelections ? value.length >= maxSelections && !isSelected : false;
                return (
                  <CommandItem
                    key={option}
                    onSelect={() => handleSelect(option)}
                    className={`cursor-pointer ${isDisabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                    disabled={isDisabled}
                  >
                    <div
                      className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-gray-300 ${
                        isSelected
                          ? "bg-blue-600 text-white"
                          : isDisabled
                          ? "opacity-30"
                          : "opacity-50"
                      }`}
                    >
                      {isSelected && (
                        <svg
                          className="h-3 w-3"
                          fill="currentColor"
                          viewBox="0 0 12 12"
                        >
                          <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <span>{option}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}