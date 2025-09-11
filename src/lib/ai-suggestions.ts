import { TOP_TOPICS, TOP_INDUSTRIES } from "./taxonomy";

// Mock AI service - in a real implementation, this would call an AI API
export class AISuggestionService {
  private static instance: AISuggestionService;
  
  static getInstance(): AISuggestionService {
    if (!AISuggestionService.instance) {
      AISuggestionService.instance = new AISuggestionService();
    }
    return AISuggestionService.instance;
  }

  // Simulate AI delay
  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Generate topic suggestions based on input
  async generateTopicSuggestions(input: string): Promise<string[]> {
    await this.delay(500); // Simulate API call delay
    
    const normalizedInput = input.toLowerCase().trim();
    
    // If input is too short, return empty
    if (normalizedInput.length < 2) {
      return [];
    }

    // Find exact matches first
    const exactMatches = TOP_TOPICS.filter(topic => 
      topic.toLowerCase() === normalizedInput
    );

    // Find partial matches
    const partialMatches = TOP_TOPICS.filter(topic => 
      topic.toLowerCase().includes(normalizedInput) && 
      !exactMatches.includes(topic)
    );

    // Generate AI-like suggestions based on common patterns
    const aiSuggestions: string[] = [];
    
    // Add related topics based on input patterns
    if (normalizedInput.includes('tech') || normalizedInput.includes('software') || normalizedInput.includes('code')) {
      aiSuggestions.push('Software Engineering', 'DevOps', 'Cloud Computing', 'Full Stack Development');
    }
    if (normalizedInput.includes('data') || normalizedInput.includes('analytics') || normalizedInput.includes('stats')) {
      aiSuggestions.push('Data Analytics', 'Business Intelligence', 'Machine Learning', 'Data Visualization');
    }
    if (normalizedInput.includes('lead') || normalizedInput.includes('manage') || normalizedInput.includes('team')) {
      aiSuggestions.push('Team Leadership', 'Project Management', 'Strategic Planning', 'Change Management');
    }
    if (normalizedInput.includes('market') || normalizedInput.includes('brand') || normalizedInput.includes('promote')) {
      aiSuggestions.push('Digital Marketing', 'Brand Strategy', 'Content Marketing', 'Social Media Marketing');
    }
    if (normalizedInput.includes('ai') || normalizedInput.includes('artificial') || normalizedInput.includes('machine')) {
      aiSuggestions.push('Machine Learning', 'Deep Learning', 'Natural Language Processing', 'Computer Vision');
    }
    if (normalizedInput.includes('design') || normalizedInput.includes('ux') || normalizedInput.includes('ui')) {
      aiSuggestions.push('User Experience', 'User Interface', 'Product Design', 'Visual Design');
    }
    if (normalizedInput.includes('sales') || normalizedInput.includes('revenue') || normalizedInput.includes('business')) {
      aiSuggestions.push('Revenue Growth', 'Customer Acquisition', 'Sales Strategy', 'Business Development');
    }
    if (normalizedInput.includes('security') || normalizedInput.includes('cyber') || normalizedInput.includes('safe')) {
      aiSuggestions.push('Cybersecurity', 'Information Security', 'Risk Management', 'Compliance');
    }
    if (normalizedInput.includes('finance') || normalizedInput.includes('money') || normalizedInput.includes('budget')) {
      aiSuggestions.push('Financial Planning', 'Investment Strategy', 'Corporate Finance', 'Fintech');
    }
    if (normalizedInput.includes('health') || normalizedInput.includes('medical') || normalizedInput.includes('care')) {
      aiSuggestions.push('Healthcare Innovation', 'Medical Technology', 'Public Health', 'Health Informatics');
    }

    // Combine and deduplicate
    const allSuggestions = [...exactMatches, ...partialMatches, ...aiSuggestions];
    const uniqueSuggestions = Array.from(new Set(allSuggestions));
    
    return uniqueSuggestions.slice(0, 5); // Limit to 5 suggestions
  }

  // Generate industry suggestions based on input
  async generateIndustrySuggestions(input: string): Promise<string[]> {
    await this.delay(500); // Simulate API call delay
    
    const normalizedInput = input.toLowerCase().trim();
    
    // If input is too short, return empty
    if (normalizedInput.length < 2) {
      return [];
    }

    // Find exact matches first
    const exactMatches = TOP_INDUSTRIES.filter(industry => 
      industry.toLowerCase() === normalizedInput
    );

    // Find partial matches
    const partialMatches = TOP_INDUSTRIES.filter(industry => 
      industry.toLowerCase().includes(normalizedInput) && 
      !exactMatches.includes(industry)
    );

    // Generate AI-like suggestions based on common patterns
    const aiSuggestions: string[] = [];
    
    // Add related industries based on input patterns
    if (normalizedInput.includes('tech') || normalizedInput.includes('software') || normalizedInput.includes('digital')) {
      aiSuggestions.push('Software Development', 'IT Services', 'Cybersecurity', 'Cloud Computing');
    }
    if (normalizedInput.includes('health') || normalizedInput.includes('medical') || normalizedInput.includes('care')) {
      aiSuggestions.push('Medical Devices', 'Biotechnology', 'Healthcare IT', 'Pharmaceuticals');
    }
    if (normalizedInput.includes('finance') || normalizedInput.includes('bank') || normalizedInput.includes('money')) {
      aiSuggestions.push('Investment Banking', 'Fintech', 'Insurance', 'Wealth Management');
    }
    if (normalizedInput.includes('education') || normalizedInput.includes('school') || normalizedInput.includes('learning')) {
      aiSuggestions.push('EdTech', 'Training & Development', 'E-Learning', 'Higher Education');
    }
    if (normalizedInput.includes('retail') || normalizedInput.includes('commerce') || normalizedInput.includes('shop')) {
      aiSuggestions.push('E-Commerce', 'Consumer Goods', 'Fashion', 'Luxury Retail');
    }
    if (normalizedInput.includes('manufactur') || normalizedInput.includes('production') || normalizedInput.includes('factory')) {
      aiSuggestions.push('Industrial Manufacturing', 'Automotive', 'Aerospace', 'Electronics');
    }
    if (normalizedInput.includes('energy') || normalizedInput.includes('power') || normalizedInput.includes('solar')) {
      aiSuggestions.push('Renewable Energy', 'Oil & Gas', 'Utilities', 'Clean Technology');
    }
    if (normalizedInput.includes('media') || normalizedInput.includes('content') || normalizedInput.includes('publish')) {
      aiSuggestions.push('Digital Media', 'Broadcasting', 'Publishing', 'Content Creation');
    }
    if (normalizedInput.includes('transport') || normalizedInput.includes('logistics') || normalizedInput.includes('shipping')) {
      aiSuggestions.push('Logistics', 'Transportation', 'Supply Chain', 'Freight');
    }
    if (normalizedInput.includes('real') || normalizedInput.includes('property') || normalizedInput.includes('estate')) {
      aiSuggestions.push('Real Estate', 'Property Development', 'Commercial Real Estate', 'Residential');
    }

    // Combine and deduplicate
    const allSuggestions = [...exactMatches, ...partialMatches, ...aiSuggestions];
    const uniqueSuggestions = Array.from(new Set(allSuggestions));
    
    return uniqueSuggestions.slice(0, 5); // Limit to 5 suggestions
  }
}

// Export singleton instance
export const aiSuggestionService = AISuggestionService.getInstance();
