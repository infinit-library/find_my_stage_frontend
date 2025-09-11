import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AIInput } from "@/components/ui/ai-input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { TOP_INDUSTRIES, TOP_TOPICS, mapToTopOrOther } from "@/lib/taxonomy";
import { aiSuggestionService } from "@/lib/ai-suggestions";

const SearchPage = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [topic, setTopic] = useState("");
    const [industry, setIndustry] = useState("");

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const mappedTopic = mapToTopOrOther(topic, TOP_TOPICS);
        const mappedIndustry = mapToTopOrOther(industry, TOP_INDUSTRIES);
        navigate("/results", { state: { name, email, topic: mappedTopic, industry: mappedIndustry } });
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-2xl mx-auto p-6">
                <Card className="shadow-card">
                    <form onSubmit={onSubmit}>
                        <CardHeader>
                            <CardTitle>Find Stages That Fit You</CardTitle>
                            <CardDescription>Enter the basics. We’ll surface verified opportunities.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="topic">Speaking Topic</Label>
                                    <AIInput
                                        id="topic"
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        placeholder="Type your speaking topic..."
                                        suggestions={TOP_TOPICS}
                                        generateAISuggestions={aiSuggestionService.generateTopicSuggestions.bind(aiSuggestionService)}
                                        onSuggestionSelect={setTopic}
                                    />
                                </div>
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
                                    />
                                </div>
                            </div>
                            <div className="pt-2">
                                <Button type="submit" variant="hero" className="w-full">Search</Button>
                            </div>
                        </CardContent>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default SearchPage;

