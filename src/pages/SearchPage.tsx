import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TOP_INDUSTRIES, TOP_TOPICS, mapToTopOrOther } from "@/lib/taxonomy";

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
                                    <Label>Speaking Topic</Label>
                                    <Select value={topic} onValueChange={setTopic}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose a topic" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {TOP_TOPICS.map((t) => (
                                                <SelectItem key={t} value={t}>{t}</SelectItem>
                                            ))}
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Industry</Label>
                                    <Select value={industry} onValueChange={setIndustry}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose an industry" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {TOP_INDUSTRIES.map((i) => (
                                                <SelectItem key={i} value={i}>{i}</SelectItem>
                                            ))}
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
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

