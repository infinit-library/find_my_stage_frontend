import { aiSuggestionService } from './ai-suggestions';

/**
 * Industry-Topic Filter Utility
 * 
 * This utility provides functions to generate topic keywords from industry
 * using AI prompts. No static data - purely AI-driven approach.
 */

export interface IndustryTopicResult {
  industry: string;
  topics: string[];
  prompt: string;
}

/**
 * Generate topic keywords from industry using AI prompt
 * @param industry - The industry name (e.g., "Finance", "Healthcare", "Software")
 * @returns Promise<IndustryTopicResult> - Object containing industry, topics array, and the prompt used
 */
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

/**
 * Generate topic suggestions based on input using AI prompt
 * @param input - The input text to generate suggestions for
 * @param industry - Optional industry context
 * @returns Promise<string[]> - Array of topic suggestions
 */
export async function generateTopicSuggestions(input: string, industry?: string): Promise<string[]> {
  try {
    return await aiSuggestionService.generateTopicSuggestions(input, industry);
  } catch (error) {
    console.error('Error generating topic suggestions:', error);
    return [];
  }
}

/**
 * Generate industry suggestions based on input using AI prompt
 * @param input - The input text to generate industry suggestions for
 * @returns Promise<string[]> - Array of industry suggestions
 */
export async function generateIndustrySuggestions(input: string): Promise<string[]> {
  try {
    return await aiSuggestionService.generateIndustrySuggestions(input);
  } catch (error) {
    console.error('Error generating industry suggestions:', error);
    return [];
  }
}

/**
 * Check if a topic is related to an industry using AI prompt
 * @param topic - The topic to check
 * @param industry - The industry to check against
 * @returns Promise<boolean> - Whether the topic is related to the industry
 */
export async function isTopicRelatedToIndustry(topic: string, industry: string): Promise<boolean> {
  try {
    return await aiSuggestionService.isTopicRelatedToIndustry(topic, industry);
  } catch (error) {
    console.error('Error checking topic-industry relationship:', error);
    return true; // Default to allowing if there's an error
  }
}

/**
 * Convert sentences to topic keywords using AI prompt
 * @param sentence - The sentence to convert
 * @param industry - Optional industry context
 * @returns Promise<string[]> - Array of topic keywords
 */
export async function convertSentenceToTopic(sentence: string, industry?: string): Promise<string[]> {
  try {
    return await aiSuggestionService.convertSentenceToTopic(sentence, industry);
  } catch (error) {
    console.error('Error converting sentence to topic:', error);
    return [];
  }
}

/**
 * Get industry-based topic hints using AI prompt
 * @param industry - The industry name
 * @returns Promise<string[]> - Array of topic hints
 */
export async function getIndustryTopicHints(industry: string): Promise<string[]> {
  try {
    return await aiSuggestionService.getIndustryTopicHints(industry);
  } catch (error) {
    console.error('Error getting industry topic hints:', error);
    return [];
  }
}

/**
 * Get the AI prompt for generating topic keywords from industry
 * @param industry - The industry name
 * @returns string - The prompt that would be sent to AI
 */
export function getIndustryTopicPrompt(industry: string): string {
  return aiSuggestionService.getIndustryTopicPrompt(industry);
}

/**
 * Example usage and testing function
 */
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

// Export for easy testing
export { aiSuggestionService };
