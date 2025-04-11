"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay,
  isAfter,
  isBefore,
  isEqual,
  Locale
} from "date-fns";
import { it } from "date-fns/locale";

import { cn } from "@/lib/utils";

export interface CalendarProps {
  mode?: "single" | "range";
  selected?: Date | undefined | { from: Date | undefined; to: Date | undefined };
  onSelect?: (date: Date | undefined | { from: Date | undefined; to: Date | undefined }) => void;
  className?: string;
  disabled?: (date: Date) => boolean;
  locale?: Locale;
  initialFocus?: boolean;
}

export function Calendar({
  mode = "single",
  selected,
  onSelect,
  className,
  disabled,
  locale = it,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  
  // Ottieni i nomi dei giorni della settimana in italiano
  const weekDays = ["lun", "mar", "mer", "gio", "ven", "sab", "dom"];
  
  // Calcola i giorni da visualizzare
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Aggiungi giorni del mese precedente per iniziare dalla lunedì
  let startDay = monthStart.getDay(); // 0 = domenica, 1 = lunedì, ...
  startDay = startDay === 0 ? 6 : startDay - 1; // Converti in 0 = lunedì, ..., 6 = domenica
  
  // Crea l'array di date complete per visualizzare il calendario
  const calendarDays = [];
  
  // Aggiungi giorni del mese precedente
  const prevMonthDays = eachDayOfInterval({
    start: subMonths(monthStart, 1),
    end: subMonths(monthStart, 1)
  }).slice(-startDay);
  
  calendarDays.push(...prevMonthDays);
  
  // Aggiungi giorni del mese corrente
  calendarDays.push(...monthDays);
  
  // Funzioni di navigazione
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  
  // Organizza i giorni in settimane
  //@ts-ignore
  const weeks = [];
  //@ts-ignore
  let days = [];
  
  calendarDays.forEach((day, i) => {
    if (i % 7 === 0) {
      days = [];
      //@ts-ignore
      weeks.push(days);
    }
    days.push(day);
  });
  
  // Aggiungi giorni del mese successivo per completare l'ultima settimana
  const remainingDays = 7 - (calendarDays.length % 7);
  if (remainingDays < 7) {
    const nextMonthDays = eachDayOfInterval({
      start: addMonths(monthStart, 1),
      end: addMonths(monthStart, 1)
    }).slice(0, remainingDays);
    
    calendarDays.push(...nextMonthDays);
    
    // Aggiorna l'ultima settimana
    nextMonthDays.forEach(day => {
      if (days.length < 7) {
        days.push(day);
      }
    });
  }

  // Funzione di verifica per gli stili quando è in modalità range
  const isDateInRange = React.useCallback(
    (day: Date) => {
      if (mode === "range" && selected && typeof selected !== "string" && "from" in selected && "to" in selected) {
        const { from, to } = selected;
        if (from && to) {
          return isAfter(day, from) && isBefore(day, to);
        }
      }
      return false;
    },
    [mode, selected]
  );

  const isStartDate = React.useCallback(
    (day: Date) => {
      if (mode === "range" && selected && typeof selected !== "string" && "from" in selected && selected.from) {
        return isSameDay(day, selected.from);
      }
      return false;
    },
    [mode, selected]
  );

  const isEndDate = React.useCallback(
    (day: Date) => {
      if (mode === "range" && selected && typeof selected !== "string" && "to" in selected && selected.to) {
        return isSameDay(day, selected.to);
      }
      return false;
    },
    [mode, selected]
  );

  // Funzione per gestire la selezione delle date
  const handleSelect = (day: Date) => {
    if (!onSelect) return;

    if (mode === "single") {
      onSelect(day);
    } else if (mode === "range") {
      if (!selected || typeof selected === "string" || !("from" in selected)) {
        onSelect({ from: day, to: undefined });
      } else {
        const { from, to } = selected;
        
        if (from && !to && (isAfter(day, from) || isEqual(day, from))) {
          onSelect({ from, to: day });
        } else {
          onSelect({ from: day, to: undefined });
        }
      }
    }
  };
  
  return (
    <div className={cn("p-3", className)}>
      <div className="flex items-center justify-center relative pt-1">
        <button
          onClick={prevMonth}
          className="absolute left-1 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-transparent hover:bg-accent hover:text-accent-foreground h-7 w-7 p-0 opacity-50 hover:opacity-100"
          aria-label="Mese precedente"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="text-sm font-medium">
          {format(currentMonth, "MMMM yyyy", { locale })}
        </div>
        <button
          onClick={nextMonth}
          className="absolute right-1 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-transparent hover:bg-accent hover:text-accent-foreground h-7 w-7 p-0 opacity-50 hover:opacity-100"
          aria-label="Mese successivo"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      
      <table className="w-full border-collapse mt-4">
        <thead>
          <tr>
            {weekDays.map((day) => (
              <th
                key={day}
                className="text-center text-muted-foreground text-xs font-normal p-1"
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
       {/*  @ts-ignore */}
          {weeks.map((week, weekIndex) => (
            <tr key={weekIndex} className="text-center">
              {/* @ts-ignore */}
              {week.map((day, dayIndex) => {
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isSelected = mode === "single"
                  ? selected && !("from" in selected) && isSameDay(day, selected as Date)
                  : isStartDate(day) || isEndDate(day);
                const isDisabled = disabled ? disabled(day) : false;
                const isInRange = isDateInRange(day);
                
                return (
                  <td key={dayIndex} className="p-0 text-center">
                    <div className="h-9 w-9 mx-auto">
                      <button
                        type="button"
                        onClick={() => handleSelect(day)}
                        disabled={isDisabled}
                        className={cn(
                          "h-9 w-9 p-0 font-normal rounded-md",
                          !isCurrentMonth && "text-muted-foreground opacity-50",
                          isSelected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                          isInRange && "bg-primary/20 text-primary-foreground",
                          !isSelected && !isInRange && "hover:bg-accent"
                        )}
                      >
                        {format(day, "d")}
                      </button>
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}