"use client";

import { Rocket, PartyPopper, Globe, Sparkles, Calendar } from "lucide-react";
import type { CalendarEvent } from "@/app/page";

interface EventsListProps {
  events: CalendarEvent[];
}

const COLORS: Record<string, string> = {
  // Ollie - Operações existentes
  "Ollie BR": "#E7002A",
  "Ollie MX": "#FF502C",
  "Ollie CO": "#C9A0DC",
  "Ollie EU": "#87CEEB",
  "Ollie CL": "#FFD700",
  "Ollie CB": "#808080",
  // Ollie - Novas operações 2026
  "Ollie UK": "#1E3A8A",
  "Ollie PE": "#DC2626",
  "Ollie AE": "#059669",
  "Ollie IN": "#F97316",
  "Ollie AR": "#75AADB",
  "Ollie US": "#3B82F6",
  // Marcas existentes
  "Noma BR": "#F5E6D3",
  "Joomi BR": "#FFB6C1",
  // Novas marcas 2026
  Umo: "#8B5CF6",
  Minibar: "#EC4899",
  Stelle: "#14B8A6",
  Younsoo: "#F472B6",
  Babycare: "#A3E635",
  Scientific: "#6366F1",
  // Global
  Todos: "#6B7280",
  // Backward compatibility (old format)
  BR: "#E7002A",
  MX: "#FF502C",
  CO: "#C9A0DC",
  EU: "#87CEEB",
  CL: "#FFD700",
  Noma: "#F5E6D3",
  Joomi: "#FFB6C1",
  Global: "#808080",
};

const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export function EventsList({ events }: EventsListProps) {
  // Group events by month
  const eventsByMonth: Record<number, CalendarEvent[]> = {};
  events.forEach((event) => {
    const date = new Date(event.Data);
    const month = date.getMonth() + 1;
    if (!eventsByMonth[month]) {
      eventsByMonth[month] = [];
    }
    eventsByMonth[month].push(event);
  });

  // Sort events within each month by date
  Object.keys(eventsByMonth).forEach((month) => {
    eventsByMonth[Number(month)].sort(
      (a, b) => new Date(a.Data).getTime() - new Date(b.Data).getTime(),
    );
  });

  return (
    <div className="space-y-8">
      {Object.entries(eventsByMonth).map(([month, monthEvents]) => {
        const monthNum = Number(month);
        return (
          <div key={month} className="space-y-4">
            <h3 className="text-lg font-heading font-bold text-gray-900 flex items-center gap-2">
              <span className="w-8 h-8 bg-ollie-red text-white rounded-lg flex items-center justify-center text-sm font-bold">
                {monthNum}
              </span>
              {MONTHS[monthNum - 1]}
              <span className="text-sm font-normal text-gray-500">
                ({monthEvents.length}{" "}
                {monthEvents.length === 1 ? "evento" : "eventos"})
              </span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {monthEvents.map((event) => {
                const date = new Date(event.Data);
                const isCritical =
                  event.Status.includes("🔴") || event.Status.includes("⚠️");

                return (
                  <div
                    key={event.ID}
                    id={`event-${event.ID}`}
                    className={`p-4 rounded-xl border-2 ${
                      isCritical
                        ? "bg-red-50 border-red-200"
                        : "bg-gray-50 border-gray-200"
                    } hover:shadow-lg transition-all scroll-mt-4`}
                    style={{
                      borderLeftWidth: "6px",
                      borderLeftColor: COLORS[event.Operação] || "#6B7280",
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {event.Tipo === "Lançamento Produto" && (
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Rocket className="w-4 h-4 text-blue-600" />
                          </div>
                        )}
                        {event.Tipo === "Lançamento Marca" && (
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-purple-600" />
                          </div>
                        )}
                        {event.Tipo === "Lançamento Operação" && (
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <Globe className="w-4 h-4 text-green-600" />
                          </div>
                        )}
                        {event.Tipo === "Data Comercial" && (
                          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-orange-600" />
                          </div>
                        )}
                        {event.Tipo === "Campanha" && (
                          <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                            <PartyPopper className="w-4 h-4 text-pink-600" />
                          </div>
                        )}
                        <span
                          className="text-sm font-bold text-white px-3 py-1.5 rounded-lg shadow-sm"
                          style={{
                            backgroundColor:
                              COLORS[event.Operação] || "#6B7280",
                          }}
                        >
                          {event.Operação}
                        </span>
                      </div>
                      <span className="text-lg">
                        {event.Status.split(" ")[0]}
                      </span>
                    </div>

                    <h4 className="font-heading font-bold text-gray-900 mb-2">
                      {event.Nome}
                    </h4>

                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Data:</span>
                        <span>
                          {date.toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      {event.Esforço && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Relevância:</span>
                          <span className="flex items-center gap-1">
                            {event.Esforço}{" "}
                            <span className="text-gray-400">
                              {event.Esforço === "P" && "●"}
                              {event.Esforço === "M" && "●●"}
                              {event.Esforço === "G" && "●●●"}
                            </span>
                          </span>
                        </div>
                      )}
                      {event.Notas && (
                        <div className="mt-2 p-2 bg-white rounded text-xs">
                          {event.Notas}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
