import React from 'react';
import { Users, BookOpen, Handshake, TrendingUp } from 'lucide-react';

const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: 'Utilisateurs',
      value: stats?.stats?.users?.total || 0,
      change: `+${stats?.stats?.users?.growth || 0}% ce mois`,
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Compétences',
      value: stats?.stats?.skills?.total || 0,
      change: `${stats?.stats?.skills?.topSkills?.length || 0} compétences populaires`,
      icon: BookOpen,
      color: 'green'
    },
    {
      title: 'Mentorats actifs',
      value: stats?.stats?.mentorships?.active || 0,
      change: `${stats?.stats?.mentorships?.total || 0} au total`,
      icon: Handshake,
      color: 'purple'
    },
    {
      title: "Taux d'engagement",
      value: `${stats?.stats?.mentorships?.engagementRate || 0}%`,
      change: 'des utilisateurs actifs',
      icon: TrendingUp,
      color: 'amber'
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
  };

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
              <div className={`${colorClasses[card.color]} p-3 rounded-lg`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;