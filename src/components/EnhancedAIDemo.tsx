import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AIInput } from '@/components/ui/ai-input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { aiSuggestionService } from '@/lib/ai-suggestions';
import { DEFAULT_INDUSTRY_OPTIONS } from '@/lib/global-industries';
import { Brain, Zap, Target, Globe, CheckCircle } from 'lucide-react';

const EnhancedAIDemo: React.FC = () => {
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

  const sampleSentences = [
    "I want to speak about artificial intelligence and machine learning in healthcare",
    "I'm interested in discussing cryptocurrency and blockchain technology",
    "I'd like to talk about digital transformation and cloud computing",
    "I want to present on user experience design and product strategy",
    "I'm passionate about sustainable finance and ESG investing"
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <Card className="shadow-card">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Brain className="h-6 w-6 text-purple-600" />
              Enhanced AI Features Demo
            </CardTitle>
            <CardDescription>
              All improvements implemented: No default data, 15+ AI hints, sentence conversion, and global industry options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Feature Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">✅ No Default Topic Data</span>
                </div>
                <p className="text-xs text-muted-foreground">Topic field shows only AI-generated hints, no static suggestions</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">✅ 15+ AI Hints</span>
                </div>
                <p className="text-xs text-muted-foreground">Each industry provides 15-20 comprehensive topic suggestions</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">✅ Sentence Conversion</span>
                </div>
                <p className="text-xs text-muted-foreground">Convert natural language sentences to topic keywords</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">✅ Global Industry Options</span>
                </div>
                <p className="text-xs text-muted-foreground">29 comprehensive industry options with detailed configurations</p>
              </div>
            </div>

            {/* Global Industry Options Display */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Global Industry Options ({DEFAULT_INDUSTRY_OPTIONS.length} total):
              </Label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {DEFAULT_INDUSTRY_OPTIONS.map((industry, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {industry}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Industry Input */}
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <AIInput
                id="industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="Type your industry (try: Technology, Finance, Healthcare, etc.)..."
                suggestions={DEFAULT_INDUSTRY_OPTIONS}
                generateAISuggestions={aiSuggestionService.generateIndustrySuggestions.bind(aiSuggestionService)}
                onSuggestionSelect={setIndustry}
                onValidationChange={setIndustryValidation}
              />
            </div>

            {/* Topic Input with Enhanced Features */}
            <div className="space-y-2">
              <Label htmlFor="topic">Speaking Topic</Label>
              <div className="text-sm text-muted-foreground mb-2">
                <div className="font-medium mb-2 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Enhanced Features:
                </div>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>No Default Data:</strong> Only AI-generated suggestions appear</li>
                  <li><strong>15+ Industry Hints:</strong> Select an industry to see comprehensive topic suggestions</li>
                  <li><strong>Sentence Conversion:</strong> Type full sentences to get topic keywords</li>
                  <li><strong>Smart Recognition:</strong> AI recognizes industry-specific terminology</li>
                </ul>
              </div>
              <AIInput
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Type your speaking topic or describe what you want to speak about..."
                suggestions={[]}
                generateAISuggestions={(input: string) => aiSuggestionService.generateTopicSuggestions(input, industry)}
                onSuggestionSelect={setTopic}
                onValidationChange={setTopicValidation}
                isTopicField={true}
                industryContext={industry}
                showIndustryHints={true}
                convertSentenceToTopic={true}
              />
            </div>

            {/* Sample Sentences */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4" />
                Sample Sentences (copy & paste to test sentence conversion):
              </Label>
              <div className="space-y-2">
                {sampleSentences.map((sentence, index) => (
                  <div 
                    key={index}
                    className="p-3 bg-muted/50 rounded text-sm cursor-pointer hover:bg-muted transition-colors border-l-4 border-blue-500"
                    onClick={() => setTopic(sentence)}
                  >
                    "{sentence}"
                  </div>
                ))}
              </div>
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
              <h3 className="text-sm font-medium mb-3">Current Status:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <div>Industry: <span className="font-mono">{industry || 'None'}</span></div>
                  <div>Topic: <span className="font-mono">{topic || 'None'}</span></div>
                </div>
                <div className="space-y-1">
                  <div>Industry Validation: <span className={`font-mono ${industryValidation === 'match' ? 'text-green-600' : industryValidation === 'different' ? 'text-red-600' : 'text-gray-600'}`}>{industryValidation || 'None'}</span></div>
                  <div>Topic Validation: <span className={`font-mono ${topicValidation === 'match' ? 'text-green-600' : topicValidation === 'different' ? 'text-red-600' : 'text-gray-600'}`}>{topicValidation || 'None'}</span></div>
                </div>
              </div>
            </div>

            {/* Implementation Details */}
            <div className="pt-4 border-t">
              <h3 className="text-sm font-medium mb-3">Implementation Details:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="font-medium">Topic Field Changes:</div>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Removed TOP_TOPICS static suggestions</li>
                    <li>Now shows only AI-generated hints</li>
                    <li>Enhanced sentence-to-keyword conversion</li>
                    <li>Industry-specific topic suggestions</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <div className="font-medium">Global Industry System:</div>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>29 comprehensive industry options</li>
                    <li>Each industry has 15-20 topic hints</li>
                    <li>Keyword recognition for each industry</li>
                    <li>Centralized configuration system</li>
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

export default EnhancedAIDemo;
