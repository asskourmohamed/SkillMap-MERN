import React from 'react';
import { Users, BookOpen, Handshake, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';

const StatsCards = ({ stats, onCardClick }) => {
  const cards = [
    {
      id: 'users',
      title: 'Utilisateurs',
      value: stats?.users?.total || 0,
      subValue: `${stats?.users?.new || 0} nouveaux`,
      change: stats?.users?.growth || 0,
      icon: Users,
      color: 'blue',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400',
      onClick: () => onCardClick?.('users')
    },
    {
      id: 'skills',
      title: 'Compétences',
      value: stats?.skills?.total || 0,
      subValue: `${stats?.skills?.topSkills?.length || 0} catégories`,
      icon: BookOpen,
      color: 'green',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400',
      onClick: () => onCardClick?.('skills')
    },
    {
      id: 'mentorships',
      title: 'Mentorats actifs',
      value: stats?.mentorships?.active || 0,
      subValue: `${stats?.mentorships?.pending || 0} en attente`,
      icon: Handshake,
      color: 'purple',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400',
      onClick: () => onCardClick?.('mentorships')
    },
    {
      id: 'engagement',
      title: "Taux d'engagement",
      value: `${stats?.mentorships?.engagementRate || 0}%`,
      subValue: `${stats?.mentorships?.total || 0} mentorats total`,
      icon: TrendingUp,
      color: 'amber',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      textColor: 'text-amber-600 dark:text-amber-400',
      onClick: () => onCardClick?.('engagement')
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const isPositive = card.change >= 0;
        
        return (
          <button
            key={index}
            onClick={card.onClick}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md transition-all hover:scale-105 text-left w-full cursor-pointer group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {card.title}
                </p>
                <div className="flex items-baseline gap-2 mt-2">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {card.value}
                  </p>
                  {card.change !== undefined && (
                    <span className={`text-xs font-medium flex items-center ${
                      isPositive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                      {Math.abs(card.change)}%
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                  {card.subValue}
                </p>
              </div>
              <div className={`${card.bgColor} p-3 rounded-lg transition-colors group-hover:scale-110`}>
                <Icon className={`w-6 h-6 ${card.textColor}`} />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default StatsCards;