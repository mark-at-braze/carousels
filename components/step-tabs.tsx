"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface Tab {
  label: string;
  content: React.ReactNode;
}

interface StepTabsProps {
  tabs: Tab[];
}

export function StepTabs({ tabs }: StepTabsProps) {
  const [active, setActive] = useState(0);

  return (
    <div className="mt-1">
      {/* Tab bar */}
      <div className="flex border-b border-border">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActive(i)}
            className={cn(
              "relative -mb-px px-4 py-2 text-sm font-medium transition-colors",
              i === active
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="pt-4">
        {tabs[active].content}
      </div>
    </div>
  );
}
