import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AIInput } from '@/components/ui/ai-input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { aiSuggestionService } from '@/lib/ai-suggestions';
import { TOP_INDUSTRIES, TOP_TOPICS } from '@/lib/taxonomy';

const AIFeaturesDemo: React.FC = () => {
  const [industry, setIndustry] = useState("");
  const [topic, setTopic] = useState("");
  const [industryValidation, setIndustryValidation] = useState<'loading' | 'match' | 'different' | null>(null);
  const [topicValidation, setTopicValidation] = useState<'loading' | 'match' | 'different' | null>(null);

  const handleDemo = () => {
    console.log('Industry:', industry);
    console.log('Topic:', topic);
    console.log('Industry Validation:', industryValidation);
    console.log('Topic Validation:', topicValidation);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <Card className="shadow-card">
          <CardHeader className="text-center">
            <CardTitle>AI-Powered Search Features Demo</CardTitle>
            <CardDescription>
              Test the new AI features: Industry-based hints and sentence-to-topic conversion
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Industry Input */}
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

            {/* Topic Input with New Features */}
            <div className="space-y-2">
              <Label htmlFor="topic">Speaking Topic</Label>
              <div className="text-sm text-muted-foreground mb-2">
                Try these features:
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Select an industry above to see AI-generated topic hints</li>
                  <li>Type a sentence like "I want to speak about machine learning and artificial intelligence" to see sentence-to-topic conversion</li>
                  <li>Click on any suggestion to select it</li>
                </ul>
              </div>
              <AIInput
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Type your speaking topic or describe what you want to speak about..."
                suggestions={TOP_TOPICS}
                generateAISuggestions={(input: string) => aiSuggestionService.generateTopicSuggestions(input, industry)}
                onSuggestionSelect={setTopic}
                onValidationChange={setTopicValidation}
                isTopicField={true}
                industryContext={industry}
                showIndustryHints={true}
                convertSentenceToTopic={true}
              />
            </div>

            {/* Demo Button */}
            <div className="pt-4">
              <Button 
                onClick={handleDemo}
                variant="outline" 
                className="w-full"
              >
                Demo: Log Current Values
              </Button>
            </div>

            {/* Status Display */}
            <div className="pt-4 border-t">
              <h3 className="text-sm font-medium mb-2">Current Status:</h3>
              <div className="space-y-1 text-sm">
                <div>Industry: <span className="font-mono">{industry || 'None'}</span></div>
                <div>Topic: <span className="font-mono">{topic || 'None'}</span></div>
                <div>Industry Validation: <span className={`font-mono ${industryValidation === 'match' ? 'text-green-600' : industryValidation === 'different' ? 'text-red-600' : 'text-gray-600'}`}>{industryValidation || 'None'}</span></div>
                <div>Topic Validation: <span className={`font-mono ${topicValidation === 'match' ? 'text-green-600' : topicValidation === 'different' ? 'text-red-600' : 'text-gray-600'}`}>{topicValidation || 'None'}</span></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIFeaturesDemo;
