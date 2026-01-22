"use client";

import { Rocket, Sparkles, Globe, Calendar, PartyPopper } from "lucide-react";

const COLORS = [
  // Ollie - Operações existentes
  { name: "Ollie Brasil", color: "#E7002A", code: "Ollie BR" },
  { name: "Ollie México", color: "#FF502C", code: "Ollie MX" },
  { name: "Ollie Colômbia", color: "#C9A0DC", code: "Ollie CO" },
  { name: "Ollie Europa", color: "#87CEEB", code: "Ollie EU" },
  { name: "Ollie Chile", color: "#FFD700", code: "Ollie CL" },
  { name: "Ollie Cross-Border", color: "#808080", code: "Ollie CB" },
  // Ollie - Novas operações 2026
  { name: "Ollie UK", color: "#1E3A8A", code: "Ollie UK" },
  { name: "Ollie Peru", color: "#DC2626", code: "Ollie PE" },
  { name: "Ollie UAE", color: "#059669", code: "Ollie AE" },
  { name: "Ollie India", color: "#F97316", code: "Ollie IN" },
  { name: "Ollie Argentina", color: "#75AADB", code: "Ollie AR" },
  { name: "Ollie USA", color: "#3B82F6", code: "Ollie US" },
  // Marcas existentes
  { name: "Noma Beauty", color: "#F5E6D3", code: "Noma BR" },
  { name: "Joomi Beauty", color: "#FFB6C1", code: "Joomi BR" },
  // Novas marcas 2026
  { name: "Umo (Haircare)", color: "#8B5CF6", code: "Umo" },
  { name: "Minibar (Body)", color: "#EC4899", code: "Minibar" },
  { name: "Stelle (Oral)", color: "#14B8A6", code: "Stelle" },
  { name: "Younsoo (K-beauty)", color: "#F472B6", code: "Younsoo" },
  { name: "Babycare", color: "#A3E635", code: "Babycare" },
  { name: "Scientific Skincare", color: "#6366F1", code: "Scientific" },
  // Global
  { name: "Todos os mercados", color: "#6B7280", code: "Todos" },
];

export function Legend() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
      <h2 className="text-xl font-heading font-bold text-gray-900 mb-6">
        Operações
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {COLORS.map((item) => (
          <div key={item.code} className="flex items-center gap-3">
            <div
              className="w-6 h-6 rounded-md border-2 border-gray-300"
              style={{ backgroundColor: item.color }}
            />
            <div>
              <div className="text-sm font-medium text-gray-900">
                {item.name}
              </div>
              <div className="text-xs text-gray-500">{item.code}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Tipos de Evento
        </h3>
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
              <Rocket className="w-3 h-3 text-blue-600" />
            </div>
            <span className="text-sm text-gray-600">Lançamento Produto</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-purple-600" />
            </div>
            <span className="text-sm text-gray-600">Lançamento Marca</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
              <Globe className="w-3 h-3 text-green-600" />
            </div>
            <span className="text-sm text-gray-600">Lançamento Operação</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-100 rounded flex items-center justify-center">
              <Calendar className="w-3 h-3 text-orange-600" />
            </div>
            <span className="text-sm text-gray-600">Data Comercial</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-pink-100 rounded flex items-center justify-center">
              <PartyPopper className="w-3 h-3 text-pink-600" />
            </div>
            <span className="text-sm text-gray-600">Campanha</span>
          </div>
        </div>

        <h3 className="text-sm font-semibold text-gray-700 mb-3">Status</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">⏳</span>
            <span className="text-sm text-gray-600">Planejado</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">🔨</span>
            <span className="text-sm text-gray-600">Em Produção</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">✅</span>
            <span className="text-sm text-gray-600">Concluído</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">⚠️</span>
            <span className="text-sm text-gray-600">Atrasado</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">❌</span>
            <span className="text-sm text-gray-600">Cancelado</span>
          </div>
        </div>
      </div>
    </div>
  );
}
