
import { GLOBAL_INDUSTRIES, getIndustryByName, getTopicHintsForIndustry } from './global-industries';


export class AISuggestionService {
  private static instance: AISuggestionService;
  
  static getInstance(): AISuggestionService {
    if (!AISuggestionService.instance) {
      AISuggestionService.instance = new AISuggestionService();
    }
    return AISuggestionService.instance;
  }

  
  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  
  private isMeaninglessInput(input: string): boolean {
    const repeatedCharPattern = /^(.)\1{2,}$/;
    if (repeatedCharPattern.test(input)) {
      return true;
    }

    if (input.length < 3) {
      return true;
    }

    const hasVowels = /[aeiou]/.test(input);
    if (!hasVowels && input.length > 4) {
      return true;
    }

    const alphaRatio = (input.match(/[a-z]/g) || []).length / input.length;
    if (alphaRatio < 0.5 && input.length > 3) {
      return true;
    }

    return false;
  }

  
  async isTopicRelatedToIndustry(topic: string, industry: string): Promise<boolean> {
    if (!topic || !industry) {
      return true; 
    }

    const normalizedTopic = topic.toLowerCase().trim();
    const normalizedIndustry = industry.toLowerCase().trim();

    if (this.isMeaninglessInput(normalizedTopic)) {
      return false; 
    }

    
    const prompt = `Is the topic "${topic}" related to the industry "${industry}"? Answer only "yes" or "no".`;
    
    await this.delay(300);
    
    const topicWords = normalizedTopic.split(' ');
    const industryWords = normalizedIndustry.split(' ');
    
    const hasOverlap = topicWords.some(topicWord => 
      industryWords.some(industryWord => 
          topicWord.includes(industryWord) || industryWord.includes(topicWord)
        )
      );

    return hasOverlap;
  }

  
  async generateTopicSuggestions(input: string, industry?: string): Promise<string[]> {
    await this.delay(500); 
    const normalizedInput = input.toLowerCase().trim();
    
    if (normalizedInput.length < 2) {
      return [];
    }

    const prompt = industry 
      ? `Generate 8 topic suggestions related to "${input}" in the context of "${industry}" industry. Output only keywords, one per line, no explanations.`
      : `Generate 8 topic suggestions related to "${input}". Output only keywords, one per line, no explanations.`;
      
    await this.delay(800);
    
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
      
      mockSuggestions.push('Innovation', 'Strategy', 'Technology', 'Leadership', 'Analytics', 'Customer Experience', 'Digital Transformation', 'Business Development');
    }
    return mockSuggestions;
  }

  
  async generateTopicSuggestionsFromIndustry(industry: string): Promise<string[]> {
    await this.delay(500); 
    const normalizedIndustry = industry.toLowerCase().trim();
    
    if (normalizedIndustry.length < 2) {
      return [];
    }

    const prompt = `List keywords for topics related to the industry "${industry}". Output only keywords, one per line, no explanations.`;

    await this.delay(800);
    
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
      
      mockSuggestions.push('Innovation', 'Strategy', 'Technology', 'Leadership', 'Analytics', 'Customer Experience', 'Digital Transformation', 'Business Development', 'Process Improvement', 'Quality Management', 'Risk Management', 'Sustainability', 'Automation', 'Data Science', 'Project Management');
    }
    return mockSuggestions;
  }

  
  async generateIndustrySuggestions(input: string): Promise<string[]> {
    await this.delay(500); 
    const normalizedInput = input.toLowerCase().trim();
    
    if (normalizedInput.length < 2) {
      return [];
    }

    const prompt = `Generate 8 industry suggestions related to "${input}". Output only industry names, one per line, no explanations.`;

    await this.delay(800);
    
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
      
      mockSuggestions.push('Technology', 'Healthcare', 'Finance', 'Education', 'Business', 'Marketing', 'Data Analytics', 'Consulting');
    }
    return mockSuggestions;
  }

  
  async generateTopicKeywordsFromIndustry(industry: string): Promise<string[]> {
    return await this.generateTopicSuggestionsFromIndustry(industry);
  }

  
  getIndustryTopicPrompt(industry: string): string {
    return `List keywords for topics related to the industry "${industry}". Output only keywords, one per line, no explanations.`;
  }

  
  async convertSentenceToTopic(sentence: string, industry?: string): Promise<string[]> {
    await this.delay(600); 
    const normalizedSentence = sentence.toLowerCase().trim();
    
    if (normalizedSentence.length < 3) {
      return [];
    }

    const prompt = industry 
      ? `Convert this sentence to 3-5 topic keywords related to the "${industry}" industry: "${sentence}". Output only keywords, one per line, no explanations.`
      : `Convert this sentence to 3-5 topic keywords: "${sentence}". Output only keywords, one per line, no explanations.`;
      
    await this.delay(800);
    
    const mockTopics: string[] = [];
    
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
      
      const words = normalizedSentence.split(' ').filter(word => word.length > 3);
      const keyWords = words.slice(0, 5); 
      mockTopics.push(...keyWords.map(word => word.charAt(0).toUpperCase() + word.slice(1)));
    }
    return mockTopics.slice(0, 8); 
  }

  
  async optimizeTopicForSerpApi(topic: string, industry: string): Promise<string> {
    await this.delay(400); 
    const normalizedTopic = topic.toLowerCase().trim();
    const normalizedIndustry = industry.toLowerCase().trim();
    
    if (normalizedTopic.length < 2) {
      return topic;
    }

    const prompt = `Convert this topic "${topic}" in the "${industry}" industry into a high-search-volume keyword phrase that would return many relevant events and conferences on Google. Focus on trending, popular terms that event organizers use. Output only the optimized keyword phrase, no explanations.`;

    await this.delay(600);
    
    let optimizedTopic = topic;
    
    if (normalizedIndustry.includes('health') || normalizedIndustry.includes('medical') || normalizedIndustry.includes('care')) {
      if (normalizedTopic.includes('innovation') || normalizedTopic.includes('tech')) {
        optimizedTopic = 'healthcare innovation';
      } else if (normalizedTopic.includes('data') || normalizedTopic.includes('analytics')) {
        optimizedTopic = 'healthcare data analytics';
      } else if (normalizedTopic.includes('digital') || normalizedTopic.includes('telemedicine')) {
        optimizedTopic = 'digital health';
      } else if (normalizedTopic.includes('ai') || normalizedTopic.includes('artificial intelligence') || normalizedTopic.includes('machine learning')) {
        optimizedTopic = 'healthcare AI';
      } else if (normalizedTopic.includes('patient') || normalizedTopic.includes('care')) {
        optimizedTopic = 'patient care';
      } else {
        optimizedTopic = 'healthcare technology';
      }
    }
    else if (normalizedIndustry.includes('tech') || normalizedIndustry.includes('software') || normalizedIndustry.includes('it')) {
      if (normalizedTopic.includes('ai') || normalizedTopic.includes('artificial intelligence') || normalizedTopic.includes('machine learning')) {
        optimizedTopic = 'artificial intelligence';
      } else if (normalizedTopic.includes('cloud') || normalizedTopic.includes('computing')) {
        optimizedTopic = 'cloud computing';
      } else if (normalizedTopic.includes('cyber') || normalizedTopic.includes('security')) {
        optimizedTopic = 'cybersecurity';
      } else if (normalizedTopic.includes('data') || normalizedTopic.includes('analytics')) {
        optimizedTopic = 'data analytics';
      } else if (normalizedTopic.includes('blockchain') || normalizedTopic.includes('crypto')) {
        optimizedTopic = 'blockchain cryptocurrency';
      } else {
        optimizedTopic = 'technology';
      }
    }
    else if (normalizedIndustry.includes('finance') || normalizedIndustry.includes('fintech') || normalizedIndustry.includes('banking')) {
      if (normalizedTopic.includes('fintech') || normalizedTopic.includes('digital')) {
        optimizedTopic = 'fintech digital banking';
      } else if (normalizedTopic.includes('crypto') || normalizedTopic.includes('blockchain')) {
        optimizedTopic = 'cryptocurrency blockchain finance';
      } else if (normalizedTopic.includes('investment') || normalizedTopic.includes('trading')) {
        optimizedTopic = 'investment trading finance';
      } else if (normalizedTopic.includes('risk') || normalizedTopic.includes('management')) {
        optimizedTopic = 'risk management finance';
      } else {
        optimizedTopic = 'financial technology innovation';
      }
    }
    else if (normalizedIndustry.includes('education') || normalizedIndustry.includes('learning') || normalizedIndustry.includes('edtech')) {
      if (normalizedTopic.includes('online') || normalizedTopic.includes('digital')) {
        optimizedTopic = 'online learning education technology';
      } else if (normalizedTopic.includes('ai') || normalizedTopic.includes('artificial intelligence')) {
        optimizedTopic = 'artificial intelligence education';
      } else if (normalizedTopic.includes('stem') || normalizedTopic.includes('science')) {
        optimizedTopic = 'STEM education science technology';
      } else {
        optimizedTopic = 'education technology innovation';
      }
    }
    else if (normalizedIndustry.includes('marketing') || normalizedIndustry.includes('advertising') || normalizedIndustry.includes('brand')) {
      if (normalizedTopic.includes('digital') || normalizedTopic.includes('online')) {
        optimizedTopic = 'digital marketing strategy';
      } else if (normalizedTopic.includes('social') || normalizedTopic.includes('media')) {
        optimizedTopic = 'social media marketing';
      } else if (normalizedTopic.includes('content') || normalizedTopic.includes('creation')) {
        optimizedTopic = 'content marketing strategy';
      } else {
        optimizedTopic = 'marketing technology innovation';
      }
    }
    else if (normalizedIndustry.includes('business') || normalizedIndustry.includes('consulting') || normalizedIndustry.includes('corporate')) {
      if (normalizedTopic.includes('leadership') || normalizedTopic.includes('management')) {
        optimizedTopic = 'business leadership management';
      } else if (normalizedTopic.includes('strategy') || normalizedTopic.includes('planning')) {
        optimizedTopic = 'business strategy planning';
      } else if (normalizedTopic.includes('digital') || normalizedTopic.includes('transformation')) {
        optimizedTopic = 'digital transformation business';
      } else {
        optimizedTopic = 'business innovation strategy';
      }
    }
    else if (normalizedIndustry.includes('data') || normalizedIndustry.includes('analytics') || normalizedIndustry.includes('intelligence')) {
      if (normalizedTopic.includes('big data') || normalizedTopic.includes('analytics')) {
        optimizedTopic = 'big data analytics';
      } else if (normalizedTopic.includes('ai') || normalizedTopic.includes('machine learning')) {
        optimizedTopic = 'data science artificial intelligence';
      } else if (normalizedTopic.includes('visualization') || normalizedTopic.includes('reporting')) {
        optimizedTopic = 'data visualization analytics';
      } else {
        optimizedTopic = 'data analytics technology';
      }
    }
    else if (normalizedIndustry.includes('design') || normalizedIndustry.includes('ux') || normalizedIndustry.includes('ui')) {
      if (normalizedTopic.includes('ux') || normalizedTopic.includes('user experience')) {
        optimizedTopic = 'user experience UX design';
      } else if (normalizedTopic.includes('ui') || normalizedTopic.includes('interface')) {
        optimizedTopic = 'user interface UI design';
      } else if (normalizedTopic.includes('product') || normalizedTopic.includes('design')) {
        optimizedTopic = 'product design innovation';
      } else {
        optimizedTopic = 'design thinking innovation';
      }
    }
    else {
      if (normalizedTopic.includes('innovation') || normalizedTopic.includes('technology')) {
        optimizedTopic = 'innovation technology trends';
      } else if (normalizedTopic.includes('digital') || normalizedTopic.includes('transformation')) {
        optimizedTopic = 'digital transformation innovation';
      } else if (normalizedTopic.includes('future') || normalizedTopic.includes('trends')) {
        optimizedTopic = 'future trends innovation';
      } else {
        optimizedTopic = `${topic} innovation technology`;
      }
    }
    return optimizedTopic;
  }

  
  async getIndustryTopicHints(industry: string): Promise<string[]> {
    await this.delay(400); 
    const normalizedIndustry = industry.toLowerCase().trim();
    
    if (normalizedIndustry.length < 2) {
      return [];
    }

    const globalIndustry = getIndustryByName(industry);
    if (globalIndustry) {
      return globalIndustry.topicHints;
    }

    const prompt = `Provide 15-20 popular speaking topics for the "${industry}" industry. Output only topic names, one per line, no explanations.`;

    await this.delay(600);
    
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
      
      mockHints.push('Industry Innovation', 'Digital Transformation', 'Technology Trends', 'Best Practices', 'Future Outlook', 'Strategic Planning', 'Market Analysis', 'Competitive Advantage');
    }
    return mockHints;
  }
}


export const aiSuggestionService = AISuggestionService.getInstance();
