"use client";

import { useState, useMemo } from "react";
import { Calendar, Rocket, PartyPopper } from "lucide-react";
import calendarData from "./data.json";
import { CalendarGrid } from "@/components/CalendarGrid";
import { StatsCards } from "@/components/StatsCards";
import { EventsList } from "@/components/EventsList";
import { Legend } from "@/components/Legend";

export interface CalendarEvent {
  ID: string;
  Data: string;
  Nome: string;
  Geografia: string;
  Tipo: string;
  Esforço: string;
  Status: string;
  Notas: string;
}

export default function Home() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const events = calendarData as CalendarEvent[];

  const stats = useMemo(() => {
    const total = events.length;
    // Novos status: ⏳ Planejado, 🔨 Em Produção, ✅ Concluído, ⚠️ Atrasado, ❌ Cancelado
    // Mantém compatibilidade com status antigos: 🟢 Live, 🟡 Em Dev, 🔴 Crítico
    const live = events.filter(
      (e) => e.Status.includes("✅") || e.Status.includes("🟢"),
    ).length;
    const emDev = events.filter(
      (e) =>
        e.Status.includes("🔨") ||
        e.Status.includes("🟡") ||
        e.Status.includes("⏳"),
    ).length;
    const criticos = events.filter(
      (e) => e.Status.includes("⚠️") || e.Status.includes("🔴"),
    ).length;

    return { total, live, emDev, criticos };
  }, [events]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-ollie-red rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold text-gray-900">
                Calendar View 2026
              </h1>
              <p className="text-sm text-gray-500">
                Gerenciamento de lançamentos e campanhas
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Stats */}
        <StatsCards stats={stats} />

        {/* Calendar Grid */}
        <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
          <CalendarGrid
            events={events}
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
          />
        </div>

        {/* Events List */}
        <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
          <h2 className="text-xl font-heading font-bold text-gray-900 mb-6">
            Detalhamento por Mês
          </h2>
          <EventsList events={events} />
        </div>

        {/* Legend */}
        <Legend />
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            Ollie Growth & Tech Team • 2026
          </p>
        </div>
      </footer>
    </main>
  );
}
