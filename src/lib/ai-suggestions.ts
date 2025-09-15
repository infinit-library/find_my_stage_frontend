import { TOP_TOPICS, TOP_INDUSTRIES } from "./taxonomy";

// Industry-specific topic mappings
const INDUSTRY_TOPIC_MAPPINGS: Record<string, string[]> = {
  "Technology": [
    "Artificial Intelligence", "Machine Learning", "Cloud Computing", "Cybersecurity", 
    "Data Science", "Software Development", "DevOps", "Blockchain", "IoT", "Mobile Development",
    "Web Development", "API Design", "Microservices", "Digital Transformation", "Agile"
  ],
  "Healthcare": [
    "Digital Health", "Telemedicine", "Medical Technology", "Healthcare Innovation", 
    "Patient Care", "Medical Research", "Healthcare Analytics", "Mental Health", 
    "Preventive Care", "Healthcare Policy", "Medical Devices", "Pharmaceuticals", "Nursing"
  ],
  "Finance": [
    "Fintech", "Digital Banking", "Cryptocurrency", "Investment Strategies", 
    "Risk Management", "Financial Planning", "Trading", "Insurance", "Regulatory Compliance",
    "Financial Technology", "Wealth Management", "Corporate Finance", "Financial Analytics"
  ],
  "Education": [
    "Online Learning", "Educational Technology", "Student Engagement", "Curriculum Design",
    "Learning Analytics", "Educational Innovation", "Teacher Training", "Assessment Methods",
    "Special Education", "Higher Education", "K-12 Education", "Lifelong Learning"
  ],
  "Marketing": [
    "Digital Marketing", "Content Marketing", "Social Media Marketing", "Brand Strategy",
    "Marketing Analytics", "Customer Experience", "Email Marketing", "SEO/SEM", "Influencer Marketing",
    "Marketing Automation", "Growth Hacking", "Marketing Technology", "Consumer Behavior"
  ],
  "Business": [
    "Leadership", "Entrepreneurship", "Business Strategy", "Operations Management",
    "Change Management", "Project Management", "Business Development", "Sales Strategy",
    "Customer Success", "Business Analytics", "Supply Chain", "Organizational Development"
  ],
  "Design": [
    "User Experience (UX)", "User Interface (UI)", "Product Design", "Graphic Design",
    "Design Thinking", "Visual Design", "Interaction Design", "Design Systems",
    "Brand Design", "Web Design", "Mobile Design", "Design Research"
  ],
  "Data": [
    "Data Analytics", "Business Intelligence", "Data Visualization", "Big Data",
    "Data Engineering", "Statistical Analysis", "Predictive Analytics", "Data Mining",
    "Data Governance", "Data Quality", "Data Science", "Machine Learning"
  ]
};

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

  // Check if a topic is related to an industry
  isTopicRelatedToIndustry(topic: string, industry: string): boolean {
    if (!topic || !industry) {
      return true; // If either is empty, don't block
    }

    const normalizedTopic = topic.toLowerCase().trim();
    const normalizedIndustry = industry.toLowerCase().trim();

    // Check for meaningless inputs (repeated characters, very short words, etc.)
    if (this.isMeaninglessInput(normalizedTopic)) {
      return false; // Block meaningless inputs
    }

    // Find the industry key
    const industryKey = Object.keys(INDUSTRY_TOPIC_MAPPINGS).find(key => 
      key.toLowerCase() === normalizedIndustry
    );

    if (!industryKey) {
      return true; // If industry not found in mappings, don't block
    }

    const industryTopics = INDUSTRY_TOPIC_MAPPINGS[industryKey];
    
    // Check if topic matches any industry-specific topic
    const isRelated = industryTopics.some(industryTopic => {
      const normalizedIndustryTopic = industryTopic.toLowerCase();
      
      // Exact match
      if (normalizedIndustryTopic === normalizedTopic) {
        return true;
      }
      
      // Partial match (topic contains industry topic or vice versa)
      if (normalizedTopic.includes(normalizedIndustryTopic) || 
          normalizedIndustryTopic.includes(normalizedTopic)) {
        return true;
      }
      
      // Word-level match - but be more strict
      const topicWords = normalizedTopic.split(' ').filter(word => word.length > 2); // Only consider words longer than 2 chars
      const industryTopicWords = normalizedIndustryTopic.split(' ').filter(word => word.length > 2);
      
      return topicWords.some(topicWord => 
        industryTopicWords.some(industryWord => 
          topicWord.includes(industryWord) || industryWord.includes(topicWord)
        )
      );
    });

    return isRelated;
  }

  // Generate topic suggestions based on input and industry context
  async generateTopicSuggestions(input: string, industry?: string): Promise<string[]> {
    await this.delay(500); // Simulate API call delay
    
    const normalizedInput = input.toLowerCase().trim();
    
    // If input is too short, return empty
    if (normalizedInput.length < 2) {
      return [];
    }

    // Get industry-specific topics if industry is provided
    let availableTopics = TOP_TOPICS;
    if (industry) {
      const industryKey = Object.keys(INDUSTRY_TOPIC_MAPPINGS).find(key => 
        key.toLowerCase() === industry.toLowerCase()
      );
      if (industryKey) {
        availableTopics = INDUSTRY_TOPIC_MAPPINGS[industryKey];
      }
    }

    // Find exact matches first
    const exactMatches = availableTopics.filter(topic => 
      topic.toLowerCase() === normalizedInput
    );

    // Find partial matches (more flexible)
    const partialMatches = availableTopics.filter(topic => 
      topic.toLowerCase().includes(normalizedInput) && 
      !exactMatches.includes(topic)
    );

    // Find fuzzy matches (words that start with the input)
    const fuzzyMatches = availableTopics.filter(topic => 
      topic.toLowerCase().split(' ').some(word => word.startsWith(normalizedInput)) &&
      !exactMatches.includes(topic) && !partialMatches.includes(topic)
    );

    // Generate AI-like suggestions based on input patterns within the industry context
    const aiSuggestions: string[] = [];
    
    // Add related topics from the available topics (industry-specific or general)
    if (normalizedInput.includes('tech') || normalizedInput.includes('software') || normalizedInput.includes('code') || normalizedInput.includes('programming')) {
      aiSuggestions.push(...availableTopics.filter(topic => 
        topic.toLowerCase().includes('software') || topic.toLowerCase().includes('development') || 
        topic.toLowerCase().includes('programming') || topic.toLowerCase().includes('engineering')
      ));
    }
    if (normalizedInput.includes('data') || normalizedInput.includes('analytics') || normalizedInput.includes('stats') || normalizedInput.includes('analysis')) {
      aiSuggestions.push(...availableTopics.filter(topic => 
        topic.toLowerCase().includes('data') || topic.toLowerCase().includes('analytics') || 
        topic.toLowerCase().includes('intelligence') || topic.toLowerCase().includes('science')
      ));
    }
    if (normalizedInput.includes('lead') || normalizedInput.includes('manage') || normalizedInput.includes('team') || normalizedInput.includes('leadership')) {
      aiSuggestions.push(...availableTopics.filter(topic => 
        topic.toLowerCase().includes('leadership') || topic.toLowerCase().includes('management') || 
        topic.toLowerCase().includes('strategy') || topic.toLowerCase().includes('development')
      ));
    }
    if (normalizedInput.includes('market') || normalizedInput.includes('brand') || normalizedInput.includes('promote') || normalizedInput.includes('advertising')) {
      aiSuggestions.push(...availableTopics.filter(topic => 
        topic.toLowerCase().includes('marketing') || topic.toLowerCase().includes('brand') || 
        topic.toLowerCase().includes('strategy') || topic.toLowerCase().includes('growth')
      ));
    }
    if (normalizedInput.includes('ai') || normalizedInput.includes('artificial') || normalizedInput.includes('machine') || normalizedInput.includes('intelligence')) {
      aiSuggestions.push(...availableTopics.filter(topic => 
        topic.toLowerCase().includes('artificial') || topic.toLowerCase().includes('machine') || 
        topic.toLowerCase().includes('intelligence') || topic.toLowerCase().includes('learning')
      ));
    }
    if (normalizedInput.includes('design') || normalizedInput.includes('ux') || normalizedInput.includes('ui') || normalizedInput.includes('user')) {
      aiSuggestions.push(...availableTopics.filter(topic => 
        topic.toLowerCase().includes('design') || topic.toLowerCase().includes('user') || 
        topic.toLowerCase().includes('experience') || topic.toLowerCase().includes('interface')
      ));
    }
    if (normalizedInput.includes('sales') || normalizedInput.includes('revenue') || normalizedInput.includes('business') || normalizedInput.includes('growth')) {
      aiSuggestions.push(...availableTopics.filter(topic => 
        topic.toLowerCase().includes('sales') || topic.toLowerCase().includes('business') || 
        topic.toLowerCase().includes('strategy') || topic.toLowerCase().includes('development')
      ));
    }
    if (normalizedInput.includes('security') || normalizedInput.includes('cyber') || normalizedInput.includes('safe') || normalizedInput.includes('privacy')) {
      aiSuggestions.push(...availableTopics.filter(topic => 
        topic.toLowerCase().includes('security') || topic.toLowerCase().includes('cyber') || 
        topic.toLowerCase().includes('risk') || topic.toLowerCase().includes('compliance')
      ));
    }
    if (normalizedInput.includes('finance') || normalizedInput.includes('money') || normalizedInput.includes('budget') || normalizedInput.includes('investment')) {
      aiSuggestions.push(...availableTopics.filter(topic => 
        topic.toLowerCase().includes('finance') || topic.toLowerCase().includes('financial') || 
        topic.toLowerCase().includes('investment') || topic.toLowerCase().includes('fintech')
      ));
    }
    if (normalizedInput.includes('health') || normalizedInput.includes('medical') || normalizedInput.includes('care') || normalizedInput.includes('wellness')) {
      aiSuggestions.push(...availableTopics.filter(topic => 
        topic.toLowerCase().includes('health') || topic.toLowerCase().includes('medical') || 
        topic.toLowerCase().includes('care') || topic.toLowerCase().includes('healthcare')
      ));
    }
    if (normalizedInput.includes('innovation') || normalizedInput.includes('startup') || normalizedInput.includes('entrepreneur')) {
      aiSuggestions.push(...availableTopics.filter(topic => 
        topic.toLowerCase().includes('innovation') || topic.toLowerCase().includes('entrepreneur') || 
        topic.toLowerCase().includes('startup') || topic.toLowerCase().includes('transformation')
      ));
    }
    if (normalizedInput.includes('customer') || normalizedInput.includes('client') || normalizedInput.includes('service')) {
      aiSuggestions.push(...availableTopics.filter(topic => 
        topic.toLowerCase().includes('customer') || topic.toLowerCase().includes('client') || 
        topic.toLowerCase().includes('service') || topic.toLowerCase().includes('experience')
      ));
    }

    // Combine and deduplicate
    const allSuggestions = [...exactMatches, ...partialMatches, ...fuzzyMatches, ...aiSuggestions];
    const uniqueSuggestions = Array.from(new Set(allSuggestions));
    
    return uniqueSuggestions.slice(0, 8); // Increased to 8 suggestions
  }

  // Generate topic suggestions based on industry
  async generateTopicSuggestionsFromIndustry(industry: string): Promise<string[]> {
    await this.delay(500); // Simulate API call delay
    
    const normalizedIndustry = industry.toLowerCase().trim();
    
    // If industry is too short, return empty
    if (normalizedIndustry.length < 2) {
      return [];
    }

    // Generate topic suggestions based on industry (more comprehensive)
    const industryTopics: { [key: string]: string[] } = {
      'technology': [
        'Artificial Intelligence', 'Machine Learning', 'Cloud Computing', 'Cybersecurity',
        'Software Development', 'DevOps', 'Data Science', 'Blockchain', 'IoT', 'Quantum Computing',
        'Digital Transformation', 'Technology Innovation', 'Software Engineering', 'Mobile Development'
      ],
      'healthcare': [
        'Digital Health', 'Medical Technology', 'Healthcare Innovation', 'Telemedicine',
        'Health Informatics', 'Medical Devices', 'Biotechnology', 'Pharmaceuticals', 'Public Health',
        'Healthcare Analytics', 'Patient Care', 'Medical Research', 'Health Data'
      ],
      'finance': [
        'Fintech', 'Digital Banking', 'Cryptocurrency', 'Investment Strategy',
        'Financial Planning', 'Risk Management', 'Corporate Finance', 'Wealth Management',
        'Financial Technology', 'Digital Payments', 'Financial Analytics', 'Regulatory Compliance'
      ],
      'education': [
        'EdTech', 'Online Learning', 'Educational Technology', 'Learning Analytics',
        'Digital Literacy', 'STEM Education', 'E-Learning', 'Training & Development',
        'Educational Innovation', 'Student Success', 'Learning Management', 'Educational Data'
      ],
      'retail': [
        'E-Commerce', 'Digital Marketing', 'Customer Experience', 'Supply Chain',
        'Retail Technology', 'Omnichannel', 'Consumer Behavior', 'Brand Strategy',
        'Retail Analytics', 'Customer Journey', 'Inventory Management', 'Retail Innovation'
      ],
      'manufacturing': [
        'Industry 4.0', 'Smart Manufacturing', 'Automation', 'Quality Management',
        'Supply Chain Optimization', 'Lean Manufacturing', 'Industrial IoT', 'Process Improvement',
        'Manufacturing Analytics', 'Production Efficiency', 'Smart Factory', 'Manufacturing Innovation'
      ],
      'energy': [
        'Renewable Energy', 'Clean Technology', 'Energy Efficiency', 'Smart Grid',
        'Solar Technology', 'Wind Energy', 'Energy Storage', 'Sustainability',
        'Energy Analytics', 'Green Technology', 'Energy Management', 'Climate Solutions'
      ],
      'media': [
        'Digital Media', 'Content Strategy', 'Social Media', 'Video Production',
        'Digital Marketing', 'Brand Storytelling', 'Content Creation', 'Media Analytics',
        'Media Technology', 'Content Marketing', 'Digital Advertising', 'Media Innovation'
      ],
      'transportation': [
        'Logistics', 'Supply Chain', 'Transportation Technology', 'Fleet Management',
        'Last Mile Delivery', 'Autonomous Vehicles', 'Smart Transportation', 'Freight Optimization',
        'Transportation Analytics', 'Mobility Solutions', 'Transportation Innovation', 'Smart Logistics'
      ],
      'real estate': [
        'PropTech', 'Real Estate Technology', 'Smart Buildings', 'Property Management',
        'Real Estate Investment', 'Commercial Real Estate', 'Residential Development', 'Urban Planning',
        'Real Estate Analytics', 'Property Technology', 'Real Estate Innovation', 'Smart Cities'
      ]
    };

    // Find matching industry and return topics (more flexible matching)
    for (const [key, topics] of Object.entries(industryTopics)) {
      if (normalizedIndustry.includes(key) || key.includes(normalizedIndustry)) {
        return topics.slice(0, 10); // Return up to 10 relevant topics
      }
    }

    // If no specific match, generate general suggestions based on common patterns
    const generalTopics: string[] = [];
    
    if (normalizedIndustry.includes('tech') || normalizedIndustry.includes('software') || normalizedIndustry.includes('digital') || normalizedIndustry.includes('it')) {
      generalTopics.push('Digital Transformation', 'Technology Innovation', 'Software Development', 'Data Analytics', 'Cloud Computing', 'Cybersecurity');
    }
    if (normalizedIndustry.includes('business') || normalizedIndustry.includes('corporate') || normalizedIndustry.includes('enterprise') || normalizedIndustry.includes('consulting')) {
      generalTopics.push('Business Strategy', 'Leadership', 'Change Management', 'Process Improvement', 'Organizational Development', 'Business Innovation');
    }
    if (normalizedIndustry.includes('marketing') || normalizedIndustry.includes('sales') || normalizedIndustry.includes('customer') || normalizedIndustry.includes('advertising')) {
      generalTopics.push('Customer Experience', 'Digital Marketing', 'Sales Strategy', 'Brand Management', 'Marketing Analytics', 'Customer Success');
    }
    if (normalizedIndustry.includes('data') || normalizedIndustry.includes('analytics') || normalizedIndustry.includes('intelligence') || normalizedIndustry.includes('research')) {
      generalTopics.push('Data Science', 'Business Intelligence', 'Machine Learning', 'Predictive Analytics', 'Data Visualization', 'Research & Development');
    }
    if (normalizedIndustry.includes('health') || normalizedIndustry.includes('medical') || normalizedIndustry.includes('care') || normalizedIndustry.includes('wellness')) {
      generalTopics.push('Healthcare Innovation', 'Medical Technology', 'Digital Health', 'Health Analytics', 'Patient Care', 'Medical Research');
    }
    if (normalizedIndustry.includes('finance') || normalizedIndustry.includes('bank') || normalizedIndustry.includes('money') || normalizedIndustry.includes('investment')) {
      generalTopics.push('Financial Technology', 'Digital Banking', 'Investment Strategy', 'Financial Planning', 'Risk Management', 'Fintech Innovation');
    }

    return generalTopics.length > 0 ? generalTopics.slice(0, 10) : [];
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

    // Find fuzzy matches (words that start with the input)
    const fuzzyMatches = TOP_INDUSTRIES.filter(industry => 
      industry.toLowerCase().split(' ').some(word => word.startsWith(normalizedInput)) &&
      !exactMatches.includes(industry) && !partialMatches.includes(industry)
    );

    // Generate AI-like suggestions based on common patterns (more comprehensive)
    const aiSuggestions: string[] = [];
    
    // Add related industries based on input patterns
    if (normalizedInput.includes('tech') || normalizedInput.includes('software') || normalizedInput.includes('digital') || normalizedInput.includes('it')) {
      aiSuggestions.push('Software Development', 'IT Services', 'Cybersecurity', 'Cloud Computing', 'Technology', 'Digital Services');
    }
    if (normalizedInput.includes('health') || normalizedInput.includes('medical') || normalizedInput.includes('care') || normalizedInput.includes('wellness')) {
      aiSuggestions.push('Medical Devices', 'Biotechnology', 'Healthcare IT', 'Pharmaceuticals', 'Healthcare', 'Medical Technology');
    }
    if (normalizedInput.includes('finance') || normalizedInput.includes('bank') || normalizedInput.includes('money') || normalizedInput.includes('financial')) {
      aiSuggestions.push('Investment Banking', 'Fintech', 'Insurance', 'Wealth Management', 'Financial Services', 'Banking');
    }
    if (normalizedInput.includes('education') || normalizedInput.includes('school') || normalizedInput.includes('learning') || normalizedInput.includes('training')) {
      aiSuggestions.push('EdTech', 'Training & Development', 'E-Learning', 'Higher Education', 'Education', 'Educational Services');
    }
    if (normalizedInput.includes('retail') || normalizedInput.includes('commerce') || normalizedInput.includes('shop') || normalizedInput.includes('consumer')) {
      aiSuggestions.push('E-Commerce', 'Consumer Goods', 'Fashion', 'Luxury Retail', 'Retail', 'Consumer Products');
    }
    if (normalizedInput.includes('manufactur') || normalizedInput.includes('production') || normalizedInput.includes('factory') || normalizedInput.includes('industrial')) {
      aiSuggestions.push('Industrial Manufacturing', 'Automotive', 'Aerospace', 'Electronics', 'Manufacturing', 'Production');
    }
    if (normalizedInput.includes('energy') || normalizedInput.includes('power') || normalizedInput.includes('solar') || normalizedInput.includes('renewable')) {
      aiSuggestions.push('Renewable Energy', 'Oil & Gas', 'Utilities', 'Clean Technology', 'Energy', 'Power Generation');
    }
    if (normalizedInput.includes('media') || normalizedInput.includes('content') || normalizedInput.includes('publish') || normalizedInput.includes('broadcast')) {
      aiSuggestions.push('Digital Media', 'Broadcasting', 'Publishing', 'Content Creation', 'Media', 'Entertainment');
    }
    if (normalizedInput.includes('transport') || normalizedInput.includes('logistics') || normalizedInput.includes('shipping') || normalizedInput.includes('delivery')) {
      aiSuggestions.push('Logistics', 'Transportation', 'Supply Chain', 'Freight', 'Shipping', 'Delivery Services');
    }
    if (normalizedInput.includes('real') || normalizedInput.includes('property') || normalizedInput.includes('estate') || normalizedInput.includes('construction')) {
      aiSuggestions.push('Real Estate', 'Property Development', 'Commercial Real Estate', 'Residential', 'Construction', 'Property Management');
    }
    if (normalizedInput.includes('consulting') || normalizedInput.includes('advisory') || normalizedInput.includes('services') || normalizedInput.includes('business')) {
      aiSuggestions.push('Management Consulting', 'Business Services', 'Professional Services', 'Advisory Services', 'Consulting', 'Business Solutions');
    }
    if (normalizedInput.includes('marketing') || normalizedInput.includes('advertising') || normalizedInput.includes('promotion') || normalizedInput.includes('brand')) {
      aiSuggestions.push('Digital Marketing', 'Advertising', 'Marketing Services', 'Brand Management', 'Marketing', 'Creative Services');
    }

    // Combine and deduplicate
    const allSuggestions = [...exactMatches, ...partialMatches, ...fuzzyMatches, ...aiSuggestions];
    const uniqueSuggestions = Array.from(new Set(allSuggestions));
    
    return uniqueSuggestions.slice(0, 8); // Increased to 8 suggestions
  }
}

// Export singleton instance
export const aiSuggestionService = AISuggestionService.getInstance();
