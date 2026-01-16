"use client";

const COLORS = [
  { name: "Ollie Brasil", color: "#E7002A", code: "BR" },
  { name: "Ollie México", color: "#FF502C", code: "MX" },
  { name: "Ollie Colômbia", color: "#C9A0DC", code: "CO" },
  { name: "Ollie Europa", color: "#87CEEB", code: "EU" },
  { name: "Ollie Chile", color: "#FFD700", code: "CL" },
  { name: "Noma Beauty", color: "#F5E6D3", code: "Noma" },
  { name: "Joomi Beauty", color: "#FFB6C1", code: "Joomi" },
  { name: "Global", color: "#808080", code: "Global" },
];

export function Legend() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
      <h2 className="text-xl font-heading font-bold text-gray-900 mb-6">
        Legenda de Cores
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {COLORS.map((item) => (
          <div key={item.code} className="flex items-center gap-3">
            <div
              className="w-6 h-6 rounded-md border-2 border-gray-300"
              style={{ backgroundColor: item.color }}
            />
            <div>
              <div className="text-sm font-medium text-gray-900">{item.name}</div>
              <div className="text-xs text-gray-500">{item.code}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Status</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">🟢</span>
            <span className="text-sm text-gray-600">Live</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">🟡</span>
            <span className="text-sm text-gray-600">Em Desenvolvimento</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">⏳</span>
            <span className="text-sm text-gray-600">Backlog</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">🔴</span>
            <span className="text-sm text-gray-600">Crítico</span>
          </div>
        </div>
      </div>
    </div>
  );
}
