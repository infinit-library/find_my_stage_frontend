


export interface TicketmasterSearchParams {
  keyword: string;
  classificationId?: string;
  classificationName?: string;
  segmentId?: string;
  segmentName?: string;
  genreId?: string;
  genreName?: string;
  subGenreId?: string;
  subGenreName?: string;
}


export const TICKETMASTER_CLASSIFICATIONS = {
  
  'Arts & Theatre': {
    id: 'KZFzniwnSyZfZ7v7nJ',
    name: 'Arts & Theatre',
    segments: {
      'Theatre': { id: 'KZFzniwnSyZfZ7v7na', name: 'Theatre' },
      'Museums': { id: 'KZFzniwnSyZfZ7v7n1', name: 'Museums' },
      'Visual Arts': { id: 'KZFzniwnSyZfZ7v7nE', name: 'Visual Arts' }
    }
  },
  
  
  'Sports': {
    id: 'KZFzniwnSyZfZ7v7nE',
    name: 'Sports',
    segments: {
      'Baseball': { id: 'KZFzniwnSyZfZ7v7nE', name: 'Baseball' },
      'Basketball': { id: 'KZFzniwnSyZfZ7v7nE', name: 'Basketball' },
      'Football': { id: 'KZFzniwnSyZfZ7v7nE', name: 'Football' },
      'Hockey': { id: 'KZFzniwnSyZfZ7v7nE', name: 'Hockey' },
      'Soccer': { id: 'KZFzniwnSyZfZ7v7nE', name: 'Soccer' }
    }
  },
  
  
  'Music': {
    id: 'KZFzniwnSyZfZ7v7nJ',
    name: 'Music',
    segments: {
      'Rock': { id: 'KZFzniwnSyZfZ7v7nJ', name: 'Rock' },
      'Pop': { id: 'KZFzniwnSyZfZ7v7nJ', name: 'Pop' },
      'Jazz': { id: 'KZFzniwnSyZfZ7v7nJ', name: 'Jazz' },
      'Classical': { id: 'KZFzniwnSyZfZ7v7nJ', name: 'Classical' },
      'Country': { id: 'KZFzniwnSyZfZ7v7nJ', name: 'Country' }
    }
  },
  
  
  'Miscellaneous': {
    id: 'KZFzniwnSyZfZ7v7n1',
    name: 'Miscellaneous',
    segments: {
      'Comedy': { id: 'KZFzniwnSyZfZ7v7n1', name: 'Comedy' },
      'Family': { id: 'KZFzniwnSyZfZ7v7n1', name: 'Family' },
      'Other': { id: 'KZFzniwnSyZfZ7v7n1', name: 'Other' }
    }
  }
};


export const INDUSTRY_TO_TICKETMASTER: Record<string, TicketmasterSearchParams> = {
  
  'Technology': {
    keyword: 'technology conference',
    classificationId: 'KZFzniwnSyZfZ7v7n1', 
    classificationName: 'Miscellaneous',
    segmentId: 'KZFzniwnSyZfZ7v7n1',
    segmentName: 'Other'
  },
  
  
  'Finance': {
    keyword: 'finance conference',
    classificationId: 'KZFzniwnSyZfZ7v7n1',
    classificationName: 'Miscellaneous',
    segmentId: 'KZFzniwnSyZfZ7v7n1',
    segmentName: 'Other'
  },
  
  
  'Healthcare': {
    keyword: 'healthcare conference',
    classificationId: 'KZFzniwnSyZfZ7v7n1',
    classificationName: 'Miscellaneous',
    segmentId: 'KZFzniwnSyZfZ7v7n1',
    segmentName: 'Other'
  },
  
  
  'Education': {
    keyword: 'education conference',
    classificationId: 'KZFzniwnSyZfZ7v7n1',
    classificationName: 'Miscellaneous',
    segmentId: 'KZFzniwnSyZfZ7v7n1',
    segmentName: 'Other'
  },
  
  
  'Business': {
    keyword: 'business conference',
    classificationId: 'KZFzniwnSyZfZ7v7n1',
    classificationName: 'Miscellaneous',
    segmentId: 'KZFzniwnSyZfZ7v7n1',
    segmentName: 'Other'
  },
  
  
  'Marketing': {
    keyword: 'marketing conference',
    classificationId: 'KZFzniwnSyZfZ7v7n1',
    classificationName: 'Miscellaneous',
    segmentId: 'KZFzniwnSyZfZ7v7n1',
    segmentName: 'Other'
  },
  
  
  'Data & Analytics': {
    keyword: 'data analytics conference',
    classificationId: 'KZFzniwnSyZfZ7v7n1',
    classificationName: 'Miscellaneous',
    segmentId: 'KZFzniwnSyZfZ7v7n1',
    segmentName: 'Other'
  },
  
  
  'Design': {
    keyword: 'design conference',
    classificationId: 'KZFzniwnSyZfZ7v7n1',
    classificationName: 'Miscellaneous',
    segmentId: 'KZFzniwnSyZfZ7v7n1',
    segmentName: 'Other'
  }
};


export const TOPIC_TO_KEYWORDS: Record<string, string[]> = {
  
  'Artificial Intelligence & Machine Learning': ['AI conference', 'machine learning summit', 'artificial intelligence event'],
  'Cloud Computing & Infrastructure': ['cloud computing conference', 'infrastructure summit', 'cloud technology event'],
  'Cybersecurity & Data Protection': ['cybersecurity conference', 'data protection summit', 'security event'],
  'Digital Transformation & Innovation': ['digital transformation conference', 'innovation summit', 'digital event'],
  'Software Development & Engineering': ['software development conference', 'engineering summit', 'programming event'],
  'Data Science & Analytics': ['data science conference', 'analytics summit', 'big data event'],
  'DevOps & Automation': ['devops conference', 'automation summit', 'devops event'],
  'Mobile App Development': ['mobile development conference', 'app development summit', 'mobile event'],
  'Web Development & Frontend': ['web development conference', 'frontend summit', 'web technology event'],
  'Backend Development & APIs': ['backend development conference', 'API summit', 'backend event'],
  'Database Management & Design': ['database conference', 'data management summit', 'database event'],
  'Network Security & Infrastructure': ['network security conference', 'infrastructure summit', 'networking event'],
  'IoT & Connected Devices': ['IoT conference', 'connected devices summit', 'internet of things event'],
  'Blockchain & Distributed Systems': ['blockchain conference', 'distributed systems summit', 'cryptocurrency event'],
  'User Experience (UX) Design': ['UX design conference', 'user experience summit', 'UX event'],
  'Product Management & Strategy': ['product management conference', 'strategy summit', 'product event'],
  'Agile & Scrum Methodologies': ['agile conference', 'scrum summit', 'agile methodology event'],
  'Quality Assurance & Testing': ['QA conference', 'testing summit', 'quality assurance event'],
  'System Architecture & Design': ['architecture conference', 'system design summit', 'architecture event'],
  'Emerging Technologies & Trends': ['emerging technology conference', 'tech trends summit', 'innovation event'],

  
  'Fintech Innovation & Digital Banking': ['fintech conference', 'digital banking summit', 'financial technology event'],
  'Cryptocurrency & Blockchain Technology': ['cryptocurrency conference', 'blockchain summit', 'crypto event'],
  'Investment Strategies & Portfolio Management': ['investment conference', 'portfolio management summit', 'investment event'],
  'Risk Management & Regulatory Compliance': ['risk management conference', 'compliance summit', 'regulatory event'],
  'Financial Planning & Wealth Management': ['financial planning conference', 'wealth management summit', 'financial planning event'],
  'Sustainable Finance & ESG Investing': ['sustainable finance conference', 'ESG investing summit', 'sustainable finance event'],
  'Payment Systems & Digital Wallets': ['payment systems conference', 'digital wallets summit', 'payment technology event'],
  'Alternative Lending & Credit Solutions': ['alternative lending conference', 'credit solutions summit', 'lending event'],
  'Financial Data Analytics & AI': ['financial analytics conference', 'AI in finance summit', 'financial data event'],
  'InsurTech & Digital Insurance': ['insurtech conference', 'digital insurance summit', 'insurance technology event'],
  'Trading Algorithms & Quantitative Finance': ['trading algorithms conference', 'quantitative finance summit', 'algorithmic trading event'],
  'Financial Inclusion & Accessibility': ['financial inclusion conference', 'accessibility summit', 'financial inclusion event'],
  'Open Banking & API Integration': ['open banking conference', 'API integration summit', 'open banking event'],
  'Fraud Detection & Cybersecurity': ['fraud detection conference', 'financial cybersecurity summit', 'fraud prevention event'],
  'Corporate Finance & M&A': ['corporate finance conference', 'M&A summit', 'corporate finance event'],
  'Real Estate Finance & Investment': ['real estate finance conference', 'property investment summit', 'real estate finance event'],
  'International Finance & Forex': ['international finance conference', 'forex summit', 'foreign exchange event'],
  'Financial Modeling & Valuation': ['financial modeling conference', 'valuation summit', 'financial modeling event'],
  'Retail Banking & Customer Experience': ['retail banking conference', 'customer experience summit', 'banking event'],
  'Central Bank Digital Currencies (CBDC)': ['CBDC conference', 'digital currencies summit', 'central bank digital currency event'],

  
  'Digital Health & Telemedicine': ['digital health conference', 'telemedicine summit', 'health technology event'],
  'Healthcare Data Analytics': ['healthcare analytics conference', 'health data summit', 'healthcare data event'],
  'Medical Device Innovation': ['medical device conference', 'healthcare innovation summit', 'medical technology event'],
  'Healthcare Policy & Regulation': ['healthcare policy conference', 'health regulation summit', 'healthcare policy event'],
  'Mental Health Technology': ['mental health conference', 'mental health technology summit', 'mental health event'],
  'Preventive Care & Wellness': ['preventive care conference', 'wellness summit', 'healthcare wellness event'],
  'Electronic Health Records (EHR)': ['EHR conference', 'health records summit', 'electronic health records event'],
  'Healthcare AI & Machine Learning': ['healthcare AI conference', 'AI in healthcare summit', 'healthcare AI event'],
  'Patient Care Technology': ['patient care conference', 'care technology summit', 'patient care event'],
  'Healthcare Cybersecurity': ['healthcare cybersecurity conference', 'health security summit', 'healthcare security event'],
  'Medical Imaging & Diagnostics': ['medical imaging conference', 'diagnostics summit', 'medical imaging event'],
  'Pharmaceutical Innovation': ['pharmaceutical conference', 'drug innovation summit', 'pharmaceutical event'],
  'Healthcare Operations & Management': ['healthcare operations conference', 'healthcare management summit', 'healthcare operations event'],
  'Population Health Management': ['population health conference', 'public health summit', 'population health event'],
  'Healthcare Interoperability': ['healthcare interoperability conference', 'health data exchange summit', 'healthcare interoperability event'],
  'Clinical Decision Support Systems': ['clinical decision support conference', 'healthcare decision systems summit', 'clinical decision event'],
  'Healthcare Quality & Safety': ['healthcare quality conference', 'patient safety summit', 'healthcare quality event'],
  'Healthcare Finance & Economics': ['healthcare finance conference', 'health economics summit', 'healthcare finance event'],
  'Healthcare Workforce Development': ['healthcare workforce conference', 'healthcare training summit', 'healthcare workforce event'],
  'Healthcare Innovation & Research': ['healthcare innovation conference', 'medical research summit', 'healthcare research event'],

  
  'EdTech Solutions & Digital Learning': ['edtech conference', 'digital learning summit', 'education technology event'],
  'Online Learning Platforms & MOOCs': ['online learning conference', 'MOOC summit', 'e-learning event'],
  'Student Engagement & Experience': ['student engagement conference', 'education experience summit', 'student experience event'],
  'Educational Data Analytics': ['educational analytics conference', 'education data summit', 'educational data event'],
  'Digital Literacy & Skills': ['digital literacy conference', 'digital skills summit', 'digital literacy event'],
  'STEM Education & Innovation': ['STEM education conference', 'STEM innovation summit', 'STEM education event'],
  'Learning Management Systems': ['LMS conference', 'learning systems summit', 'learning management event'],
  'Educational Assessment & Testing': ['educational assessment conference', 'testing summit', 'education assessment event'],
  'Personalized Learning & AI': ['personalized learning conference', 'AI in education summit', 'personalized education event'],
  'Virtual & Augmented Reality in Education': ['VR in education conference', 'AR education summit', 'virtual reality education event'],
  'Educational Content Creation': ['educational content conference', 'content creation summit', 'education content event'],
  'Teacher Training & Development': ['teacher training conference', 'educator development summit', 'teacher development event'],
  'Educational Policy & Reform': ['educational policy conference', 'education reform summit', 'education policy event'],
  'Special Education & Inclusion': ['special education conference', 'inclusive education summit', 'special needs education event'],
  'Higher Education & Research': ['higher education conference', 'university research summit', 'higher education event'],
  'Corporate Training & Development': ['corporate training conference', 'workplace learning summit', 'corporate education event'],
  'Educational Technology Integration': ['edtech integration conference', 'technology in education summit', 'education technology event'],
  'Learning Analytics & Insights': ['learning analytics conference', 'education insights summit', 'learning data event'],
  'Educational Accessibility & Equity': ['educational accessibility conference', 'education equity summit', 'accessible education event'],
  'Future of Education & Skills': ['future of education conference', 'education trends summit', 'education future event'],

  
  'Business Strategy & Planning': ['business strategy conference', 'strategic planning summit', 'business strategy event'],
  'Leadership Development & Management': ['leadership conference', 'management development summit', 'leadership event'],
  'Change Management & Transformation': ['change management conference', 'transformation summit', 'change management event'],
  'Organizational Culture & Behavior': ['organizational culture conference', 'workplace culture summit', 'organizational behavior event'],
  'Business Process Optimization': ['business process conference', 'process optimization summit', 'business optimization event'],
  'Customer Experience & Service': ['customer experience conference', 'customer service summit', 'CX event'],
  'Digital Transformation': ['digital transformation conference', 'digital business summit', 'digital transformation event'],
  'Business Analytics & Intelligence': ['business analytics conference', 'business intelligence summit', 'business analytics event'],
  'Project Management & Delivery': ['project management conference', 'project delivery summit', 'project management event'],
  'Supply Chain & Operations': ['supply chain conference', 'operations management summit', 'supply chain event'],
  'Human Resources & Talent Management': ['HR conference', 'talent management summit', 'human resources event'],
  'Marketing & Brand Strategy': ['marketing conference', 'brand strategy summit', 'marketing strategy event'],
  'Sales & Revenue Growth': ['sales conference', 'revenue growth summit', 'sales growth event'],
  'Innovation & Entrepreneurship': ['innovation conference', 'entrepreneurship summit', 'startup event'],
  'Corporate Governance & Ethics': ['corporate governance conference', 'business ethics summit', 'governance event'],
  'Business Development & Partnerships': ['business development conference', 'partnerships summit', 'business development event'],
  'Performance Management & KPIs': ['performance management conference', 'KPI summit', 'performance metrics event'],
  'Risk Management & Compliance': ['business risk conference', 'compliance summit', 'business risk event'],
  'Business Model Innovation': ['business model conference', 'business innovation summit', 'business model event'],
  'Global Business & International Trade': ['global business conference', 'international trade summit', 'global business event'],

  
  'Digital Marketing & Strategy': ['digital marketing conference', 'marketing strategy summit', 'digital marketing event'],
  'Content Marketing & Creation': ['content marketing conference', 'content creation summit', 'content marketing event'],
  'Social Media Marketing & Management': ['social media conference', 'social media marketing summit', 'social media event'],
  'Brand Strategy & Development': ['brand strategy conference', 'brand development summit', 'branding event'],
  'Marketing Analytics & Measurement': ['marketing analytics conference', 'marketing measurement summit', 'marketing analytics event'],
  'Customer Experience & Journey': ['customer experience conference', 'customer journey summit', 'CX marketing event'],
  'Email Marketing & Automation': ['email marketing conference', 'marketing automation summit', 'email marketing event'],
  'Search Engine Optimization (SEO)': ['SEO conference', 'search optimization summit', 'SEO event'],
  'Pay-Per-Click (PPC) Advertising': ['PPC conference', 'paid advertising summit', 'PPC event'],
  'Influencer Marketing & Partnerships': ['influencer marketing conference', 'influencer partnerships summit', 'influencer event'],
  'Marketing Technology & Tools': ['martech conference', 'marketing technology summit', 'marketing tools event'],
  'Marketing Automation & CRM': ['marketing automation conference', 'CRM summit', 'marketing automation event'],
  'Growth Hacking & Acquisition': ['growth hacking conference', 'customer acquisition summit', 'growth marketing event'],
  'Marketing Research & Insights': ['marketing research conference', 'market insights summit', 'marketing research event'],
  'Creative & Design Strategy': ['creative strategy conference', 'design strategy summit', 'creative marketing event'],
  'Public Relations & Communications': ['PR conference', 'communications summit', 'public relations event'],
  'Event Marketing & Experiences': ['event marketing conference', 'experiential marketing summit', 'event marketing event'],
  'Mobile Marketing & Apps': ['mobile marketing conference', 'app marketing summit', 'mobile marketing event'],
  'Marketing Attribution & ROI': ['marketing attribution conference', 'marketing ROI summit', 'marketing measurement event'],
  'Future of Marketing & Trends': ['future of marketing conference', 'marketing trends summit', 'marketing future event'],

  
  'Data Science & Machine Learning': ['data science conference', 'machine learning summit', 'data science event'],
  'Business Intelligence & Analytics': ['business intelligence conference', 'analytics summit', 'BI event'],
  'Data Visualization & Storytelling': ['data visualization conference', 'data storytelling summit', 'data viz event'],
  'Big Data & Data Engineering': ['big data conference', 'data engineering summit', 'big data event'],
  'Statistical Analysis & Modeling': ['statistical analysis conference', 'data modeling summit', 'statistics event'],
  'Predictive Analytics & Forecasting': ['predictive analytics conference', 'forecasting summit', 'predictive analytics event'],
  'Data Mining & Discovery': ['data mining conference', 'data discovery summit', 'data mining event'],
  'Data Governance & Quality': ['data governance conference', 'data quality summit', 'data governance event'],
  'Data Architecture & Design': ['data architecture conference', 'data design summit', 'data architecture event'],
  'Real-time Analytics & Streaming': ['real-time analytics conference', 'streaming analytics summit', 'real-time data event'],
  'Data Privacy & Security': ['data privacy conference', 'data security summit', 'data privacy event'],
  'Data Strategy & Management': ['data strategy conference', 'data management summit', 'data strategy event'],
  'Advanced Analytics & AI': ['advanced analytics conference', 'AI analytics summit', 'advanced analytics event'],
  'Data-driven Decision Making': ['data-driven conference', 'decision making summit', 'data-driven event'],
  'Customer Analytics & Segmentation': ['customer analytics conference', 'customer segmentation summit', 'customer analytics event'],
  'Marketing Analytics & Attribution': ['marketing analytics conference', 'attribution summit', 'marketing analytics event'],
  'Financial Analytics & Risk': ['financial analytics conference', 'risk analytics summit', 'financial analytics event'],
  'Operational Analytics & Optimization': ['operational analytics conference', 'operations optimization summit', 'operational analytics event'],
  'Data Ethics & Responsible AI': ['data ethics conference', 'responsible AI summit', 'data ethics event'],
  'Future of Data & Analytics': ['future of data conference', 'analytics trends summit', 'data future event'],

  
  'User Interface (UI) Design': ['UI design conference', 'interface design summit', 'UI event'],
  'Product Design & Strategy': ['product design conference', 'product strategy summit', 'product design event'],
  'Design Thinking & Process': ['design thinking conference', 'design process summit', 'design thinking event'],
  'Visual Design & Branding': ['visual design conference', 'branding summit', 'visual design event'],
  'Interaction Design & Prototyping': ['interaction design conference', 'prototyping summit', 'interaction design event'],
  'Design Systems & Standards': ['design systems conference', 'design standards summit', 'design systems event'],
  'User Research & Testing': ['user research conference', 'usability testing summit', 'user research event'],
  'Information Architecture': ['information architecture conference', 'IA summit', 'information architecture event'],
  'Accessibility & Inclusive Design': ['accessibility conference', 'inclusive design summit', 'accessible design event'],
  'Mobile & Responsive Design': ['mobile design conference', 'responsive design summit', 'mobile design event'],
  'Service Design & Experience': ['service design conference', 'service experience summit', 'service design event'],
  'Design Leadership & Management': ['design leadership conference', 'design management summit', 'design leadership event'],
  'Creative Direction & Strategy': ['creative direction conference', 'creative strategy summit', 'creative direction event'],
  'Design Tools & Technologies': ['design tools conference', 'design technology summit', 'design tools event'],
  'Design Operations & Workflow': ['design operations conference', 'design workflow summit', 'design ops event'],
  'Design Ethics & Responsibility': ['design ethics conference', 'responsible design summit', 'design ethics event'],
  'Design Innovation & Trends': ['design innovation conference', 'design trends summit', 'design innovation event'],
  'Cross-platform Design': ['cross-platform design conference', 'multi-platform summit', 'cross-platform event'],
  'Future of Design & Technology': ['future of design conference', 'design technology summit', 'design future event']
};


function generateOptimizedKeywords(industry: string, topic: string): string[] {
  
  const keywords: string[] = [];
  
  
  const coreTerms = topic.toLowerCase()
    .replace(/[&]/g, 'and')
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(term => term.length > 2);
  
  
  
  
  
  keywords.push('conference');
  keywords.push('summit');
  keywords.push('event');
  keywords.push('meeting');
  keywords.push('convention');
  keywords.push('workshop');
  keywords.push('seminar');
  
  
  const industryLower = industry.toLowerCase();
  keywords.push(`${industryLower} conference`);
  keywords.push(`${industryLower} summit`);
  keywords.push(`${industryLower} event`);
  keywords.push(`${industryLower} meeting`);
  
  
  const topicLower = topic.toLowerCase();
  keywords.push(`${topicLower} conference`);
  keywords.push(`${topicLower} summit`);
  keywords.push(`${topicLower} event`);
  
  
  keywords.push(`${industryLower} ${topicLower} conference`);
  keywords.push(`${topicLower} ${industryLower} conference`);
  keywords.push(`${industryLower} ${topicLower} summit`);
  keywords.push(`${topicLower} ${industryLower} event`);
  
  
  if (industry.toLowerCase() === 'marketing') {
    if (topic.toLowerCase().includes('customer experience') || topic.toLowerCase().includes('customer journey')) {
      keywords.push('customer experience conference');
      keywords.push('customer experience event');
      keywords.push('customer experience summit');
      keywords.push('customer journey conference');
      keywords.push('marketing customer experience');
      keywords.push('customer experience marketing');
      keywords.push('marketing conference');
      keywords.push('customer service conference');
    } else if (topic.toLowerCase().includes('analytics') || topic.toLowerCase().includes('measurement')) {
      keywords.push('marketing analytics conference');
      keywords.push('marketing analytics summit');
      keywords.push('marketing data conference');
      keywords.push('marketing measurement conference');
      keywords.push('marketing conference');
      keywords.push('analytics conference');
      keywords.push('marketing event');
    } else if (topic.toLowerCase().includes('content')) {
      keywords.push('content marketing conference');
      keywords.push('content marketing summit');
      keywords.push('content creation conference');
      keywords.push('content marketing event');
      keywords.push('marketing conference');
      keywords.push('digital marketing conference');
      keywords.push('marketing event');
    } else {
      keywords.push('marketing conference');
      keywords.push('marketing summit');
      keywords.push('marketing event');
      keywords.push('digital marketing conference');
    }
  } else if (industry.toLowerCase() === 'technology') {
    if (topic.toLowerCase().includes('artificial intelligence') || topic.toLowerCase().includes('ai')) {
      keywords.push('artificial intelligence conference');
      keywords.push('AI conference');
      keywords.push('technology conference');
      keywords.push('machine learning conference');
      keywords.push('tech conference');
      keywords.push('innovation conference');
    } else if (topic.toLowerCase().includes('cloud')) {
      keywords.push('cloud computing conference');
      keywords.push('cloud conference');
      keywords.push('technology conference');
      keywords.push('tech conference');
      keywords.push('cloud event');
    } else {
      keywords.push('technology conference');
      keywords.push('tech conference');
      keywords.push('innovation conference');
      keywords.push('technology event');
    }
  } else if (industry.toLowerCase() === 'finance') {
    if (topic.toLowerCase().includes('fintech')) {
      keywords.push('fintech conference');
      keywords.push('financial technology conference');
      keywords.push('finance conference');
      keywords.push('fintech event');
      keywords.push('banking conference');
    } else if (topic.toLowerCase().includes('cryptocurrency') || topic.toLowerCase().includes('crypto')) {
      keywords.push('cryptocurrency conference');
      keywords.push('crypto conference');
      keywords.push('blockchain conference');
      keywords.push('finance conference');
      keywords.push('crypto event');
    } else {
      keywords.push('finance conference');
      keywords.push('financial conference');
      keywords.push('banking conference');
      keywords.push('finance event');
    }
  } else if (industry.toLowerCase() === 'healthcare') {
    
    keywords.push('conference');
    keywords.push('summit');
    keywords.push('event');
    keywords.push('meeting');
    keywords.push('convention');
    keywords.push('healthcare conference');
    keywords.push('medical conference');
    keywords.push('health conference');
    keywords.push('healthcare event');
    keywords.push('medical event');
  } else if (industry.toLowerCase() === 'education') {
    
    if (topic.toLowerCase().includes('student engagement') || topic.toLowerCase().includes('student experience')) {
      
      keywords.push('conference');
      keywords.push('summit');
      keywords.push('event');
      keywords.push('meeting');
      keywords.push('convention');
      keywords.push('workshop');
      keywords.push('seminar');
      
      keywords.push('education conference');
      keywords.push('educational conference');
      keywords.push('student engagement conference');
      keywords.push('student experience conference');
      keywords.push('education student engagement');
      keywords.push('student engagement summit');
      keywords.push('education event');
      keywords.push('student engagement event');
      keywords.push('educational conference');
      keywords.push('student experience event');
    } else if (topic.toLowerCase().includes('learning') || topic.toLowerCase().includes('teaching')) {
      keywords.push('conference');
      keywords.push('summit');
      keywords.push('event');
      keywords.push('meeting');
      keywords.push('convention');
      keywords.push('workshop');
      keywords.push('seminar');
      keywords.push('learning conference');
      keywords.push('teaching conference');
      keywords.push('education learning conference');
      keywords.push('educational technology conference');
      keywords.push('education conference');
      keywords.push('learning summit');
    } else if (topic.toLowerCase().includes('technology') || topic.toLowerCase().includes('edtech')) {
      keywords.push('conference');
      keywords.push('summit');
      keywords.push('event');
      keywords.push('meeting');
      keywords.push('convention');
      keywords.push('workshop');
      keywords.push('seminar');
      keywords.push('edtech conference');
      keywords.push('education technology conference');
      keywords.push('educational technology summit');
      keywords.push('edtech event');
      keywords.push('education conference');
      keywords.push('technology in education');
    } else {
      keywords.push('conference');
      keywords.push('summit');
      keywords.push('event');
      keywords.push('meeting');
      keywords.push('convention');
      keywords.push('workshop');
      keywords.push('seminar');
      keywords.push('education conference');
      keywords.push('educational conference');
      keywords.push('learning conference');
      keywords.push('education event');
      keywords.push('edtech conference');
    }
  } else if (industry.toLowerCase() === 'business') {
    keywords.push('business conference');
    keywords.push('corporate conference');
    keywords.push('business event');
    keywords.push('leadership conference');
    keywords.push('management conference');
  } else {
    
    keywords.push(`${industry.toLowerCase()} conference`);
    keywords.push('business conference');
    keywords.push('professional conference');
    keywords.push('industry conference');
  }
  
  
  return [...new Set(keywords)];
}

/**
 * Convert industry and topic to Ticketmaster search parameters with AI optimization
 * @param industry - Selected industry
 * @param topic - Selected topic
 * @returns TicketmasterSearchParams object
 */
export function convertToTicketmasterParams(industry: string, topic: string): TicketmasterSearchParams {
  
  const optimizedKeywords = generateOptimizedKeywords(industry, topic);
  
  
  const primaryKeyword = optimizedKeywords[0];

  
  
  
  return {
    keyword: primaryKeyword,
    
    classificationId: undefined,
    classificationName: undefined,
    segmentId: undefined,
    segmentName: undefined
  };
}

/**
 * Get alternative keywords for a topic (for fallback searches)
 * @param topic - Selected topic
 * @returns Array of alternative keywords
 */
export function getAlternativeKeywords(topic: string): string[] {
  return TOPIC_TO_KEYWORDS[topic] || [`${topic.toLowerCase()} conference`];
}

/**
 * Generate multiple search strategies for better results with AI optimization
 * @param industry - Selected industry
 * @param topic - Selected topic
 * @returns Array of search parameter objects
 */
export function generateSearchStrategies(industry: string, topic: string): TicketmasterSearchParams[] {
  const strategies: TicketmasterSearchParams[] = [];
  
  
  const optimizedKeywords = generateOptimizedKeywords(industry, topic);
  
  
  
  
  
  optimizedKeywords.slice(0, 5).forEach(keyword => {
    strategies.push({
      keyword,
      classificationId: undefined,
      classificationName: undefined,
      segmentId: undefined,
      segmentName: undefined
    });
  });
  
  return strategies;
}
