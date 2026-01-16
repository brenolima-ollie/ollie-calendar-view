"use client";

import { TrendingUp, Activity, AlertCircle, CheckCircle } from "lucide-react";

interface StatsCardsProps {
  stats: {
    total: number;
    live: number;
    emDev: number;
    criticos: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      label: "Total",
      value: stats.total,
      icon: TrendingUp,
      color: "bg-blue-50 text-blue-600",
      borderColor: "border-blue-200",
    },
    {
      label: "Live",
      value: stats.live,
      icon: CheckCircle,
      color: "bg-green-50 text-green-600",
      borderColor: "border-green-200",
    },
    {
      label: "Em Desenvolvimento",
      value: stats.emDev,
      icon: Activity,
      color: "bg-yellow-50 text-yellow-600",
      borderColor: "border-yellow-200",
    },
    {
      label: "Críticos",
      value: stats.criticos,
      icon: AlertCircle,
      color: "bg-red-50 text-red-600",
      borderColor: "border-red-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`bg-white rounded-xl border-2 ${card.borderColor} p-6 hover:shadow-lg transition-shadow`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.label}</p>
                <p className="text-3xl font-heading font-bold text-gray-900 mt-1">
                  {card.value}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-lg ${card.color} flex items-center justify-center`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
