// AI-powered suggestion service without static data
import { GLOBAL_INDUSTRIES, getIndustryByName, getTopicHintsForIndustry } from './global-industries';

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

  // Check if input is meaningless (repeated characters, gibberish, etc.)
  private isMeaninglessInput(input: string): boolean {
    // Check for repeated characters (like "fffff", "aaaaa", etc.)
    const repeatedCharPattern = /^(.)\1{2,}$/;
    if (repeatedCharPattern.test(input)) {
      return true;
    }

    // Check for very short inputs
    if (input.length < 3) {
      return true;
    }

    // Check for inputs with no vowels (likely gibberish)
    const hasVowels = /[aeiou]/.test(input);
    if (!hasVowels && input.length > 4) {
      return true;
    }

    // Check for inputs that are mostly numbers or special characters
    const alphaRatio = (input.match(/[a-z]/g) || []).length / input.length;
    if (alphaRatio < 0.5 && input.length > 3) {
      return true;
    }

    return false;
  }

  // Check if a topic is related to an industry using AI prompt
  async isTopicRelatedToIndustry(topic: string, industry: string): Promise<boolean> {
    if (!topic || !industry) {
      return true; // If either is empty, don't block
    }

    const normalizedTopic = topic.toLowerCase().trim();
    const normalizedIndustry = industry.toLowerCase().trim();

    // Check for meaningless inputs (repeated characters, very short words, etc.)
    if (this.isMeaninglessInput(normalizedTopic)) {
      return false; // Block meaningless inputs
    }

    // Use AI prompt to determine if topic is related to industry
    // In a real implementation, this would call an AI API
    const prompt = `Is the topic "${topic}" related to the industry "${industry}"? Answer only "yes" or "no".`;
    
    // Simulate AI response - in real implementation, call AI API here
    await this.delay(300);
    
    // Simple heuristic for demo - in real implementation, use AI response
    const topicWords = normalizedTopic.split(' ');
    const industryWords = normalizedIndustry.split(' ');
    
    // Check for common word overlap
    const hasOverlap = topicWords.some(topicWord => 
      industryWords.some(industryWord => 
          topicWord.includes(industryWord) || industryWord.includes(topicWord)
        )
      );

    return hasOverlap;
  }

  // Generate topic suggestions based on input using AI prompt
  async generateTopicSuggestions(input: string, industry?: string): Promise<string[]> {
    await this.delay(500); // Simulate API call delay
    
    const normalizedInput = input.toLowerCase().trim();
    
    // If input is too short, return empty
    if (normalizedInput.length < 2) {
      return [];
    }

    // Use AI prompt to generate topic suggestions
    const prompt = industry 
      ? `Generate 8 topic suggestions related to "${input}" in the context of "${industry}" industry. Output only keywords, one per line, no explanations.`
      : `Generate 8 topic suggestions related to "${input}". Output only keywords, one per line, no explanations.`;
    
    // Simulate AI response - in real implementation, call AI API here
    await this.delay(800);
    
    // Mock response based on input patterns - in real implementation, use AI response
    const mockSuggestions: string[] = [];
    
    if (normalizedInput.includes('tech') || normalizedInput.includes('software') || normalizedInput.includes('code')) {
      mockSuggestions.push('Software Development', 'Web Development', 'Mobile Apps', 'Cloud Computing', 'DevOps', 'Artificial Intelligence', 'Machine Learning', 'Cybersecurity');
    } else if (normalizedInput.includes('data') || normalizedInput.includes('analytics')) {
      mockSuggestions.push('Data Analytics', 'Business Intelligence', 'Data Visualization', 'Big Data', 'Data Engineering', 'Statistical Analysis', 'Predictive Analytics', 'Data Mining');
    } else if (normalizedInput.includes('lead') || normalizedInput.includes('manage')) {
      mockSuggestions.push('Leadership', 'Management', 'Business Strategy', 'Operations Management', 'Change Management', 'Project Management', 'Business Development', 'Organizational Development');
    } else if (normalizedInput.includes('market') || normalizedInput.includes('brand')) {
      mockSuggestions.push('Digital Marketing', 'Content Marketing', 'Social Media Marketing', 'Brand Strategy', 'Marketing Analytics', 'Customer Experience', 'Email Marketing', 'Growth Hacking');
    } else if (normalizedInput.includes('finance') || normalizedInput.includes('bank') || normalizedInput.includes('money') || normalizedInput.includes('financial') || normalizedInput.includes('fintech') || normalizedInput.includes('banking') || normalizedInput.includes('investment') || normalizedInput.includes('insurance') || normalizedInput.includes('cryptocurrency') || normalizedInput.includes('blockchain') || normalizedInput.includes('trading') || normalizedInput.includes('portfolio') || normalizedInput.includes('wealth') || normalizedInput.includes('payment') || normalizedInput.includes('lending') || normalizedInput.includes('credit') || normalizedInput.includes('compliance') || normalizedInput.includes('risk')) {
      mockSuggestions.push('Financial Planning', 'Investment Strategy', 'Banking & FinTech', 'Risk Management', 'Cryptocurrency & Blockchain', 'Portfolio Management', 'Wealth Management', 'Insurance & InsurTech', 'Payment Systems', 'Alternative Lending', 'Regulatory Compliance', 'Financial Data Analytics', 'Trading & Algorithms', 'Financial Inclusion', 'Open Banking', 'Fraud Detection');
    } else {
      // Generic suggestions
      mockSuggestions.push('Innovation', 'Strategy', 'Technology', 'Leadership', 'Analytics', 'Customer Experience', 'Digital Transformation', 'Business Development');
    }
    
    return mockSuggestions;
  }

  // Generate topic suggestions based on industry using AI prompt
  async generateTopicSuggestionsFromIndustry(industry: string): Promise<string[]> {
    await this.delay(500); // Simulate API call delay
    
    const normalizedIndustry = industry.toLowerCase().trim();
    
    // If industry is too short, return empty
    if (normalizedIndustry.length < 2) {
      return [];
    }

    // Use AI prompt to generate topic suggestions from industry
    const prompt = `List keywords for topics related to the industry "${industry}". Output only keywords, one per line, no explanations.`;
    
    // Simulate AI response - in real implementation, call AI API here
    await this.delay(800);
    
    // Mock response based on industry patterns - in real implementation, use AI response
    const mockSuggestions: string[] = [];
    
    if (normalizedIndustry.includes('tech') || normalizedIndustry.includes('software') || normalizedIndustry.includes('digital') || normalizedIndustry.includes('it')) {
      mockSuggestions.push('Software Development', 'Web Development', 'Mobile Apps', 'Cloud Computing', 'DevOps', 'Artificial Intelligence', 'Machine Learning', 'Cybersecurity', 'Database Management', 'UI/UX Design', 'Software Testing', 'Agile Methodology', 'Open Source', 'Enterprise Software', 'SaaS');
    } else if (normalizedIndustry.includes('health') || normalizedIndustry.includes('medical') || normalizedIndustry.includes('care') || normalizedIndustry.includes('wellness')) {
      mockSuggestions.push('Public Health', 'Medical Research', 'Pharmaceuticals', 'Healthcare Technology', 'Telemedicine', 'Health Insurance', 'Mental Health', 'Nutrition', 'Elderly Care', 'Pediatrics', 'Surgery', 'Diagnostics', 'Hospital Management', 'Medical Devices', 'Epidemiology');
    } else if (normalizedIndustry.includes('finance') || normalizedIndustry.includes('bank') || normalizedIndustry.includes('money') || normalizedIndustry.includes('investment')) {
      mockSuggestions.push('Personal Finance', 'Corporate Finance', 'Banking', 'FinTech', 'Investment', 'Trading', 'Cryptocurrency', 'Insurance', 'Wealth Management', 'Accounting', 'Taxation', 'Financial Markets', 'Risk Management', 'Sustainable Finance', 'ESG Investing');
    } else if (normalizedIndustry.includes('education') || normalizedIndustry.includes('school') || normalizedIndustry.includes('learning') || normalizedIndustry.includes('training')) {
      mockSuggestions.push('Online Learning', 'Educational Technology', 'Student Engagement', 'Curriculum Design', 'Learning Analytics', 'Educational Innovation', 'Teacher Training', 'Assessment Methods', 'Special Education', 'Higher Education', 'K-12 Education', 'Lifelong Learning', 'EdTech', 'Digital Literacy', 'STEM Education');
    } else if (normalizedIndustry.includes('business') || normalizedIndustry.includes('corporate') || normalizedIndustry.includes('enterprise') || normalizedIndustry.includes('consulting')) {
      mockSuggestions.push('Leadership', 'Entrepreneurship', 'Business Strategy', 'Operations Management', 'Change Management', 'Project Management', 'Business Development', 'Sales Strategy', 'Customer Success', 'Business Analytics', 'Supply Chain', 'Organizational Development', 'Management Consulting', 'Business Services', 'Professional Services');
    } else if (normalizedIndustry.includes('marketing') || normalizedIndustry.includes('advertising') || normalizedIndustry.includes('promotion') || normalizedIndustry.includes('brand')) {
      mockSuggestions.push('Digital Marketing', 'Content Marketing', 'Social Media Marketing', 'Brand Strategy', 'Marketing Analytics', 'Customer Experience', 'Email Marketing', 'SEO/SEM', 'Influencer Marketing', 'Marketing Automation', 'Growth Hacking', 'Marketing Technology', 'Consumer Behavior', 'Content Strategy', 'Social Media');
    } else if (normalizedIndustry.includes('data') || normalizedIndustry.includes('analytics') || normalizedIndustry.includes('intelligence') || normalizedIndustry.includes('research')) {
      mockSuggestions.push('Data Analytics', 'Business Intelligence', 'Data Visualization', 'Big Data', 'Data Engineering', 'Statistical Analysis', 'Predictive Analytics', 'Data Mining', 'Data Governance', 'Data Quality', 'Data Science', 'Machine Learning', 'Data Management', 'Data Architecture', 'Data Security');
    } else if (normalizedIndustry.includes('design') || normalizedIndustry.includes('ux') || normalizedIndustry.includes('ui') || normalizedIndustry.includes('user')) {
      mockSuggestions.push('User Experience (UX)', 'User Interface (UI)', 'Product Design', 'Graphic Design', 'Design Thinking', 'Visual Design', 'Interaction Design', 'Design Systems', 'Brand Design', 'Web Design', 'Mobile Design', 'Design Research', 'Creative Services', 'Visual Communication', 'Design Innovation');
    } else {
      // Generic suggestions for unknown industries
      mockSuggestions.push('Innovation', 'Strategy', 'Technology', 'Leadership', 'Analytics', 'Customer Experience', 'Digital Transformation', 'Business Development', 'Process Improvement', 'Quality Management', 'Risk Management', 'Sustainability', 'Automation', 'Data Science', 'Project Management');
    }
    
    return mockSuggestions;
  }

  // Generate industry suggestions based on input using AI prompt
  async generateIndustrySuggestions(input: string): Promise<string[]> {
    await this.delay(500); // Simulate API call delay
    
    const normalizedInput = input.toLowerCase().trim();
    
    // If input is too short, return empty
    if (normalizedInput.length < 2) {
      return [];
    }

    // Use AI prompt to generate industry suggestions
    const prompt = `Generate 8 industry suggestions related to "${input}". Output only industry names, one per line, no explanations.`;
    
    // Simulate AI response - in real implementation, call AI API here
    await this.delay(800);
    
    // Mock response based on input patterns - in real implementation, use AI response
    const mockSuggestions: string[] = [];
    
    if (normalizedInput.includes('tech') || normalizedInput.includes('software') || normalizedInput.includes('digital') || normalizedInput.includes('it')) {
      mockSuggestions.push('Software Development', 'IT Services', 'Cybersecurity', 'Cloud Computing', 'Technology', 'Digital Services', 'Artificial Intelligence', 'Data Science');
    } else if (normalizedInput.includes('health') || normalizedInput.includes('medical') || normalizedInput.includes('care') || normalizedInput.includes('wellness')) {
      mockSuggestions.push('Medical Devices', 'Biotechnology', 'Healthcare IT', 'Pharmaceuticals', 'Healthcare', 'Medical Technology', 'Telemedicine', 'Health Analytics');
    } else if (normalizedInput.includes('finance') || normalizedInput.includes('bank') || normalizedInput.includes('money') || normalizedInput.includes('financial') || normalizedInput.includes('fintech') || normalizedInput.includes('banking') || normalizedInput.includes('investment') || normalizedInput.includes('insurance') || normalizedInput.includes('cryptocurrency') || normalizedInput.includes('blockchain') || normalizedInput.includes('trading') || normalizedInput.includes('portfolio') || normalizedInput.includes('wealth') || normalizedInput.includes('payment') || normalizedInput.includes('lending') || normalizedInput.includes('credit') || normalizedInput.includes('compliance') || normalizedInput.includes('risk')) {
      mockSuggestions.push('Investment Banking', 'Fintech', 'Insurance', 'Wealth Management', 'Financial Services', 'Banking', 'Cryptocurrency', 'Financial Technology', 'InsurTech', 'Blockchain', 'Trading', 'Portfolio Management', 'Payment Systems', 'Alternative Lending', 'Credit Services', 'Regulatory Compliance', 'Risk Management', 'Digital Banking');
    } else if (normalizedInput.includes('education') || normalizedInput.includes('school') || normalizedInput.includes('learning') || normalizedInput.includes('training')) {
      mockSuggestions.push('EdTech', 'Training & Development', 'E-Learning', 'Higher Education', 'Education', 'Educational Services', 'Online Learning', 'Educational Technology');
    } else if (normalizedInput.includes('business') || normalizedInput.includes('corporate') || normalizedInput.includes('enterprise') || normalizedInput.includes('consulting')) {
      mockSuggestions.push('Management Consulting', 'Business Services', 'Professional Services', 'Advisory Services', 'Consulting', 'Business Solutions', 'Corporate Strategy', 'Business Development');
    } else if (normalizedInput.includes('marketing') || normalizedInput.includes('advertising') || normalizedInput.includes('promotion') || normalizedInput.includes('brand')) {
      mockSuggestions.push('Digital Marketing', 'Advertising', 'Marketing Services', 'Brand Management', 'Marketing', 'Creative Services', 'Social Media', 'Content Marketing');
    } else if (normalizedInput.includes('data') || normalizedInput.includes('analytics') || normalizedInput.includes('intelligence') || normalizedInput.includes('research')) {
      mockSuggestions.push('Data Analytics', 'Business Intelligence', 'Data Science', 'Research & Development', 'Machine Learning', 'Artificial Intelligence', 'Data Engineering', 'Predictive Analytics');
    } else {
      // Generic suggestions for unknown inputs
      mockSuggestions.push('Technology', 'Healthcare', 'Finance', 'Education', 'Business', 'Marketing', 'Data Analytics', 'Consulting');
    }
    
    return mockSuggestions;
  }

  // Generate topic keywords from industry using AI prompt (main function)
  async generateTopicKeywordsFromIndustry(industry: string): Promise<string[]> {
    return await this.generateTopicSuggestionsFromIndustry(industry);
  }

  // Get the AI prompt for generating topic keywords from industry
  getIndustryTopicPrompt(industry: string): string {
    return `List keywords for topics related to the industry "${industry}". Output only keywords, one per line, no explanations.`;
  }

  // Convert sentences to topic keywords using AI prompt
  async convertSentenceToTopic(sentence: string, industry?: string): Promise<string[]> {
    await this.delay(600); // Simulate AI API call delay
    
    const normalizedSentence = sentence.toLowerCase().trim();
    
    // If sentence is too short, return empty
    if (normalizedSentence.length < 3) {
      return [];
    }

    // Use AI prompt to convert sentence to topic keywords
    const prompt = industry 
      ? `Convert this sentence to 3-5 topic keywords related to the "${industry}" industry: "${sentence}". Output only keywords, one per line, no explanations.`
      : `Convert this sentence to 3-5 topic keywords: "${sentence}". Output only keywords, one per line, no explanations.`;
    
    // Simulate AI response - in real implementation, call AI API here
    await this.delay(800);
    
    // Mock response based on sentence patterns - in real implementation, use AI response
    const mockTopics: string[] = [];
    
    // Extract key concepts from the sentence
    if (normalizedSentence.includes('machine learning') || normalizedSentence.includes('artificial intelligence') || normalizedSentence.includes('ai')) {
      mockTopics.push('Artificial Intelligence', 'Machine Learning', 'Data Science', 'Neural Networks', 'Deep Learning');
    } else if (normalizedSentence.includes('software') || normalizedSentence.includes('development') || normalizedSentence.includes('programming')) {
      mockTopics.push('Software Development', 'Programming', 'Web Development', 'Mobile Development', 'DevOps');
    } else if (normalizedSentence.includes('data') || normalizedSentence.includes('analytics') || normalizedSentence.includes('statistics')) {
      mockTopics.push('Data Analytics', 'Business Intelligence', 'Data Visualization', 'Statistical Analysis', 'Data Science');
    } else if (normalizedSentence.includes('leadership') || normalizedSentence.includes('management') || normalizedSentence.includes('team')) {
      mockTopics.push('Leadership', 'Management', 'Team Building', 'Organizational Development', 'Change Management');
    } else if (normalizedSentence.includes('marketing') || normalizedSentence.includes('brand') || normalizedSentence.includes('advertising')) {
      mockTopics.push('Digital Marketing', 'Brand Strategy', 'Content Marketing', 'Social Media Marketing', 'Marketing Analytics');
    } else if (normalizedSentence.includes('finance') || normalizedSentence.includes('banking') || normalizedSentence.includes('investment') || normalizedSentence.includes('financial') || normalizedSentence.includes('fintech') || normalizedSentence.includes('cryptocurrency') || normalizedSentence.includes('blockchain') || normalizedSentence.includes('trading') || normalizedSentence.includes('portfolio') || normalizedSentence.includes('wealth') || normalizedSentence.includes('insurance') || normalizedSentence.includes('payment') || normalizedSentence.includes('lending') || normalizedSentence.includes('credit') || normalizedSentence.includes('compliance') || normalizedSentence.includes('risk')) {
      mockTopics.push('Financial Planning', 'Investment Strategy', 'Banking & FinTech', 'Risk Management', 'Cryptocurrency & Blockchain', 'Portfolio Management', 'Wealth Management', 'Insurance & InsurTech', 'Payment Systems', 'Alternative Lending', 'Regulatory Compliance', 'Financial Data Analytics', 'Trading & Algorithms', 'Financial Inclusion', 'Open Banking', 'Fraud Detection');
    } else if (normalizedSentence.includes('health') || normalizedSentence.includes('medical') || normalizedSentence.includes('healthcare')) {
      mockTopics.push('Healthcare Innovation', 'Medical Technology', 'Digital Health', 'Patient Care', 'Medical Research');
    } else if (normalizedSentence.includes('education') || normalizedSentence.includes('learning') || normalizedSentence.includes('teaching')) {
      mockTopics.push('Educational Technology', 'Online Learning', 'Curriculum Design', 'Student Engagement', 'Learning Analytics');
    } else if (normalizedSentence.includes('design') || normalizedSentence.includes('ux') || normalizedSentence.includes('ui')) {
      mockTopics.push('User Experience', 'User Interface Design', 'Product Design', 'Design Thinking', 'Visual Design');
    } else if (normalizedSentence.includes('business') || normalizedSentence.includes('strategy') || normalizedSentence.includes('entrepreneur')) {
      mockTopics.push('Business Strategy', 'Entrepreneurship', 'Business Development', 'Operations Management', 'Project Management');
    } else {
      // Generic extraction - try to identify key nouns and concepts
      const words = normalizedSentence.split(' ').filter(word => word.length > 3);
      const keyWords = words.slice(0, 5); // Take first 5 meaningful words
      mockTopics.push(...keyWords.map(word => word.charAt(0).toUpperCase() + word.slice(1)));
    }
    
    return mockTopics.slice(0, 8); // Return up to 8 topics
  }

  // Get industry-based topic hints
  async getIndustryTopicHints(industry: string): Promise<string[]> {
    await this.delay(400); // Simulate AI API call delay
    
    const normalizedIndustry = industry.toLowerCase().trim();
    
    // If industry is too short, return empty
    if (normalizedIndustry.length < 2) {
      return [];
    }

    // First try to get hints from global industry configuration
    const globalIndustry = getIndustryByName(industry);
    if (globalIndustry) {
      return globalIndustry.topicHints;
    }

    // Use AI prompt to get topic hints for industry
    const prompt = `Provide 15-20 popular speaking topics for the "${industry}" industry. Output only topic names, one per line, no explanations.`;
    
    // Simulate AI response - in real implementation, call AI API here
    await this.delay(600);
    
    // Mock response based on industry - in real implementation, use AI response
    const mockHints: string[] = [];
    
    if (normalizedIndustry.includes('tech') || normalizedIndustry.includes('software') || normalizedIndustry.includes('digital') || normalizedIndustry.includes('it')) {
      mockHints.push(
        'Artificial Intelligence & Machine Learning', 
        'Cloud Computing & Infrastructure', 
        'Cybersecurity & Data Protection', 
        'Digital Transformation & Innovation', 
        'Software Development & Engineering', 
        'Data Science & Analytics', 
        'DevOps & Automation', 
        'Mobile App Development', 
        'Web Development & Frontend', 
        'Backend Development & APIs', 
        'Database Management & Design', 
        'Network Security & Infrastructure', 
        'IoT & Connected Devices', 
        'Blockchain & Distributed Systems', 
        'User Experience (UX) Design', 
        'Product Management & Strategy', 
        'Agile & Scrum Methodologies', 
        'Quality Assurance & Testing', 
        'System Architecture & Design', 
        'Emerging Technologies & Trends'
      );
    } else if (normalizedIndustry.includes('health') || normalizedIndustry.includes('medical') || normalizedIndustry.includes('care') || normalizedIndustry.includes('wellness')) {
      mockHints.push(
        'Digital Health & Telemedicine', 
        'Healthcare Data Analytics', 
        'Medical Device Innovation', 
        'Healthcare Policy & Regulation', 
        'Mental Health Technology', 
        'Preventive Care & Wellness', 
        'Electronic Health Records (EHR)', 
        'Healthcare AI & Machine Learning', 
        'Patient Care Technology', 
        'Healthcare Cybersecurity', 
        'Medical Imaging & Diagnostics', 
        'Pharmaceutical Innovation', 
        'Healthcare Operations & Management', 
        'Population Health Management', 
        'Healthcare Interoperability', 
        'Clinical Decision Support Systems', 
        'Healthcare Quality & Safety', 
        'Healthcare Finance & Economics', 
        'Healthcare Workforce Development', 
        'Healthcare Innovation & Research'
      );
    } else if (normalizedIndustry.includes('finance') || normalizedIndustry.includes('bank') || normalizedIndustry.includes('money') || normalizedIndustry.includes('financial') || normalizedIndustry.includes('fintech') || normalizedIndustry.includes('banking') || normalizedIndustry.includes('investment') || normalizedIndustry.includes('insurance')) {
      mockHints.push(
        'Fintech Innovation & Digital Banking', 
        'Cryptocurrency & Blockchain Technology', 
        'Investment Strategies & Portfolio Management', 
        'Risk Management & Regulatory Compliance', 
        'Financial Planning & Wealth Management', 
        'Sustainable Finance & ESG Investing', 
        'Payment Systems & Digital Wallets', 
        'Alternative Lending & Credit Solutions', 
        'Financial Data Analytics & AI', 
        'InsurTech & Digital Insurance', 
        'Trading Algorithms & Quantitative Finance', 
        'Financial Inclusion & Accessibility', 
        'Open Banking & API Integration', 
        'Fraud Detection & Cybersecurity', 
        'Corporate Finance & M&A', 
        'Real Estate Finance & Investment', 
        'International Finance & Forex', 
        'Financial Modeling & Valuation', 
        'Retail Banking & Customer Experience', 
        'Central Bank Digital Currencies (CBDC)'
      );
    } else if (normalizedIndustry.includes('education') || normalizedIndustry.includes('school') || normalizedIndustry.includes('learning') || normalizedIndustry.includes('training')) {
      mockHints.push('EdTech Solutions', 'Online Learning Platforms', 'Student Engagement Strategies', 'Educational Data Analytics', 'Digital Literacy', 'STEM Education', 'Learning Management Systems', 'Educational Innovation');
    } else if (normalizedIndustry.includes('business') || normalizedIndustry.includes('corporate') || normalizedIndustry.includes('enterprise') || normalizedIndustry.includes('consulting')) {
      mockHints.push('Business Strategy', 'Leadership Development', 'Change Management', 'Organizational Culture', 'Business Process Optimization', 'Customer Experience', 'Digital Transformation', 'Business Analytics');
    } else if (normalizedIndustry.includes('marketing') || normalizedIndustry.includes('advertising') || normalizedIndustry.includes('promotion') || normalizedIndustry.includes('brand')) {
      mockHints.push('Digital Marketing Trends', 'Brand Strategy', 'Content Marketing', 'Social Media Strategy', 'Marketing Automation', 'Customer Analytics', 'Influencer Marketing', 'Growth Hacking');
    } else if (normalizedIndustry.includes('data') || normalizedIndustry.includes('analytics') || normalizedIndustry.includes('intelligence') || normalizedIndustry.includes('research')) {
      mockHints.push('Data Science Applications', 'Business Intelligence', 'Machine Learning', 'Predictive Analytics', 'Data Visualization', 'Big Data Strategy', 'Data Governance', 'Research & Development');
    } else if (normalizedIndustry.includes('design') || normalizedIndustry.includes('ux') || normalizedIndustry.includes('ui') || normalizedIndustry.includes('user')) {
      mockHints.push('User Experience Design', 'Design Thinking', 'Product Design', 'Visual Design', 'Interaction Design', 'Design Systems', 'User Research', 'Design Innovation');
    } else {
      // Generic hints for unknown industries
      mockHints.push('Industry Innovation', 'Digital Transformation', 'Technology Trends', 'Best Practices', 'Future Outlook', 'Strategic Planning', 'Market Analysis', 'Competitive Advantage');
    }
    
    return mockHints;
  }
}

// Export singleton instance
export const aiSuggestionService = AISuggestionService.getInstance();
