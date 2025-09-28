import { aiSuggestionService } from './ai-suggestions';


export interface IndustryTopicResult {
  industry: string;
  topics: string[];
  prompt: string;
}
export async function generateTopicsFromIndustry(industry: string): Promise<IndustryTopicResult> {
  try {
    const topics = await aiSuggestionService.generateTopicKeywordsFromIndustry(industry);
    const prompt = aiSuggestionService.getIndustryTopicPrompt(industry);
    
    return {
      industry,
      topics,
      prompt
    };
  } catch (error) {
    console.error('Error generating topics from industry:', error);
    return {
      industry,
      topics: [],
      prompt: aiSuggestionService.getIndustryTopicPrompt(industry)
    };
  }
}

export async function generateTopicSuggestions(input: string, industry?: string): Promise<string[]> {
  try {
    return await aiSuggestionService.generateTopicSuggestions(input, industry);
  } catch (error) {
    console.error('Error generating topic suggestions:', error);
    return [];
  }
}

export async function generateIndustrySuggestions(input: string): Promise<string[]> {
  try {
    return await aiSuggestionService.generateIndustrySuggestions(input);
  } catch (error) {
    console.error('Error generating industry suggestions:', error);
    return [];
  }
}

export async function isTopicRelatedToIndustry(topic: string, industry: string): Promise<boolean> {
  try {
    return await aiSuggestionService.isTopicRelatedToIndustry(topic, industry);
  } catch (error) {
    console.error('Error checking topic-industry relationship:', error);
    return true; // Default to allowing if there's an error
  }
}

export async function convertSentenceToTopic(sentence: string, industry?: string): Promise<string[]> {
  try {
    return await aiSuggestionService.convertSentenceToTopic(sentence, industry);
  } catch (error) {
    console.error('Error converting sentence to topic:', error);
    return [];
  }
}

export async function getIndustryTopicHints(industry: string): Promise<string[]> {
  try {
    return await aiSuggestionService.getIndustryTopicHints(industry);
  } catch (error) {
    console.error('Error getting industry topic hints:', error);
    return [];
  }
}

export function getIndustryTopicPrompt(industry: string): string {
  return aiSuggestionService.getIndustryTopicPrompt(industry);
}

export async function testIndustryTopicFilter() {
  const testIndustries = ['Finance', 'Healthcare', 'Software', 'Technology', 'Education'];
  
  console.log('🧪 Testing Industry-Topic AI Filter');
  console.log('===================================');
  
  for (const industry of testIndustries) {
    console.log(`\n📊 Industry: ${industry}`);
    console.log(`🤖 Prompt: ${getIndustryTopicPrompt(industry)}`);
    
    const result = await generateTopicsFromIndustry(industry);
    console.log(`📝 Topics (${result.topics.length}):`);
    result.topics.forEach((topic, index) => {
      console.log(`   ${index + 1}. ${topic}`);
    });
  }
}

export { aiSuggestionService };
