import { Link } from '../lib/supabase';
import { BarChart3, TrendingUp, MousePointerClick } from 'lucide-react';

interface AnalyticsProps {
  links: Link[];
}

export default function Analytics({ links }: AnalyticsProps) {
  const totalClicks = links.reduce((sum, link) => sum + link.click_count, 0);
  const activeLinks = links.filter(link => link.is_active).length;
  const avgClicksPerLink = links.length > 0 ? (totalClicks / links.length).toFixed(1) : '0';

  const sortedLinks = [...links].sort((a, b) => b.click_count - a.click_count);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <MousePointerClick className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-sm font-medium text-blue-900">Total Clicks</h3>
          </div>
          <p className="text-3xl font-bold text-blue-900">{totalClicks}</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-600 rounded-lg">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-sm font-medium text-green-900">Active Links</h3>
          </div>
          <p className="text-3xl font-bold text-green-900">{activeLinks}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-600 rounded-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-sm font-medium text-purple-900">Avg Per Link</h3>
          </div>
          <p className="text-3xl font-bold text-purple-900">{avgClicksPerLink}</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Link Performance</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {sortedLinks.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              No links to analyze yet. Add some links to see performance data.
            </div>
          ) : (
            sortedLinks.map((link, index) => {
              const percentage = totalClicks > 0 ? (link.click_count / totalClicks) * 100 : 0;
              return (
                <div key={link.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                      <div>
                        <h4 className="font-medium text-gray-900">{link.title}</h4>
                        <p className="text-sm text-gray-500 truncate max-w-xs">{link.url}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{link.click_count}</p>
                      <p className="text-xs text-gray-500">{percentage.toFixed(1)}%</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
