import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import IndustrySelector from '@/components/ui/industry-selector';
import TopicAIInput from '@/components/ui/topic-ai-input';
import { convertToTicketmasterParams, generateSearchStrategies } from '@/lib/ticketmaster-mapping';
import { Brain, Search, CheckCircle, AlertCircle, Target, Zap, ArrowRight, Code, Database } from 'lucide-react';

const TicketmasterMappingDemo: React.FC = () => {
  const [topic, setTopic] = useState("");
  const [industry, setIndustry] = useState("");
  const [topicValidation, setTopicValidation] = useState<'loading' | 'match' | 'different' | null>(null);
  const [mappingResult, setMappingResult] = useState<any>(null);
  const [searchStrategies, setSearchStrategies] = useState<any[]>([]);

  const handleDemo = () => {
    if (!industry || !topic) {
      alert('Please select both industry and topic');
      return;
    }

    // Convert to Ticketmaster parameters
    const ticketmasterParams = convertToTicketmasterParams(industry, topic);
    const strategies = generateSearchStrategies(industry, topic);
    
    setMappingResult(ticketmasterParams);
    setSearchStrategies(strategies);
    
    console.log('Industry:', industry);
    console.log('Topic:', topic);
    console.log('Ticketmaster Params:', ticketmasterParams);
    console.log('Search Strategies:', strategies);
  };

  const sampleCombinations = [
    { industry: 'Technology', topic: 'Artificial Intelligence & Machine Learning' },
    { industry: 'Finance', topic: 'Fintech Innovation & Digital Banking' },
    { industry: 'Healthcare', topic: 'Digital Health & Telemedicine' },
    { industry: 'Education', topic: 'EdTech Solutions & Digital Learning' },
    { industry: 'Business', topic: 'Digital Transformation' }
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <Card className="shadow-card">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Database className="h-6 w-6 text-blue-600" />
              Ticketmaster Parameter Mapping Demo
            </CardTitle>
            <CardDescription>
              Convert industry and topic selections to Ticketmaster-compatible search parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Key Feature */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Code className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Parameter Conversion</span>
              </div>
              <p className="text-sm text-blue-700">
                Our system converts your industry and topic selections into optimized Ticketmaster search parameters, 
                ensuring better search results and compatibility with the Ticketmaster API.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Input Selection
                </h3>
                
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

                {/* Sample Combinations */}
                <div className="space-y-2">
                  <div className="text-sm font-medium">Sample Combinations:</div>
                  <div className="space-y-2">
                    {sampleCombinations.map((combo, index) => (
                      <div 
                        key={index}
                        className="p-2 bg-muted/50 rounded text-sm cursor-pointer hover:bg-muted transition-colors"
                        onClick={() => {
                          setIndustry(combo.industry);
                          setTopic(combo.topic);
                        }}
                      >
                        <div className="font-medium">{combo.industry}</div>
                        <div className="text-muted-foreground">{combo.topic}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Demo Button */}
                <Button 
                  onClick={handleDemo}
                  variant="outline" 
                  className="w-full"
                  disabled={!industry || !topic || topicValidation !== 'match'}
                >
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Convert to Ticketmaster Parameters
                  </div>
                </Button>
              </div>

              {/* Results Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <ArrowRight className="h-5 w-5" />
                  Conversion Results
                </h3>

                {mappingResult && (
                  <div className="space-y-4">
                    {/* Primary Parameters */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Primary Search Parameters
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="grid grid-cols-1 gap-2 text-sm">
                          <div>
                            <span className="font-medium">Keyword:</span>
                            <div className="font-mono bg-muted p-2 rounded mt-1">
                              {mappingResult.keyword}
                            </div>
                          </div>
                          <div>
                            <span className="font-medium">Classification:</span>
                            <div className="font-mono bg-muted p-2 rounded mt-1">
                              {mappingResult.classificationName} ({mappingResult.classificationId})
                            </div>
                          </div>
                          <div>
                            <span className="font-medium">Segment:</span>
                            <div className="font-mono bg-muted p-2 rounded mt-1">
                              {mappingResult.segmentName} ({mappingResult.segmentId})
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Search Strategies */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Zap className="h-4 w-4 text-purple-600" />
                          Search Strategies ({searchStrategies.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {searchStrategies.map((strategy, index) => (
                            <div key={index} className="p-3 bg-muted/50 rounded border-l-4 border-purple-500">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-medium text-purple-600">
                                  Strategy {index + 1}
                                </span>
                                {index === 0 && (
                                  <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                                    Primary
                                  </span>
                                )}
                              </div>
                              <div className="font-mono text-sm">
                                {strategy.keyword}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* API Request Example */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Code className="h-4 w-4 text-blue-600" />
                          API Request Example
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-gray-900 text-green-400 p-4 rounded text-sm font-mono overflow-x-auto">
                          <div>GET /events/ticketmaster</div>
                          <div className="text-gray-400">Query Parameters:</div>
                          <div>  industry: "{industry}"</div>
                          <div>  topic: "{topic}"</div>
                          <div>  num: 120</div>
                          <div>  country: "US"</div>
                          <div className="text-gray-400 mt-2">Backend converts to:</div>
                          <div>  q: "{mappingResult.keyword}"</div>
                          <div>  classificationId: "{mappingResult.classificationId}"</div>
                          <div>  segmentId: "{mappingResult.segmentId}"</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {!mappingResult && (
                  <div className="p-8 text-center text-muted-foreground">
                    <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select industry and topic, then click "Convert" to see the mapping results.</p>
                  </div>
                )}
              </div>
            </div>

            {/* How It Works */}
            <div className="pt-6 border-t">
              <h3 className="text-lg font-semibold mb-4">How Parameter Mapping Works:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">1</div>
                    <span className="font-medium">Input Selection</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    User selects industry from predefined list and topic from AI-generated hints
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs font-bold text-purple-600">2</div>
                    <span className="font-medium">Parameter Conversion</span>
                  </div>
                  <p className="text-sm text-purple-700">
                    System converts selections to Ticketmaster-compatible keywords and classification IDs
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-600">3</div>
                    <span className="font-medium">API Request</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Backend sends optimized parameters to Ticketmaster API for better search results
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TicketmasterMappingDemo;
