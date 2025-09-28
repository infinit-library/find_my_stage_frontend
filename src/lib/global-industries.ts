export interface IndustryConfig {
  name: string;
  keywords: string[];
  topicHints: string[];
  description: string;
}

export const GLOBAL_INDUSTRIES: IndustryConfig[] = [
  {
    name: "Technology",
    keywords: ["tech", "software", "digital", "it", "computer", "programming", "development", "engineering"],
    topicHints: [
      "Artificial Intelligence & Machine Learning",
      "Cloud Computing & Infrastructure", 
      "Cybersecurity & Data Protection",
      "Digital Transformation & Innovation",
      "Software Development & Engineering",
      "Data Science & Analytics",
      "DevOps & Automation",
      "Mobile App Development",
      "Web Development & Frontend",
      "Backend Development & APIs",
      "Database Management & Design",
      "Network Security & Infrastructure",
      "IoT & Connected Devices",
      "Blockchain & Distributed Systems",
      "User Experience (UX) Design",
      "Product Management & Strategy",
      "Agile & Scrum Methodologies",
      "Quality Assurance & Testing",
      "System Architecture & Design",
      "Emerging Technologies & Trends"
    ],
    description: "Software, hardware, and digital innovation"
  },
  {
    name: "Finance",
    keywords: ["finance", "banking", "fintech", "investment", "money", "financial", "bank", "insurance", "cryptocurrency", "blockchain", "trading", "portfolio", "wealth", "payment", "lending", "credit", "compliance", "risk"],
    topicHints: [
      "Fintech Innovation & Digital Banking",
      "Cryptocurrency & Blockchain Technology",
      "Investment Strategies & Portfolio Management",
      "Risk Management & Regulatory Compliance",
      "Financial Planning & Wealth Management",
      "Sustainable Finance & ESG Investing",
      "Payment Systems & Digital Wallets",
      "Alternative Lending & Credit Solutions",
      "Financial Data Analytics & AI",
      "InsurTech & Digital Insurance",
      "Trading Algorithms & Quantitative Finance",
      "Financial Inclusion & Accessibility",
      "Open Banking & API Integration",
      "Fraud Detection & Cybersecurity",
      "Corporate Finance & M&A",
      "Real Estate Finance & Investment",
      "International Finance & Forex",
      "Financial Modeling & Valuation",
      "Retail Banking & Customer Experience",
      "Central Bank Digital Currencies (CBDC)"
    ],
    description: "Banking, investment, and financial services"
  },
  {
    name: "Healthcare",
    keywords: ["health", "medical", "healthcare", "care", "wellness", "medicine", "hospital", "clinical", "pharmaceutical", "biotech"],
    topicHints: [
      "Digital Health & Telemedicine",
      "Healthcare Data Analytics",
      "Medical Device Innovation",
      "Healthcare Policy & Regulation",
      "Mental Health Technology",
      "Preventive Care & Wellness",
      "Electronic Health Records (EHR)",
      "Healthcare AI & Machine Learning",
      "Patient Care Technology",
      "Healthcare Cybersecurity",
      "Medical Imaging & Diagnostics",
      "Pharmaceutical Innovation",
      "Healthcare Operations & Management",
      "Population Health Management",
      "Healthcare Interoperability",
      "Clinical Decision Support Systems",
      "Healthcare Quality & Safety",
      "Healthcare Finance & Economics",
      "Healthcare Workforce Development",
      "Healthcare Innovation & Research"
    ],
    description: "Medical, pharmaceutical, and health services"
  },
  {
    name: "Education",
    keywords: ["education", "school", "learning", "training", "teaching", "academic", "university", "college", "edtech", "student"],
    topicHints: [
      "EdTech Solutions & Digital Learning",
      "Online Learning Platforms & MOOCs",
      "Student Engagement & Experience",
      "Educational Data Analytics",
      "Digital Literacy & Skills",
      "STEM Education & Innovation",
      "Learning Management Systems",
      "Educational Assessment & Testing",
      "Personalized Learning & AI",
      "Virtual & Augmented Reality in Education",
      "Educational Content Creation",
      "Teacher Training & Development",
      "Educational Policy & Reform",
      "Special Education & Inclusion",
      "Higher Education & Research",
      "Corporate Training & Development",
      "Educational Technology Integration",
      "Learning Analytics & Insights",
      "Educational Accessibility & Equity",
      "Future of Education & Skills"
    ],
    description: "Educational institutions and learning services"
  },
  {
    name: "Business",
    keywords: ["business", "corporate", "enterprise", "consulting", "management", "strategy", "operations", "leadership"],
    topicHints: [
      "Business Strategy & Planning",
      "Leadership Development & Management",
      "Change Management & Transformation",
      "Organizational Culture & Behavior",
      "Business Process Optimization",
      "Customer Experience & Service",
      "Digital Transformation",
      "Business Analytics & Intelligence",
      "Project Management & Delivery",
      "Supply Chain & Operations",
      "Human Resources & Talent Management",
      "Marketing & Brand Strategy",
      "Sales & Revenue Growth",
      "Innovation & Entrepreneurship",
      "Corporate Governance & Ethics",
      "Business Development & Partnerships",
      "Performance Management & KPIs",
      "Risk Management & Compliance",
      "Business Model Innovation",
      "Global Business & International Trade"
    ],
    description: "Corporate services and business consulting"
  },
  {
    name: "Marketing",
    keywords: ["marketing", "advertising", "promotion", "brand", "social", "content", "digital", "growth", "customer"],
    topicHints: [
      "Digital Marketing & Strategy",
      "Content Marketing & Creation",
      "Social Media Marketing & Management",
      "Brand Strategy & Development",
      "Marketing Analytics & Measurement",
      "Customer Experience & Journey",
      "Email Marketing & Automation",
      "Search Engine Optimization (SEO)",
      "Pay-Per-Click (PPC) Advertising",
      "Influencer Marketing & Partnerships",
      "Marketing Technology & Tools",
      "Marketing Automation & CRM",
      "Growth Hacking & Acquisition",
      "Marketing Research & Insights",
      "Creative & Design Strategy",
      "Public Relations & Communications",
      "Event Marketing & Experiences",
      "Mobile Marketing & Apps",
      "Marketing Attribution & ROI",
      "Future of Marketing & Trends"
    ],
    description: "Marketing, advertising, and brand management"
  },
  {
    name: "Data & Analytics",
    keywords: ["data", "analytics", "intelligence", "research", "statistics", "insights", "metrics", "reporting"],
    topicHints: [
      "Data Science & Machine Learning",
      "Business Intelligence & Analytics",
      "Data Visualization & Storytelling",
      "Big Data & Data Engineering",
      "Statistical Analysis & Modeling",
      "Predictive Analytics & Forecasting",
      "Data Mining & Discovery",
      "Data Governance & Quality",
      "Data Architecture & Design",
      "Real-time Analytics & Streaming",
      "Data Privacy & Security",
      "Data Strategy & Management",
      "Advanced Analytics & AI",
      "Data-driven Decision Making",
      "Customer Analytics & Segmentation",
      "Marketing Analytics & Attribution",
      "Financial Analytics & Risk",
      "Operational Analytics & Optimization",
      "Data Ethics & Responsible AI",
      "Future of Data & Analytics"
    ],
    description: "Data science, analytics, and business intelligence"
  },
  {
    name: "Design",
    keywords: ["design", "ux", "ui", "user", "experience", "interface", "visual", "creative", "product"],
    topicHints: [
      "User Experience (UX) Design",
      "User Interface (UI) Design",
      "Product Design & Strategy",
      "Design Thinking & Process",
      "Visual Design & Branding",
      "Interaction Design & Prototyping",
      "Design Systems & Standards",
      "User Research & Testing",
      "Information Architecture",
      "Accessibility & Inclusive Design",
      "Mobile & Responsive Design",
      "Service Design & Experience",
      "Design Leadership & Management",
      "Creative Direction & Strategy",
      "Design Tools & Technologies",
      "Design Operations & Workflow",
      "Design Ethics & Responsibility",
      "Design Innovation & Trends",
      "Cross-platform Design",
      "Future of Design & Technology"
    ],
    description: "User experience, interface, and product design"
  }
];

export const getIndustryByName = (name: string): IndustryConfig | undefined => {
  return GLOBAL_INDUSTRIES.find(industry => 
    industry.name.toLowerCase() === name.toLowerCase()
  );
};

export const getIndustryByKeyword = (keyword: string): IndustryConfig | undefined => {
  const normalizedKeyword = keyword.toLowerCase();
  return GLOBAL_INDUSTRIES.find(industry => 
    industry.keywords.some(k => k.toLowerCase().includes(normalizedKeyword) || normalizedKeyword.includes(k.toLowerCase()))
  );
};

export const getAllIndustryNames = (): string[] => {
  return GLOBAL_INDUSTRIES.map(industry => industry.name);
};

export const getAllIndustryKeywords = (): string[] => {
  return GLOBAL_INDUSTRIES.flatMap(industry => industry.keywords);
};

export const getTopicHintsForIndustry = (industryName: string): string[] => {
  const industry = getIndustryByName(industryName);
  return industry ? industry.topicHints : [];
};

export const DEFAULT_INDUSTRY_OPTIONS = [
  "Technology",
  "Finance", 
  "Healthcare",
  "Education",
  "Business",
  "Marketing",
  "Data & Analytics",
  "Design",
  "Manufacturing",
  "Retail",
  "Hospitality",
  "Transportation",
  "Energy",
  "Government",
  "Nonprofit",
  "Media",
  "Entertainment",
  "Real Estate",
  "Professional Services",
  "Agriculture",
  "Telecommunications",
  "Pharmaceuticals",
  "Automotive",
  "Consumer Goods",
  "Aerospace",
  "Construction",
  "Logistics",
  "Insurance",
  "Service Organizations"
];
