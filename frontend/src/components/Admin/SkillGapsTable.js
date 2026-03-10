import React from 'react';
import { AlertCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const SkillGapsChart = ({ skillGaps }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'stable': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'surplus': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'critical': return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'high': return <TrendingUp className="w-4 h-4 text-orange-600" />;
      case 'stable': return <Minus className="w-4 h-4 text-green-600" />;
      case 'surplus': return <TrendingDown className="w-4 h-4 text-blue-600" />;
      default: return null;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <h3 className="font-semibold text-slate-900 dark:text-white">
          Gaps de compétences
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Offre vs Demande
        </p>
      </div>

      <div className="p-4">
        {/* Légende */}
        <div className="flex flex-wrap gap-4 mb-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Critique</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span>Élevé</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Stable</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Surplus</span>
          </div>
        </div>

        {/* Liste des gaps */}
        <div className="space-y-4">
          {skillGaps?.map((skill, index) => {
            const maxBar = Math.max(skill.demand, skill.supply, 50);
            const demandPercent = (skill.demand / maxBar) * 100;
            const supplyPercent = (skill.supply / maxBar) * 100;
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{skill.skill}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${getStatusColor(skill.status)}`}>
                      {getStatusIcon(skill.status)}
                      {skill.status === 'critical' && 'Critique'}
                      {skill.status === 'high' && 'Élevé'}
                      {skill.status === 'stable' && 'Stable'}
                      {skill.status === 'surplus' && 'Surplus'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Gap: {skill.gap}
                  </div>
                </div>
                
                {/* Barres de progression */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-16 text-slate-600">Demande</span>
                    <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${demandPercent}%` }}
                      ></div>
                    </div>
                    <span className="w-12 text-right">{skill.demand}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-16 text-slate-600">Offre</span>
                    <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${supplyPercent}%` }}
                      ></div>
                    </div>
                    <span className="w-12 text-right">{skill.supply}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SkillGapsChart;