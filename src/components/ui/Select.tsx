import React from "react";

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", label, error, hint, options, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`w-full rounded-lg border bg-slate-900/90 px-3.5 py-2.5 text-sm text-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
            error
              ? "border-rose-500/80 focus:ring-rose-500"
              : "border-slate-700/80 hover:border-slate-600"
          } ${className}`}
          {...props}
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="bg-slate-900 text-slate-100 py-1"
            >
              {option.label}
            </option>
          ))}
        </select>
        {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
        {error && <p className="text-xs font-medium text-rose-400">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";

