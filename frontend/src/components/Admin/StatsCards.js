import React from 'react';
import { Users, BookOpen, Handshake, TrendingUp } from 'lucide-react';

const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: 'Utilisateurs',
      value: stats?.users?.total || 0,
      icon: Users,
      color: 'blue',
      change: '+12% ce mois',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Compétences',
      value: stats?.skills?.total || 0,
      icon: BookOpen,
      color: 'green',
      change: '+5 nouvelles',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400'
    },
    {
      title: 'Mentorats actifs',
      value: stats?.mentorships?.active || 0,
      icon: Handshake,
      color: 'purple',
      change: `${stats?.mentorships?.total || 0} total`,
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      title: 'Taux engagement',
      value: `${stats?.stats?.engagementRate || 0}%`,
      icon: TrendingUp,
      color: 'amber',
      change: 'Top compétences',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      textColor: 'text-amber-600 dark:text-amber-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                  {card.value}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                  {card.change}
                </p>
              </div>
              <div className={`${card.bgColor} p-3 rounded-lg`}>
                <Icon className={`w-6 h-6 ${card.textColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;