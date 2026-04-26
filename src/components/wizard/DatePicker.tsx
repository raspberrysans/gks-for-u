"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { formatYMD, isValidYMD, parseYMD } from "@/lib/format/date";

type Props = {
  value?: string;
  onChange: (ymd: string) => void;
  min?: string;
  max?: string;
  placeholder?: string;
  ariaLabel?: string;
};

const MONTHS = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];
const WEEKDAYS = ["mo", "tu", "we", "th", "fr", "sa", "su"];

export function DatePicker({ value, onChange, min, max, placeholder = "yyyy-mm-dd", ariaLabel }: Props) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(value ?? "");
  const [prevValue, setPrevValue] = useState(value);
  if (prevValue !== value) {
    setPrevValue(value);
    setText(value ?? "");
  }

  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = useMemo(() => (value && isValidYMD(value) ? parseYMD(value) : null), [value]);
  const minDate = useMemo(() => (min ? parseYMD(min) : null), [min]);
  const maxDate = useMemo(() => (max ? parseYMD(max) : null), [max]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        inputRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const commit = (d: Date) => {
    const ymd = formatYMD(d);
    onChange(ymd);
    setText(ymd);
    setOpen(false);
    inputRef.current?.focus();
  };

  const onTextBlur = () => {
    if (text === "") {
      onChange("");
      return;
    }
    if (isValidYMD(text)) {
      onChange(text);
    } else {
      setText(value ?? "");
    }
  };

  return (
    <div ref={wrapRef} className="dp-wrap">
      <div className="dp-input-row">
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          aria-label={ariaLabel}
          className="input dp-input"
          placeholder={placeholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={onTextBlur}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (isValidYMD(text)) {
                onChange(text);
                setOpen(false);
              }
            } else if (e.key === "ArrowDown" && !open) {
              e.preventDefault();
              setOpen(true);
            }
          }}
          maxLength={10}
        />
        <button
          type="button"
          className="dp-trigger"
          aria-label="open calendar"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <CalendarIcon />
        </button>
      </div>

      {open && (
        <Calendar
          selected={selected}
          minDate={minDate}
          maxDate={maxDate}
          onSelect={commit}
          onClear={() => {
            onChange("");
            setText("");
            setOpen(false);
            inputRef.current?.focus();
          }}
        />
      )}
    </div>
  );
}

function Calendar({
  selected,
  minDate,
  maxDate,
  onSelect,
  onClear,
}: {
  selected: Date | null;
  minDate: Date | null;
  maxDate: Date | null;
  onSelect: (d: Date) => void;
  onClear: () => void;
}) {
  const today = useMemo(() => {
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), t.getDate());
  }, []);

  const initial = selected ?? today;
  const [view, setView] = useState({ y: initial.getFullYear(), m: initial.getMonth() });

  const days = useMemo(() => buildMonthGrid(view.y, view.m), [view]);

  const isOutOfRange = (d: Date) => {
    if (minDate && d < minDate) return true;
    if (maxDate && d > maxDate) return true;
    return false;
  };

  const shiftMonth = (delta: number) => {
    setView((v) => {
      const d = new Date(v.y, v.m + delta, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });
  };

  return (
    <div className="dp-pop" role="dialog" aria-label="choose date">
      <div className="dp-head">
        <button type="button" className="dp-nav" onClick={() => shiftMonth(-1)} aria-label="previous month">‹</button>
        <div className="dp-title">
          <span className="dp-month">{MONTHS[view.m]}</span>
          <span className="dp-year">{view.y}</span>
        </div>
        <button type="button" className="dp-nav" onClick={() => shiftMonth(1)} aria-label="next month">›</button>
      </div>

      <div className="dp-weekdays">
        {WEEKDAYS.map((w) => (
          <span key={w} className="dp-weekday">{w}</span>
        ))}
      </div>

      <div className="dp-grid">
        {days.map(({ date, currentMonth }, i) => {
          const ymd = formatYMD(date);
          const isSelected = selected && formatYMD(selected) === ymd;
          const isToday = formatYMD(today) === ymd;
          const disabled = isOutOfRange(date);
          return (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(date)}
              className={[
                "dp-day",
                !currentMonth ? "dp-day-muted" : "",
                isSelected ? "dp-day-selected" : "",
                isToday && !isSelected ? "dp-day-today" : "",
              ].filter(Boolean).join(" ")}
              aria-label={ymd}
              aria-pressed={isSelected || undefined}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      <div className="dp-foot">
        <button
          type="button"
          className="dp-link"
          onClick={() => {
            if (!isOutOfRange(today)) onSelect(today);
          }}
        >
          today
        </button>
        <button type="button" className="dp-link" onClick={onClear}>
          clear
        </button>
      </div>
    </div>
  );
}

function buildMonthGrid(year: number, month: number) {
  const first = new Date(year, month, 1);
  const firstDow = (first.getDay() + 6) % 7;
  const start = new Date(year, month, 1 - firstDow);
  const cells: { date: Date; currentMonth: boolean }[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    cells.push({ date: d, currentMonth: d.getMonth() === month });
  }
  return cells;
}

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="1.5" y="3.5" width="13" height="11" stroke="currentColor" />
      <path d="M1.5 6.5h13" stroke="currentColor" />
      <path d="M5 1.5v3M11 1.5v3" stroke="currentColor" strokeLinecap="square" />
    </svg>
  );
}
