import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AIInput } from "@/components/ui/ai-input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { TOP_INDUSTRIES, TOP_TOPICS, mapToTopOrOther } from "@/lib/taxonomy";
import { aiSuggestionService } from "@/lib/ai-suggestions";
import { toast } from "sonner";

const SearchPage = () => {
    const navigate = useNavigate();
    const [topic, setTopic] = useState("");
    const [industry, setIndustry] = useState("");
    const [industryValidation, setIndustryValidation] = useState<'loading' | 'match' | 'different' | null>(null);
    const [topicValidation, setTopicValidation] = useState<'loading' | 'match' | 'different' | null>(null);
    const [isSearching, setIsSearching] = useState(false);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Check if either field shows a red X (different validation status)
        if (industryValidation === 'different' || topicValidation === 'different') {
            toast.error("Please ensure your input matches the AI suggestions before proceeding.");
            return;
        }
        
        // Check if either field is still loading
        if (industryValidation === 'loading' || topicValidation === 'loading') {
            toast.error("Please wait for AI suggestions to finish loading.");
            return;
        }
        
        setIsSearching(true);
        
        // Add a small delay to show the loading state
        setTimeout(() => {
            const mappedTopic = mapToTopOrOther(topic, TOP_TOPICS);
            const mappedIndustry = mapToTopOrOther(industry, TOP_INDUSTRIES);
            navigate("/results", { state: { topic: mappedTopic, industry: mappedIndustry } });
        }, 500);
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <div className="w-full max-w-2xl">
                <Card className="shadow-card">
                    <form onSubmit={onSubmit}>
                        <CardHeader className="text-center">
                            <CardTitle>Find Stages That Fit You</CardTitle>
                            <CardDescription>Enter the basics. We'll surface verified opportunities.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                
                            <div className="space-y-2">
                                    <Label htmlFor="industry">Industry</Label>
                                    <AIInput
                                        id="industry"
                                        value={industry}
                                        onChange={(e) => setIndustry(e.target.value)}
                                        placeholder="Type your industry..."
                                        suggestions={TOP_INDUSTRIES}
                                        generateAISuggestions={aiSuggestionService.generateIndustrySuggestions.bind(aiSuggestionService)}
                                        onSuggestionSelect={setIndustry}
                                        onValidationChange={setIndustryValidation}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="topic">Speaking Topic</Label>
                                    <AIInput
                                        id="topic"
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        placeholder="Type your speaking topic..."
                                        suggestions={TOP_TOPICS}
                                        generateAISuggestions={(input: string) => aiSuggestionService.generateTopicSuggestions(input, industry)}
                                        onSuggestionSelect={setTopic}
                                        onValidationChange={setTopicValidation}
                                        isTopicField={true}
                                        industryContext={industry}
                                    />
                                </div>
                            </div>
                            <div className="pt-2 space-y-2">
                                <Button 
                                    type="submit" 
                                    variant="hero" 
                                    className="w-full"
                                    disabled={industryValidation === 'different' || topicValidation === 'different' || 
                                             industryValidation === 'loading' || topicValidation === 'loading' || isSearching}
                                >
                                    {isSearching ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Searching...
                                        </div>
                                    ) : (
                                        'Search'
                                    )}
                                </Button>
                                {(industryValidation === 'different' || topicValidation === 'different') && (
                                    <p className="text-sm text-red-600 text-center">
                                        Please ensure your input matches the AI suggestions (green checkmark) before searching.
                                    </p>
                                )}
                                {(industryValidation === 'loading' || topicValidation === 'loading') && (
                                    <p className="text-sm text-blue-600 text-center">
                                        Please wait for AI suggestions to finish loading...
                                    </p>
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

