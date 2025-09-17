import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import IndustrySelector from '@/components/ui/industry-selector';
import TopicAIInput from '@/components/ui/topic-ai-input';
import { Brain, Search, CheckCircle, AlertCircle, Target, Zap, MousePointer } from 'lucide-react';

const HintSelectionDemo: React.FC = () => {
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
              Hint Selection Demo
            </CardTitle>
            <CardDescription>
              Users must select AI-generated hints - no free typing allowed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Key Feature */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MousePointer className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">New Requirement</span>
              </div>
              <p className="text-sm text-blue-700">
                Users can input sentences, but they <strong>must select a hint</strong> from the AI suggestions. 
                Free typing is not allowed - only hint selection is valid.
              </p>
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
                <Target className="h-4 w-4" />
                Sample Sentences (click to test hint generation):
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
                disabled={topicValidation === 'different' || topicValidation === 'loading' || isSearching}
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

            {/* How It Works */}
            <div className="pt-4 border-t">
              <h3 className="text-sm font-medium mb-3">How It Works:</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">1</div>
                  <div>
                    <div className="font-medium">Type a sentence or topic description</div>
                    <div className="text-muted-foreground">AI analyzes your input and generates relevant hints</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs font-bold text-purple-600">2</div>
                  <div>
                    <div className="font-medium">AI shows topic hints</div>
                    <div className="text-muted-foreground">Based on your input and selected industry</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-600">3</div>
                  <div>
                    <div className="font-medium">Select a hint (required)</div>
                    <div className="text-muted-foreground">You must click on one of the AI suggestions</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-xs font-bold text-orange-600">4</div>
                  <div>
                    <div className="font-medium">Search is enabled</div>
                    <div className="text-muted-foreground">Only after selecting a valid hint</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HintSelectionDemo;
