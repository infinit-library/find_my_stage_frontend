import React from 'react';
import { Calendar, Search, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

interface EmptyResultsProps {
  industry?: string;
  topic?: string;
}

const EmptyResults: React.FC<EmptyResultsProps> = ({ industry, topic }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-6 text-center">
        {/* Empty State Icon */}
        <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <Calendar className="w-12 h-12 text-gray-400" />
        </div>

        {/* Empty State Message */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">
          No Events Found
        </h1>
        
        <p className="text-gray-600 mb-2">
          We couldn't find any events matching your search criteria.
        </p>

        {industry && topic && (
          <p className="text-sm text-gray-500 mb-8">
            Searched for <span className="font-medium">{industry}</span> events related to{' '}
            <span className="font-medium">{topic}</span>
          </p>
        )}

        {/* Suggestions */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
          <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Search className="w-4 h-4" />
            Try these suggestions:
          </h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Use broader industry or topic terms</li>
            <li>• Check your spelling</li>
            <li>• Try different keyword combinations</li>
            <li>• Search for related topics in the same industry</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => navigate('/search')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Search
          </Button>
          
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmptyResults;
