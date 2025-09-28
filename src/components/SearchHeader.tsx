import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import IndustrySelector from "@/components/ui/industry-selector";
import TopicAIInput from "@/components/ui/topic-ai-input";
import { Search, Mic } from "lucide-react";
import { toast } from "sonner";

interface SearchHeaderProps {
  currentIndustry?: string;
  currentTopic?: string;
  className?: string;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
  currentIndustry = "",
  currentTopic = "",
  className = ""
}) => {
  const navigate = useNavigate();
  const [industry, setIndustry] = useState(currentIndustry);
  const [topic, setTopic] = useState(currentTopic);
  const [topicValidation, setTopicValidation] = useState<'loading' | 'match' | 'different' | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      // Validate required fields
      if (!industry) {
        toast.error("Please select an industry.");
        return;
      }

      if (!topic) {
        toast.error("Please enter a speaking topic.");
        return;
      }

      if (topicValidation === 'different') {
        toast.error("Please select a topic hint from the AI suggestions before proceeding.");
        return;
      }

      // Check if topic is still loading
      if (topicValidation === 'loading') {
        toast.error("Please wait for AI suggestions to finish loading.");
        return;
      }

      setIsSearching(true);

      // Navigate to results page with new search parameters
      navigate("/results", { state: { topic: topic, industry: industry } });
    } catch (e) { 
      console.error(e);
      toast.error("An error occurred while searching. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 shadow-sm ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Mic className="h-5 w-5 text-primary" />
          <span className="text-base font-semibold text-gray-900">New Search</span>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-xs text-gray-600">
          Modify your search criteria to find different speaking opportunities.
        </p>
      </div>
      
      <form onSubmit={handleSearch} className="space-y-3">
        <div className="space-y-3">
          {/* Industry Selection */}
          <div className="space-y-1">
            <IndustrySelector
              value={industry}
              onChange={setIndustry}
              placeholder="Search and select your industry..."
              label="Industry"
            />
          </div>

          {/* Topic AI Input */}
          <div className="space-y-1">
            <TopicAIInput
              value={topic}
              onChange={setTopic}
              industryContext={industry}
              placeholder="Type your speaking topic..."
              label="Speaking Topic"
              onValidationChange={setTopicValidation}
            />
          </div>
        </div>

        {/* Search Button */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="hero"
            size="sm"
            disabled={topicValidation === 'different' || topicValidation === 'loading' || isSearching}
            className="w-full py-2 text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200"
          >
            {isSearching ? (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Searching...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Search className="h-3 w-3" />
                Find Opportunities
              </div>
            )}
          </Button>
        </div>

        {/* Validation Messages */}
        <div className="space-y-1">
          {topicValidation === 'different' && (
            <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-md">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
              <p className="text-xs text-red-600">
                Please select a topic hint from AI suggestions.
              </p>
            </div>
          )}
          {topicValidation === 'loading' && (
            <div className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
              <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-blue-600">
                AI is analyzing your topic...
              </p>
            </div>
          )}
          {topicValidation === 'match' && (
            <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-md">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <p className="text-xs text-green-600">
                Ready to search!
              </p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default SearchHeader;
