import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Check, Loader2, Brain, Zap } from "lucide-react";
import { aiSuggestionService } from "@/lib/ai-suggestions";

interface TopicAIInputProps {
  value: string;
  onChange: (value: string) => void;
  industryContext: string;
  placeholder?: string;
  className?: string;
  label?: string;
  onValidationChange?: (status: 'loading' | 'match' | 'different' | null) => void;
}

const TopicAIInput: React.FC<TopicAIInputProps> = ({
  value,
  onChange,
  industryContext,
  placeholder = "Type your speaking topic or describe what you want to speak about...",
  className,
  label = "Speaking Topic",
  onValidationChange
}) => {
  const [inputValue, setInputValue] = useState(value || "");
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [industryHints, setIndustryHints] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isConvertingSentence, setIsConvertingSentence] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'loading' | 'match' | 'different' | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRef = useRef<HTMLDivElement>(null);

  // Load industry hints when industry context changes
  useEffect(() => {
    if (industryContext && industryContext.length > 2) {
      const loadIndustryHints = async () => {
        try {
          const hints = await aiSuggestionService.getIndustryTopicHints(industryContext);
          setIndustryHints(hints);
        } catch (error) {
          console.error('Error loading industry hints:', error);
        }
      };
      loadIndustryHints();
    } else {
      setIndustryHints([]);
    }
  }, [industryContext]);

  // Update input value when prop changes
  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  // Notify parent component of validation status changes
  useEffect(() => {
    onValidationChange?.(validationStatus);
  }, [validationStatus, onValidationChange]);

  // Handle click outside to close suggestions
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

  // Check if input matches suggestions
  const checkInputMatch = (input: string, suggestions: string[]) => {
    if (!input || input.length < 2 || suggestions.length === 0) {
      return null;
    }
    
    const normalizedInput = input.toLowerCase().trim();
    
    // Check for exact match
    const exactMatch = suggestions.some(suggestion => 
      suggestion.toLowerCase().trim() === normalizedInput
    );
    
    if (exactMatch) {
      return 'match';
    }
    
    // Check for partial match
    const partialMatch = suggestions.some(suggestion => 
      suggestion.toLowerCase().trim().includes(normalizedInput) ||
      normalizedInput.includes(suggestion.toLowerCase().trim())
    );
    
    if (partialMatch) {
      return 'match';
    }
    
    return 'different';
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Don't call onChange immediately - wait for hint selection
    // onChange(newValue);

    // Check if input looks like a sentence (multiple words, contains spaces)
    const isSentence = newValue.includes(' ') && newValue.split(' ').length > 2;

    // Generate AI suggestions if input is long enough
    if (newValue.length >= 2) {
      setIsGenerating(true);
      setValidationStatus('loading');
      
      try {
        const suggestions = await aiSuggestionService.generateTopicSuggestions(newValue, industryContext);
        setAiSuggestions(suggestions);
        setShowSuggestions(true);
        
        // Don't validate against suggestions - user must select
        setValidationStatus('different'); // Always show as needing selection
      } catch (error) {
        console.error('Error generating AI suggestions:', error);
        setValidationStatus(null);
      } finally {
        setIsGenerating(false);
      }
    } else {
      setAiSuggestions([]);
      setShowSuggestions(false);
      setValidationStatus(null);
    }

    // Convert sentence to topics if enabled and input looks like a sentence
    if (isSentence && newValue.length > 10) {
      setIsConvertingSentence(true);
      try {
        const topics = await aiSuggestionService.convertSentenceToTopic(newValue, industryContext);
        if (topics.length > 0) {
          setAiSuggestions(prev => {
            const combined = [...prev, ...topics];
            return Array.from(new Set(combined)); // Remove duplicates
          });
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error('Error converting sentence to topics:', error);
      } finally {
        setIsConvertingSentence(false);
      }
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setShowSuggestions(false);
    onChange(suggestion);
    setValidationStatus('match');
    setAiSuggestions([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const allSuggestions = [...industryHints, ...aiSuggestions];
  const uniqueSuggestions = Array.from(new Set(allSuggestions));

  return (
    <div className="space-y-2">
      <Label htmlFor="topic-ai-input">{label}</Label>
      <div className="relative">
        <div className="relative">
          <Input
            ref={inputRef}
            id="topic-ai-input"
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
                  <span className="text-red-600 text-xs">✕</span>
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
            
            {isConvertingSentence && (
              <div className="px-3 py-2 text-sm text-gray-500 flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2"></div>
                Converting sentence to topics...
              </div>
            )}

            {/* Show industry hints when no input and industry context is available */}
            {industryHints.length > 0 && !inputValue && (
              <>
                <div className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-50 border-b flex items-center gap-2">
                  <Brain className="h-3 w-3" />
                  Popular topics for {industryContext}:
                </div>
                {industryHints.slice(0, 8).map((hint, index) => (
                  <div
                    key={`hint-${index}`}
                    className="px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                    onClick={() => handleSuggestionClick(hint)}
                  >
                    <span className="text-blue-600 font-medium">{hint}</span>
                    <span className="text-xs text-gray-400 ml-2">(Industry hint)</span>
                  </div>
                ))}
              </>
            )}
            
            {/* Show AI suggestions */}
            {aiSuggestions
              .filter(suggestion => 
                suggestion.toLowerCase().includes(String(inputValue).toLowerCase())
              )
              .slice(0, 8)
              .map((suggestion, index) => (
                <div
                  key={index}
                  className="px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-center justify-between group"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <span className="font-medium text-gray-900 group-hover:text-blue-600">{suggestion}</span>
                  <div className="flex items-center gap-1">
                    <Zap className="h-3 w-3 text-purple-600" />
                    <span className="text-xs text-gray-400">Click to select</span>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
      
      {/* Help text */}
      <div className="text-xs text-muted-foreground">
        {industryContext ? (
          <span>💡 Type a sentence or topic description, then <strong>select a hint</strong> from the AI suggestions</span>
        ) : (
          <span>💡 Select an industry first to get AI-powered topic suggestions</span>
        )}
      </div>
    </div>
  );
};

export default TopicAIInput;
