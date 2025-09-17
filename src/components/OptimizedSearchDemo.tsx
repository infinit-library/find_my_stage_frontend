import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import IndustrySelector from '@/components/ui/industry-selector';
import TopicAIInput from '@/components/ui/topic-ai-input';
import { Brain, Search, CheckCircle, AlertCircle, Target, Zap } from 'lucide-react';

const OptimizedSearchDemo: React.FC = () => {
  const [topic, setTopic] = useState("");
  const [industry, setIndustry] = useState("");
  const [topicValidation, setTopicValidation] = useState<'loading' | 'match' | 'different' | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleDemo = () => {
    console.log('Industry:', industry);
    console.log('Topic:', topic);
    console.log('Topic Validation:', topicValidation);
  };

  const sampleSentences = [
    "I want to speak about artificial intelligence and machine learning in healthcare",
    "I'm interested in discussing cryptocurrency and blockchain technology",
    "I'd like to talk about digital transformation and cloud computing",
    "I want to present on user experience design and product strategy",
    "I'm passionate about sustainable finance and ESG investing"
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <Card className="shadow-card">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Brain className="h-6 w-6 text-purple-600" />
              Optimized AI Search Demo
            </CardTitle>
            <CardDescription>
              Clean, focused implementation with proper industry selection and AI-powered topic suggestions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Feature Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Industry Selection</span>
                </div>
                <p className="text-xs text-muted-foreground">Dropdown with search - select from 29 predefined industries</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">AI Topic Features</span>
                </div>
                <p className="text-xs text-muted-foreground">Industry hints + sentence-to-keyword conversion</p>
              </div>
            </div>

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

            {/* Sample Sentences */}
            <div className="space-y-2">
              <div className="text-sm font-medium flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Sample Sentences (click to test):
              </div>
              <div className="space-y-2">
                {sampleSentences.map((sentence, index) => (
                  <div 
                    key={index}
                    className="p-3 bg-muted/50 rounded text-sm cursor-pointer hover:bg-muted transition-colors border-l-4 border-purple-500"
                    onClick={() => setTopic(sentence)}
                  >
                    "{sentence}"
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button 
                onClick={handleDemo}
                variant="outline" 
                className="w-full"
              >
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Demo: Log Current Values
                </div>
              </Button>
            </div>
            
            {/* Validation Messages */}
            <div className="space-y-2">
              {topicValidation === 'different' && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <p className="text-sm text-red-600">
                    Please ensure your topic matches the AI suggestions (green checkmark) before searching.
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
                    Great! Your topic is ready for search.
                  </p>
                </div>
              )}
            </div>

            {/* Current Status */}
            <div className="pt-4 border-t">
              <h3 className="text-sm font-medium mb-3">Current Status:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <div>Industry: <span className="font-mono">{industry || 'None'}</span></div>
                  <div>Topic: <span className="font-mono">{topic || 'None'}</span></div>
                </div>
                <div className="space-y-1">
                  <div>Topic Validation: <span className={`font-mono ${topicValidation === 'match' ? 'text-green-600' : topicValidation === 'different' ? 'text-red-600' : 'text-gray-600'}`}>{topicValidation || 'None'}</span></div>
                </div>
              </div>
            </div>

            {/* Implementation Details */}
            <div className="pt-4 border-t">
              <h3 className="text-sm font-medium mb-3">Implementation Details:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="font-medium">Industry Field:</div>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Dropdown with search functionality</li>
                    <li>29 predefined industry options</li>
                    <li>No AI functions - pure selection</li>
                    <li>Clean, focused UX</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <div className="font-medium">Topic Field:</div>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>AI-powered industry hints</li>
                    <li>Sentence-to-keyword conversion</li>
                    <li>Real-time validation</li>
                    <li>Smart suggestion system</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OptimizedSearchDemo;
