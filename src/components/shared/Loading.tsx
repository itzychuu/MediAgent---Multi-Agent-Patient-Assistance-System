import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
}

export function Loading({
  message = "Loading MediAgent...",
  size = "md",
  fullScreen = false,
}: LoadingProps) {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-3 p-6 text-center">
      <Loader2
        className={`${sizeClasses[size]} animate-spin text-teal-400`}
        aria-hidden="true"
      />
      {message && (
        <p className="text-sm font-medium text-slate-400 animate-pulse">
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
}

export default Loading;

