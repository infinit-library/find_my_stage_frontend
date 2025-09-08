export const TOP_TOPICS: string[] = [
    "Marketing",
    "Leadership",
    "AI",
    "Sales",
    "Customer Success",
    "Cybersecurity",
    "Data Science",
    "Product Management",
    "Engineering",
    "DEI",
    "Entrepreneurship",
    "Innovation",
    "Digital Transformation",
    "Design",
    "HR",
    "Finance",
    "Operations",
    "Supply Chain",
    "Healthcare",
    "Education",
    "Sustainability",
    "Legal",
    "Real Estate",
    "Nonprofit",
    "Public Speaking",
];

export const TOP_INDUSTRIES: string[] = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
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
    "Service Organizations",
];

export function mapToTopOrOther(value: string, whitelist: string[]): string {
    if (!value) return "Other";
    const normalized = value.trim().toLowerCase();
    const found = whitelist.find((w) => w.trim().toLowerCase() === normalized);
    return found ?? "Other";
}

