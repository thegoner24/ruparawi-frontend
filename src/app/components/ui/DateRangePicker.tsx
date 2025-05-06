import * as React from "react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  className?: string;
}

export default function DateRangePicker({ value, onChange, className = "" }: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className={`relative ${className}`}>
      <button
        className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-white shadow hover:bg-gray-50 text-gray-700 min-w-[220px]"
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        <span className="font-semibold">
          {value.from ? format(value.from, "MMM d, yyyy") : "Start"}
        </span>
        <span className="mx-1 text-gray-400">-</span>
        <span className="font-semibold">
          {value.to ? format(value.to, "MMM d, yyyy") : "End"}
        </span>
      </button>
      {open && (
        <div className="absolute z-50 mt-2 bg-white rounded-xl shadow-xl border p-4 left-0">
          <DayPicker
            mode="range"
            selected={value}
            onSelect={(range) => {
              onChange(range as DateRange);
            }}
            numberOfMonths={2}
            showOutsideDays
          />
          <div className="flex justify-end mt-2">
            <button
              className="px-4 py-2 rounded bg-[#b49a4d] text-white font-semibold hover:bg-yellow-700 transition"
              onClick={() => setOpen(false)}
              type="button"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
