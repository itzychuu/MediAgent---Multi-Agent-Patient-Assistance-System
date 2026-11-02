"use client";

import React, { useState } from "react";
import {
  SYMPTOM_CATALOG,
  SYMPTOM_CATEGORIES,
  DURATION_OPTIONS,
  SymptomCatalogItem,
} from "@/lib/medical/symptom-catalog";
import { SelectedSymptom, SymptomSeverity } from "@/types/assessment";
import { Search, Plus, Check, X, SlidersHorizontal } from "lucide-react";

interface SymptomCatalogPickerProps {
  selectedSymptoms: SelectedSymptom[];
  onChange: (symptoms: SelectedSymptom[]) => void;
  disabled?: boolean;
}

export function SymptomCatalogPicker({
  selectedSymptoms,
  onChange,
  disabled = false,
}: SymptomCatalogPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filteredCatalog = SYMPTOM_CATALOG.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    if (!matchesCategory) return false;
    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase().trim();
    return (
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.bodyLocation.toLowerCase().includes(q)
    );
  });

  const isSelected = (id: string) => selectedSymptoms.some((s) => s.id === id);

  const toggleSymptom = (item: SymptomCatalogItem) => {
    if (disabled) return;
    if (isSelected(item.id)) {
      onChange(selectedSymptoms.filter((s) => s.id !== item.id));
    } else {
      const newSymptom: SelectedSymptom = {
        id: item.id,
        name: item.name,
        category: item.category,
        severity: "moderate",
        duration: "1 to 3 days",
      };
      onChange([...selectedSymptoms, newSymptom]);
    }
  };

  const updateSeverity = (id: string, severity: SymptomSeverity) => {
    if (disabled) return;
    onChange(
      selectedSymptoms.map((s) => (s.id === id ? { ...s, severity } : s))
    );
  };

  const updateDuration = (id: string, duration: string) => {
    if (disabled) return;
    onChange(
      selectedSymptoms.map((s) => (s.id === id ? { ...s, duration } : s))
    );
  };

  return (
    <div className="space-y-6">
      {/* Search and Category Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search symptoms by name, location, or feeling (e.g. fever, headache, cough)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={disabled}
            className="w-full rounded-xl border border-slate-800 bg-slate-900/90 pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setSelectedCategory("All")}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === "All"
                ? "bg-teal-500 text-slate-950 shadow-sm"
                : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            All Symptoms
          </button>
          {SYMPTOM_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-teal-500 text-slate-950 shadow-sm"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto pr-1">
        {filteredCatalog.map((item) => {
          const active = isSelected(item.id);
          return (
            <div
              key={item.id}
              onClick={() => toggleSymptom(item)}
              className={`flex items-start justify-between p-3 rounded-xl border text-left cursor-pointer transition-all select-none ${
                active
                  ? "bg-teal-500/15 border-teal-500/50 text-white shadow-sm"
                  : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850/80"
              }`}
            >
              <div className="space-y-1 pr-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold leading-snug">
                    {item.name}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
                <span className="inline-block text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                  {item.bodyLocation}
                </span>
              </div>

              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition ${
                  active
                    ? "bg-teal-500 text-slate-950 border-teal-400"
                    : "border-slate-700 text-slate-400 bg-slate-950/60"
                }`}
              >
                {active ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Symptoms Configurator */}
      {selectedSymptoms.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
              <SlidersHorizontal className="h-4 w-4" />
              <span>Selected Symptoms ({selectedSymptoms.length})</span>
            </h4>
            <span className="text-[11px] text-slate-400">
              Customize duration & severity for accuracy
            </span>
          </div>

          <div className="space-y-2.5">
            {selectedSymptoms.map((symptom) => (
              <div
                key={symptom.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-800 bg-slate-900/80 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between sm:justify-start gap-3">
                  <div>
                    <span className="text-xs font-semibold text-white">
                      {symptom.name}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {symptom.category}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      onChange(selectedSymptoms.filter((s) => s.id !== symptom.id))
                    }
                    className="text-slate-500 hover:text-rose-400 p-1 sm:hidden"
                    aria-label="Remove symptom"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Severity Picker */}
                  <div className="flex items-center rounded-lg border border-slate-800 bg-slate-950 p-0.5 text-xs">
                    {(["mild", "moderate", "severe"] as SymptomSeverity[]).map(
                      (sev) => (
                        <button
                          key={sev}
                          type="button"
                          onClick={() => updateSeverity(symptom.id, sev)}
                          className={`px-2.5 py-1 text-[11px] font-semibold rounded capitalize transition ${
                            symptom.severity === sev
                              ? sev === "severe"
                                ? "bg-rose-500 text-white"
                                : sev === "moderate"
                                ? "bg-amber-500 text-slate-950 font-bold"
                                : "bg-emerald-500 text-slate-950 font-bold"
                              : "text-slate-400 hover:text-white"
                          }`}
                        >
                          {sev}
                        </button>
                      )
                    )}
                  </div>

                  {/* Duration Selector */}
                  <select
                    value={symptom.duration}
                    onChange={(e) => updateDuration(symptom.id, e.target.value)}
                    className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-[11px] text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  >
                    {DURATION_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() =>
                      onChange(selectedSymptoms.filter((s) => s.id !== symptom.id))
                    }
                    className="text-slate-500 hover:text-rose-400 p-1 hidden sm:block transition cursor-pointer"
                    title="Remove symptom"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SymptomCatalogPicker;
