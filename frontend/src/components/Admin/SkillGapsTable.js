import React, { useState } from 'react';
import { AlertCircle, TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp, Filter } from 'lucide-react';

const SkillGapsChart = ({ skillGaps = [], onSkillClick }) => {
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return {
        bg: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-800 dark:text-red-400',
        bar: 'bg-red-500',
        icon: <AlertCircle className="w-4 h-4 text-red-600" />
      };
      case 'high': return {
        bg: 'bg-orange-100 dark:bg-orange-900/30',
        text: 'text-orange-800 dark:text-orange-400',
        bar: 'bg-orange-500',
        icon: <TrendingUp className="w-4 h-4 text-orange-600" />
      };
      case 'stable': return {
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-800 dark:text-green-400',
        bar: 'bg-green-500',
        icon: <Minus className="w-4 h-4 text-green-600" />
      };
      case 'surplus': return {
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        text: 'text-blue-800 dark:text-blue-400',
        bar: 'bg-blue-500',
        icon: <TrendingDown className="w-4 h-4 text-blue-600" />
      };
      default: return {
        bg: 'bg-slate-100 dark:bg-slate-800',
        text: 'text-slate-800 dark:text-slate-400',
        bar: 'bg-slate-500',
        icon: null
      };
    }
  };

  const filteredGaps = skillGaps.filter(gap => {
    if (filter === 'all') return true;
    return gap.status === filter;
  });

  const displayedGaps = expanded ? filteredGaps : filteredGaps.slice(0, 5);

  const statusCounts = {
    critical: skillGaps.filter(g => g.status === 'critical').length,
    high: skillGaps.filter(g => g.status === 'high').length,
    stable: skillGaps.filter(g => g.status === 'stable').length,
    surplus: skillGaps.filter(g => g.status === 'surplus').length
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Gaps de compétences
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Offre vs Demande
            </p>
          </div>
          
          {/* Filtres */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-xs rounded-full transition-colors flex items-center gap-1 ${
                filter === 'all' 
                  ? 'bg-slate-900 text-white dark:bg-slate-700' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
              }`}
            >
              <Filter className="w-3 h-3" />
              Tous ({skillGaps.length})
            </button>
            <button
              onClick={() => setFilter('critical')}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                filter === 'critical'
                  ? 'bg-red-600 text-white'
                  : 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400'
              }`}
            >
              Critique ({statusCounts.critical})
            </button>
            <button
              onClick={() => setFilter('high')}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                filter === 'high'
                  ? 'bg-orange-600 text-white'
                  : 'bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400'
              }`}
            >
              Élevé ({statusCounts.high})
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Liste des gaps */}
        <div className="space-y-4">
          {displayedGaps.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              Aucune donnée disponible
            </div>
          ) : (
            displayedGaps.map((skill, index) => {
              const status = getStatusColor(skill.status);
              const maxBar = Math.max(skill.demand, skill.supply, 50);
              const demandPercent = (skill.demand / maxBar) * 100;
              const supplyPercent = (skill.supply / maxBar) * 100;
              
              return (
                <button
                  key={index}
                  onClick={() => onSkillClick?.(skill)}
                  className="w-full text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 p-2 rounded-lg transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{skill.skill}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${status.bg} ${status.text}`}>
                        {status.icon}
                        {skill.status === 'critical' && 'Critique'}
                        {skill.status === 'high' && 'Élevé'}
                        {skill.status === 'stable' && 'Stable'}
                        {skill.status === 'surplus' && 'Surplus'}
                      </span>
                    </div>
                    <div className="text-xs font-medium">
                      Gap: <span className={skill.gap > 0 ? 'text-red-600' : 'text-green-600'}>
                        {skill.gap > 0 ? '+' : ''}{skill.gap}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-16 text-slate-600">Demande</span>
                      <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full transition-all"
                          style={{ width: `${demandPercent}%` }}
                        />
                      </div>
                      <span className="w-12 text-right font-medium">{skill.demand}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-16 text-slate-600">Offre</span>
                      <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${status.bar} rounded-full transition-all`}
                          style={{ width: `${supplyPercent}%` }}
                        />
                      </div>
                      <span className="w-12 text-right font-medium">{skill.supply}</span>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Bouton Voir plus/moins */}
        {filteredGaps.length > 5 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full mt-4 py-2 text-sm text-primary hover:text-primary/80 flex items-center justify-center gap-1 border-t border-slate-200 dark:border-slate-700 pt-4"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Voir moins
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Voir plus ({filteredGaps.length - 5} autres)
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default SkillGapsChart;