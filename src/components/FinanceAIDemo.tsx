import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AIInput } from '@/components/ui/ai-input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { aiSuggestionService } from '@/lib/ai-suggestions';
import { TOP_INDUSTRIES, TOP_TOPICS } from '@/lib/taxonomy';
import { TrendingUp, DollarSign, Shield, CreditCard, Building2 } from 'lucide-react';

const FinanceAIDemo: React.FC = () => {
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

  const financeKeywords = [
    'Fintech', 'Banking', 'Investment', 'Cryptocurrency', 'Blockchain', 
    'Trading', 'Portfolio', 'Wealth', 'Insurance', 'Payment', 
    'Lending', 'Credit', 'Compliance', 'Risk', 'Financial'
  ];

  const financeSentences = [
    "I want to speak about cryptocurrency and blockchain technology in finance",
    "I'm interested in discussing investment strategies and portfolio management",
    "I'd like to talk about digital banking and fintech innovation",
    "I want to present on risk management and regulatory compliance",
    "I'm passionate about financial inclusion and accessible banking"
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <Card className="shadow-card">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <DollarSign className="h-6 w-6 text-green-600" />
              Finance AI Features Demo
            </CardTitle>
            <CardDescription>
              Enhanced AI-powered features specifically for Finance industry with comprehensive hints and sentence-to-topic conversion
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Finance Keywords Display */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Finance Keywords (AI will recognize these):</Label>
              <div className="flex flex-wrap gap-2">
                {financeKeywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {keyword}
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
                placeholder="Type 'finance', 'banking', 'fintech', etc..."
                suggestions={TOP_INDUSTRIES}
                generateAISuggestions={aiSuggestionService.generateIndustrySuggestions.bind(aiSuggestionService)}
                onSuggestionSelect={setIndustry}
                onValidationChange={setIndustryValidation}
              />
            </div>

            {/* Topic Input with Enhanced Finance Features */}
            <div className="space-y-2">
              <Label htmlFor="topic">Speaking Topic</Label>
              <div className="text-sm text-muted-foreground mb-2">
                <div className="font-medium mb-2">Try these Finance-specific features:</div>
                <ul className="list-disc list-inside space-y-1">
                  <li>Select "Finance" industry above to see comprehensive Finance topic hints</li>
                  <li>Type Finance sentences like: "I want to speak about cryptocurrency and blockchain technology"</li>
                  <li>Try Finance keywords: fintech, banking, investment, trading, portfolio, etc.</li>
                  <li>Click on any suggestion to select it</li>
                </ul>
              </div>
              <AIInput
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Type your Finance speaking topic or describe what you want to speak about..."
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

            {/* Sample Finance Sentences */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Sample Finance Sentences (copy & paste to test):</Label>
              <div className="space-y-2">
                {financeSentences.map((sentence, index) => (
                  <div 
                    key={index}
                    className="p-2 bg-muted/50 rounded text-sm cursor-pointer hover:bg-muted transition-colors"
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
              <h3 className="text-sm font-medium mb-2">Current Status:</h3>
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

            {/* Finance Industry Features */}
            <div className="pt-4 border-t">
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Enhanced Finance Industry Features:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Industry Hints:</span>
                  </div>
                  <ul className="list-disc list-inside ml-6 space-y-1 text-muted-foreground">
                    <li>Fintech Innovation</li>
                    <li>Digital Banking Transformation</li>
                    <li>Cryptocurrency & Blockchain</li>
                    <li>Investment Strategies</li>
                    <li>Risk Management & Compliance</li>
                    <li>Payment Systems & Digital Wallets</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Sentence Conversion:</span>
                  </div>
                  <ul className="list-disc list-inside ml-6 space-y-1 text-muted-foreground">
                    <li>Recognizes 15+ Finance keywords</li>
                    <li>Converts sentences to topic keywords</li>
                    <li>Context-aware suggestions</li>
                    <li>Industry-specific validation</li>
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

export default FinanceAIDemo;
