import React from "react";
import { KeyRound, ExternalLink } from "lucide-react";

export function ConfigAlert({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-6 text-amber-200 space-y-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
          <KeyRound className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">
            AI Provider Key Required
          </h3>
          <p className="text-xs text-amber-300/90 mt-1 leading-relaxed">
            {message}
          </p>
        </div>
      </div>

      <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-4 space-y-2 text-xs">
        <p className="font-semibold text-slate-200">
          How to configure your LLM API Key:
        </p>
        <ol className="list-decimal list-inside space-y-1.5 text-slate-400">
          <li>
            Get an API key from Google AI Studio (
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-400 underline inline-flex items-center gap-1"
            >
              aistudio.google.com <ExternalLink className="h-3 w-3" />
            </a>
            ) or Groq / OpenAI.
          </li>
          <li>
            Open your project file:{" "}
            <code className="text-teal-300 font-mono">mediagent/.env.local</code>
          </li>
          <li>
            Add the variable:{" "}
            <code className="text-teal-300 font-mono">
              LLM_API_KEY=your-api-key-here
            </code>
          </li>
          <li>Save the file and refresh this page.</li>
        </ol>
      </div>
    </div>
  );
}

export default ConfigAlert;
