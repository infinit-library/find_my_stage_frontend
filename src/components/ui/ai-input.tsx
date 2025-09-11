import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface AIInputProps extends React.ComponentProps<"input"> {
  suggestions?: string[];
  onSuggestionSelect?: (suggestion: string) => void;
  generateAISuggestions?: (input: string) => Promise<string[]>;
  placeholder?: string;
  className?: string;
}

const AIInput = React.forwardRef<HTMLInputElement, AIInputProps>(
  ({ 
    suggestions = [], 
    onSuggestionSelect, 
    generateAISuggestions,
    placeholder,
    className,
    value,
    onChange,
    ...props 
  }, ref) => {
    const [inputValue, setInputValue] = useState(value || "");
    const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const suggestionRef = useRef<HTMLDivElement>(null);

    // Combine static suggestions with AI suggestions
    const allSuggestions = [...suggestions, ...aiSuggestions];
    const uniqueSuggestions = Array.from(new Set(allSuggestions));

    useEffect(() => {
      setInputValue(value || "");
    }, [value]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          inputRef.current &&
          !inputRef.current.contains(event.target as Node) &&
          suggestionRef.current &&
          !suggestionRef.current.contains(event.target as Node)
        ) {
          setShowSuggestions(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      onChange?.(e);

      if (newValue.length > 2 && generateAISuggestions) {
        setIsGenerating(true);
        try {
          const aiSuggestions = await generateAISuggestions(newValue);
          setAiSuggestions(aiSuggestions);
          setShowSuggestions(true);
        } catch (error) {
          console.error("Error generating AI suggestions:", error);
        } finally {
          setIsGenerating(false);
        }
      } else if (newValue.length > 0) {
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
        setAiSuggestions([]);
      }
    };

    const handleSuggestionClick = (suggestion: string) => {
      setInputValue(suggestion);
      setShowSuggestions(false);
      onSuggestionSelect?.(suggestion);
      
      // Create a synthetic event for the onChange handler
      const syntheticEvent = {
        target: { value: suggestion }
      } as React.ChangeEvent<HTMLInputElement>;
      onChange?.(syntheticEvent);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowSuggestions(false);
      }
    };

    return (
      <div className="relative">
        <Input
          ref={ref || inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (uniqueSuggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          placeholder={placeholder}
          className={cn(className)}
          {...props}
        />
        
        {showSuggestions && uniqueSuggestions.length > 0 && (
          <div
            ref={suggestionRef}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
          >
            {isGenerating && (
              <div className="px-3 py-2 text-sm text-gray-500 flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                Generating AI suggestions...
              </div>
            )}
            
            {uniqueSuggestions
              .filter(suggestion => 
                suggestion.toLowerCase().includes(inputValue.toLowerCase())
              )
              .slice(0, 8)
              .map((suggestion, index) => (
                <div
                  key={index}
                  className="px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-center justify-between"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <span className="font-medium text-gray-900">{suggestion}</span>
                  {aiSuggestions.includes(suggestion) && (
                    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full font-medium">
                      AI
                    </span>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    );
  }
);

AIInput.displayName = "AIInput";

export { AIInput };
