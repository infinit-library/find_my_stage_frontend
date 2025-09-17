import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles } from 'lucide-react';
import { useIndustryTopics } from '@/hooks/useIndustryTopics';

const DEMO_INDUSTRIES = [
  'Finance', 'Healthcare', 'Software', 'Technology', 'Education', 
  'Marketing', 'Business', 'Design', 'Data', 'Retail'
];

export const IndustryTopicDemo: React.FC = () => {
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const { topics, loading, error, generateTopics, clearTopics, lastResult } = useIndustryTopics();

  const handleIndustrySelect = async (industry: string) => {
    setSelectedIndustry(industry);
    await generateTopics(industry);
  };

  const handleCustomIndustry = async () => {
    if (selectedIndustry.trim()) {
      await generateTopics(selectedIndustry);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Sparkles className="w-8 h-8 text-blue-500" />
          Industry-Topic AI Filter
        </h1>
        <p className="text-muted-foreground">
          Generate topic keywords from any industry using AI
        </p>
      </div>

      {/* Industry Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Industry</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick Select Buttons */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Quick Select:</p>
            <div className="flex flex-wrap gap-2">
              {DEMO_INDUSTRIES.map((industry) => (
                <Button
                  key={industry}
                  variant={selectedIndustry === industry ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleIndustrySelect(industry)}
                  disabled={loading}
                >
                  {industry}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Industry Input */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Or enter custom industry:</p>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., Manufacturing, Energy, Media..."
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                disabled={loading}
              />
              <Button 
                onClick={handleCustomIndustry}
                disabled={loading || !selectedIndustry.trim()}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Generate"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {lastResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-500" />
              Topics for "{lastResult.industry}"
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              <p><strong>AI Prompt:</strong> {lastResult.prompt}</p>
              <p><strong>Generated:</strong> {lastResult.topics.length} topics</p>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                <span>Generating topics...</span>
              </div>
            ) : error ? (
              <div className="text-red-500 text-center py-4">
                <p>Error: {error}</p>
                <Button variant="outline" onClick={clearTopics} className="mt-2">
                  Clear
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {topics.map((topic, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {topic}
                    </Badge>
                  ))}
                </div>
                
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-2">
                    Copy topics as array:
                  </p>
                  <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
                    {JSON.stringify(topics, null, 2)}
                  </pre>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={clearTopics}>
                    Clear Results
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigator.clipboard.writeText(JSON.stringify(topics, null, 2))}
                  >
                    Copy Array
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
