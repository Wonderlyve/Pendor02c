import React from 'react';
import { X, Calendar, Clock, Star, Trophy, TrendingUp } from 'lucide-react';

interface BetProps {
  isOpen: boolean;
  onClose: () => void;
  prediction: {
    id: string;
    content: string;
    date: string;
    time: string;
    odds: number;
    confidence: number;
    matches?: Array<{
      team1: string;
      team2: string;
      betType: string;
      prediction: string;
    }>;
    user: {
      username: string;
      avatar_url: string;
    };
    stats?: {
      totalPredictions: number;
      successRate: number;
      avgOdds: number;
    };
  };
}

export default function Bet({ isOpen, onClose, prediction }: BetProps) {
  if (!isOpen) return null;

  // Parse matches from content if they're not provided directly
  const parseMatches = (content: string) => {
    const lines = content.split('\n');
    const matches = [];
    
    for (const line of lines) {
      const matchRegex = /(.+) vs (.+) - (.+): (.+)/;
      const match = line.match(matchRegex);
      if (match) {
        matches.push({
          team1: match[1].trim(),
          team2: match[2].trim(),
          betType: match[3].trim(),
          prediction: match[4].trim()
        });
      }
    }
    
    return matches;
  };

  const matches = prediction.matches || parseMatches(prediction.content);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 text-center">
        <div className="fixed inset-0" onClick={onClose}></div>
        
        {/* Modal */}
        <div className="inline-block w-full max-w-4xl my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          {/* Header */}
          <div className="border-b px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <img 
                  src={prediction.user.avatar_url}
                  alt={prediction.user.username}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-xl font-bold">{prediction.user.username}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {prediction.date}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {prediction.time}
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Tipster Stats */}
            {prediction.stats && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex items-center text-blue-600">
                    <Trophy className="h-5 w-5 mr-2" />
                    <span className="text-sm font-medium">Total Pronostics</span>
                  </div>
                  <p className="text-xl font-bold text-blue-700 mt-1">
                    {prediction.stats.totalPredictions}
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="flex items-center text-green-600">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    <span className="text-sm font-medium">Taux de réussite</span>
                  </div>
                  <p className="text-xl font-bold text-green-700 mt-1">
                    {prediction.stats.successRate}%
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <div className="flex items-center text-purple-600">
                    <Star className="h-5 w-5 mr-2" />
                    <span className="text-sm font-medium">Cote moyenne</span>
                  </div>
                  <p className="text-xl font-bold text-purple-700 mt-1">
                    {prediction.stats.avgOdds}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-4">Détails des paris</h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Match
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type de pari
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pronostic
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {matches.map((match, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-medium">{match.team1}</span>
                          <span className="text-gray-500"> vs </span>
                          <span className="font-medium">{match.team2}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {match.betType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {match.prediction}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-semibold mb-2">Analyse</h4>
              <p className="text-gray-700 whitespace-pre-line">{prediction.content}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t px-6 py-4 bg-gray-50 rounded-b-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm text-gray-600">Côte totale</p>
                  <p className="text-xl font-bold text-green-600">{prediction.odds}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Confiance</p>
                  <p className="text-xl font-bold text-blue-600">{prediction.confidence}%</p>
                </div>
              </div>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Parier maintenant
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}