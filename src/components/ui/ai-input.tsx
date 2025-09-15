import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Check, X, Loader2 } from "lucide-react";
import { AISuggestionService } from "@/lib/ai-suggestions";

interface AIInputProps extends React.ComponentProps<"input"> {
  suggestions?: string[];
  onSuggestionSelect?: (suggestion: string) => void;
  generateAISuggestions?: (input: string) => Promise<string[]>;
  placeholder?: string;
  className?: string;
  onValidationChange?: (status: 'loading' | 'match' | 'different' | null) => void;
  isTopicField?: boolean; // Special flag for topic field to be more lenient
  industryContext?: string; // Industry context for topic validation
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
    onValidationChange,
    isTopicField = false,
    industryContext,
    ...props 
  }, ref) => {
    const [inputValue, setInputValue] = useState(value || "");
    const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [validationStatus, setValidationStatus] = useState<'loading' | 'match' | 'different' | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const suggestionRef = useRef<HTMLDivElement>(null);

    // Combine static suggestions with AI suggestions
    const allSuggestions = [...suggestions, ...aiSuggestions];
    const uniqueSuggestions = Array.from(new Set(allSuggestions));

    // Function to check if input matches AI suggestions (more flexible)
    const checkInputMatch = (input: string, suggestions: string[]) => {
      if (!input || input.length < 2 || suggestions.length === 0) {
        return null;
      }
      
      const normalizedInput = input.toLowerCase().trim();
      
      // For topic fields, first check if topic is related to industry
      if (isTopicField && industryContext) {
        const aiService = AISuggestionService.getInstance();
        const isRelatedToIndustry = aiService.isTopicRelatedToIndustry(input, industryContext);
        
        if (!isRelatedToIndustry) {
          return 'different'; // Topic is not related to industry - block search
        }
      }
      
      // Check for exact match
      const exactMatch = suggestions.some(suggestion => 
        suggestion.toLowerCase().trim() === normalizedInput
      );
      
      if (exactMatch) {
        return 'match';
      }
      
      // Check for partial match (input is contained in suggestion)
      const partialMatch = suggestions.some(suggestion => 
        suggestion.toLowerCase().trim().includes(normalizedInput)
      );
      
      if (partialMatch) {
        return 'match';
      }
      
      // Check for fuzzy match (suggestion words start with input)
      const fuzzyMatch = suggestions.some(suggestion => 
        suggestion.toLowerCase().split(' ').some(word => word.startsWith(normalizedInput))
      );
      
      if (fuzzyMatch) {
        return 'match';
      }
      
      // Check for reverse match (suggestion is contained in input)
      const reverseMatch = suggestions.some(suggestion => 
        normalizedInput.includes(suggestion.toLowerCase().trim())
      );
      
      if (reverseMatch) {
        return 'match';
      }
      
      if (isTopicField) {
        const inputWords = normalizedInput.split(' ');
        const wordMatch = suggestions.some(suggestion => {
          const suggestionWords = suggestion.toLowerCase().split(' ');
          return inputWords.some(inputWord => 
            suggestionWords.some(suggestionWord => 
              suggestionWord.includes(inputWord) || inputWord.includes(suggestionWord)
            )
          );
        });
        
        if (wordMatch) {
          return 'match';
        }
      }
      
      // If we reach here, the input doesn't match any suggestions
      // For topic fields with industry context, this means it's not related
      if (isTopicField && industryContext) {
        return 'different'; // Topic doesn't match industry-specific suggestions
      }
      
      return 'different';
    };

    useEffect(() => {
      setInputValue(value || "");
      // Reset validation status when value changes externally
      if (!value || String(value).length < 2) {
        setValidationStatus(null);
      }
    }, [value]);

    // Notify parent component of validation status changes
    useEffect(() => {
      onValidationChange?.(validationStatus);
    }, [validationStatus, onValidationChange]);

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

      if (String(newValue).length > 2 && generateAISuggestions) {
        setIsGenerating(true);
        setValidationStatus('loading');
        try {
          const aiSuggestions = await generateAISuggestions(newValue);
          setAiSuggestions(aiSuggestions);
          setShowSuggestions(true);
          
          // Check if input matches any AI suggestions
          const matchStatus = checkInputMatch(newValue, aiSuggestions);
          setValidationStatus(matchStatus);
        } catch (error) {
          console.error("Error generating AI suggestions:", error);
          setValidationStatus(null);
        } finally {
          setIsGenerating(false);
        }
      } else if (String(newValue).length > 0) {
        setShowSuggestions(true);
        // Check against existing AI suggestions if any
        const matchStatus = checkInputMatch(newValue, aiSuggestions);
        setValidationStatus(matchStatus);
      } else {
        setShowSuggestions(false);
        setAiSuggestions([]);
        setValidationStatus(null);
      }
    };

    const handleSuggestionClick = (suggestion: string) => {
      setInputValue(suggestion);
      setShowSuggestions(false);
      onSuggestionSelect?.(suggestion);
      
      // Set validation status to match since user selected from AI suggestions
      setValidationStatus('match');
      
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
            className={cn(className, "pr-10")}
            {...props}
          />
          
          {/* Visual indicator */}
          {validationStatus && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
              {validationStatus === 'loading' && (
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
              )}
              {validationStatus === 'match' && (
                <div className="flex items-center justify-center w-5 h-5 bg-green-100 rounded-full">
                  <Check className="h-3 w-3 text-green-600" />
                </div>
              )}
              {validationStatus === 'different' && (
                <div className="flex items-center justify-center w-5 h-5 bg-red-100 rounded-full">
                  <X className="h-3 w-3 text-red-600" />
                </div>
              )}
            </div>
          )}
        </div>
        
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
                suggestion.toLowerCase().includes(String(inputValue).toLowerCase())
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
