import { useState } from "react";
import { Music, Info } from "lucide-react";
import { DanceModeToggle } from "@/components/dance-mode-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { WorldMap } from "@/components/world-map";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useStaticDancers } from "@/hooks/useStaticDancers";

export default function Home() {
  const [mode, setMode] = useState<"salsa" | "bachata">("salsa");

  const { data: dancers = [], isLoading } = useStaticDancers();

  // Filter by type (salsa/bachata)
  const filteredDancers = dancers.filter((dancer) => dancer.type === mode);

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-border bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="flex items-center justify-between px-4 py-3 lg:px-6">
          {/* Logo and Title */}
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-9 h-9 bg-primary rounded-md">
              <Music className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-base font-bold text-foreground leading-tight" data-testid="text-app-title">
                World Map of Dance 💃
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Discover popular dancers worldwide
              </p>
            </div>
          </div>

          {/* Center - Mode Toggle (hidden on mobile) */}
          <div className="hidden md:block">
            <DanceModeToggle mode={mode} onModeChange={setMode} />
          </div>

          {/* Right - Actions */}
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  data-testid="button-info"
                  className="hover-elevate active-elevate-2"
                >
                  <Info className="h-5 w-5" />
                  <span className="sr-only">About</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>About Dance World Map</DialogTitle>
                  <DialogDescription className="pt-4 space-y-3 text-sm">
                    <p>
                      Explore an interactive map showcasing popular salsa and bachata
                      dancers from around the globe.
                    </p>
                    <p>
                      <strong>How to use:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Toggle between Salsa and Bachata modes</li>
                      <li>Hover over markers to see dancer details</li>
                      <li>Click social media links to visit their profiles</li>
                      <li>Zoom and pan to explore different regions</li>
                    </ul>
                    <p className="text-muted-foreground pt-2">
                      Featuring world-renowned dancers including Daniel y Desirée, 
                      Karen Forcano & Ricardo, Cornel & Rithika, and many more!
                    </p>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Mode Toggle */}
        <div className="md:hidden px-4 pb-3">
          <DanceModeToggle mode={mode} onModeChange={setMode} isMobile={true} />
        </div>
      </header>

      {/* Map Container */}
      <main className="flex-1 overflow-hidden">
        <WorldMap dancers={filteredDancers} mode={mode} isLoading={isLoading} />
      </main>

    </div>
  );
}
