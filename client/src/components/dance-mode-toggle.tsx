interface DanceModeToggleProps {
  mode: "salsa" | "bachata";
  onModeChange: (mode: "salsa" | "bachata") => void;
  isMobile?: boolean;
}

export function DanceModeToggle({ mode, onModeChange, isMobile = false }: DanceModeToggleProps) {
  const suffix = isMobile ? "-mobile" : "";
  
  return (
    <div className="relative inline-flex items-center bg-card border border-card-border rounded-full p-1 shadow-sm">
      <div className="relative flex items-center">
        {/* Salsa Button */}
        <button
          onClick={() => onModeChange("salsa")}
          data-testid={`button-mode-salsa${suffix}`}
          className={`relative z-10 px-6 py-2 min-w-[100px] text-sm font-semibold rounded-full transition-all duration-300 ${
            mode === "salsa"
              ? "text-white bg-[hsl(0_75%_60%)]"
              : "text-foreground hover:text-foreground/80"
          }`}
        >
          Salsa
        </button>
        
        {/* Bachata Button */}
        <button
          onClick={() => onModeChange("bachata")}
          data-testid={`button-mode-bachata${suffix}`}
          className={`relative z-10 px-6 py-2 min-w-[100px] text-sm font-semibold rounded-full transition-all duration-300 ${
            mode === "bachata"
              ? "text-white bg-[hsl(280_65%_58%)]"
              : "text-foreground hover:text-foreground/80"
          }`}
        >
          Bachata
        </button>
      </div>
    </div>
  );
}
