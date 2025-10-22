interface MapLegendProps {
  mode: "salsa" | "bachata";
}

export function MapLegend({ mode }: MapLegendProps) {
  return (
    <div className="bg-card/95 backdrop-blur-md border border-card-border rounded-lg p-3 shadow-lg">
      <div className="flex items-center gap-2">
        <div
          className="w-6 h-6 rounded-full border-[3px] border-white shadow-md"
          style={{
            backgroundColor: mode === "salsa" ? "hsl(0 75% 60%)" : "hsl(280 65% 58%)",
          }}
        />
        <span className="text-xs font-medium text-foreground">
          {mode === "salsa" ? "Salsa Dancers" : "Bachata Dancers"}
        </span>
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        Tap markers for details
      </p>
    </div>
  );
}
