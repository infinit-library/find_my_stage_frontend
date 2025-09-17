import { useState, useCallback } from 'react';
import { generateTopicsFromIndustry, IndustryTopicResult } from '@/lib/industry-topic-filter';

interface UseIndustryTopicsReturn {
  topics: string[];
  loading: boolean;
  error: string | null;
  generateTopics: (industry: string) => Promise<void>;
  clearTopics: () => void;
  lastResult: IndustryTopicResult | null;
}

/**
 * React hook for generating topic keywords from industry
 * 
 * @example
 * ```tsx
 * const { topics, loading, generateTopics } = useIndustryTopics();
 * 
 * const handleIndustrySelect = async (industry: string) => {
 *   await generateTopics(industry);
 * };
 * 
 * return (
 *   <div>
 *     {loading && <div>Generating topics...</div>}
 *     {topics.map(topic => (
 *       <div key={topic}>{topic}</div>
 *     ))}
 *   </div>
 * );
 * ```
 */
export function useIndustryTopics(): UseIndustryTopicsReturn {
  const [topics, setTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<IndustryTopicResult | null>(null);

  const generateTopics = useCallback(async (industry: string) => {
    if (!industry || industry.trim().length < 2) {
      setError('Industry name must be at least 2 characters long');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await generateTopicsFromIndustry(industry);
      setTopics(result.topics);
      setLastResult(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate topics';
      setError(errorMessage);
      setTopics([]);
      setLastResult(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearTopics = useCallback(() => {
    setTopics([]);
    setError(null);
    setLastResult(null);
  }, []);

  return {
    topics,
    loading,
    error,
    generateTopics,
    clearTopics,
    lastResult
  };
}
