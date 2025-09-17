import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import IndustrySelector from "@/components/ui/industry-selector";
import TopicAIInput from "@/components/ui/topic-ai-input";
// Removed old taxonomy imports - now using actual values
import { toast } from "sonner";
import { Brain, Search, CheckCircle, AlertCircle } from "lucide-react";

const SearchPage = () => {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [industry, setIndustry] = useState("");
  const [topicValidation, setTopicValidation] = useState<'loading' | 'match' | 'different' | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
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

    // Add a small delay to show the loading state
    setTimeout(() => {
      // Pass the actual values instead of mapping to "Other"
      navigate("/results", { state: { topic: topic, industry: industry } });
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <Card className="shadow-card">
          <form onSubmit={onSubmit}>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Brain className="h-6 w-6 text-purple-600" />
                Find Stages That Fit You
              </CardTitle>
              <CardDescription>
                Select your industry and let AI help you find the perfect speaking topic.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Industry Selection */}
              <IndustrySelector
                value={industry}
                onChange={setIndustry}
                placeholder="Search and select your industry..."
              />

              {/* Topic AI Input */}
              <TopicAIInput
                value={topic}
                onChange={setTopic}
                industryContext={industry}
                placeholder="Type your speaking topic or describe what you want to speak about..."
                onValidationChange={setTopicValidation}
              />
              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  variant="hero"
                  className="w-full"
                  disabled={topicValidation === 'different' || topicValidation === 'loading' || isSearching}
                >
                  {isSearching ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Searching...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4" />
                      Find Speaking Opportunities
                    </div>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  disabled={isSearching}
                  className="w-full mt-4"
                  onClick={() => navigate("/")}
                >
                  Back to Home
                </Button>
              </div>

              {/* Validation Messages */}
              <div className="space-y-2">
                {topicValidation === 'different' && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <p className="text-sm text-red-600">
                      Please select a topic hint from the AI suggestions before searching.
                    </p>
                  </div>
                )}
                {topicValidation === 'loading' && (
                  <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm text-blue-600">
                      AI is analyzing your topic...
                    </p>
                  </div>
                )}
                {topicValidation === 'match' && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <p className="text-sm text-green-600">
                      Perfect! You've selected a topic hint. Ready to search!
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default SearchPage;

