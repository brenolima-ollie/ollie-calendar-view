"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Rocket, PartyPopper } from "lucide-react";
import type { CalendarEvent } from "@/app/page";

interface CalendarGridProps {
  events: CalendarEvent[];
  selectedMonth: number;
  onMonthChange: (month: number) => void;
}

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const COLORS: Record<string, string> = {
  "Ollie BR": "#E7002A",
  "Ollie MX": "#FF502C",
  "Ollie CO": "#C9A0DC",
  "Ollie EU": "#87CEEB",
  "Ollie CL": "#FFD700",
  "Noma BR": "#F5E6D3",
  "Joomi BR": "#FFB6C1",
  "Ollie CB": "#808080",
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

export function CalendarGrid({ events, selectedMonth, onMonthChange }: CalendarGridProps) {
  const year = 2026;

  // Get days in month
  const daysInMonth = new Date(year, selectedMonth, 0).getDate();
  const firstDayOfMonth = new Date(year, selectedMonth - 1, 1).getDay();

  // Create calendar grid
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  // Group events by date
  const eventsByDate: Record<string, CalendarEvent[]> = {};
  events.forEach((event) => {
    const date = new Date(event.Data);
    if (date.getMonth() + 1 === selectedMonth) {
      const day = date.getDate();
      if (!eventsByDate[day]) {
        eventsByDate[day] = [];
      }
      eventsByDate[day].push(event);
    }
  });

  const handlePrevMonth = () => {
    if (selectedMonth > 1) {
      onMonthChange(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth < 12) {
      onMonthChange(selectedMonth + 1);
    }
  };

  return (
    <div>
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handlePrevMonth}
          disabled={selectedMonth === 1}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>

        <h2 className="text-2xl font-heading font-bold text-gray-900">
          {MONTHS[selectedMonth - 1]} {year}
        </h2>

        <button
          onClick={handleNextMonth}
          disabled={selectedMonth === 12}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* Month Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {MONTHS.map((month, index) => (
          <button
            key={month}
            onClick={() => onMonthChange(index + 1)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              selectedMonth === index + 1
                ? "bg-ollie-red text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {month.slice(0, 3)}
          </button>
        ))}
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-gray-500 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day, index) => {
          const dayEvents = day ? eventsByDate[day] : null;
          const hasCritical = dayEvents?.some(e => e.Status.includes("🔴"));

          return (
            <div
              key={index}
              className={`min-h-[100px] p-2 rounded-lg border-2 ${
                day
                  ? hasCritical
                    ? "bg-red-50 border-red-200"
                    : "bg-white border-gray-200 hover:border-gray-300"
                  : "bg-transparent border-transparent"
              } transition-colors`}
            >
              {day && (
                <>
                  <div className="text-sm font-semibold text-gray-700 mb-2">
                    {day}
                  </div>
                  <div className="space-y-1">
                    {dayEvents?.slice(0, 3).map((event) => (
                      <div
                        key={event.ID}
                        className="text-xs p-1.5 rounded border-l-4 bg-white hover:shadow-md transition-shadow cursor-pointer"
                        style={{ borderLeftColor: COLORS[event.Geografia] }}
                        title={`${event.Nome} - ${event.Geografia}`}
                        onClick={() => {
                          const element = document.getElementById(`event-${event.ID}`);
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            // Highlight effect
                            element.classList.add('ring-4', 'ring-ollie-red', 'ring-opacity-50');
                            setTimeout(() => {
                              element.classList.remove('ring-4', 'ring-ollie-red', 'ring-opacity-50');
                            }, 2000);
                          }
                        }}
                      >
                        <div className="flex items-center gap-1">
                          {event.Tipo === "Lançamento" ? (
                            <Rocket className="w-3 h-3 flex-shrink-0" />
                          ) : (
                            <PartyPopper className="w-3 h-3 flex-shrink-0" />
                          )}
                          <span className="truncate font-medium">
                            {event.Geografia}
                          </span>
                        </div>
                      </div>
                    ))}
                    {dayEvents && dayEvents.length > 3 && (
                      <div className="text-xs text-gray-500 font-medium px-1.5">
                        +{dayEvents.length - 3} mais
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
