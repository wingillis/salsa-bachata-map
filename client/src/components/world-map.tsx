import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { DancerPopup } from "./dancer-popup";
import { MapLegend } from "./map-legend";
import { MapSkeleton } from "./map-skeleton";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Dancer } from "@/types/schema";

interface WorldMapProps {
  dancers: Dancer[];
  mode: "salsa" | "bachata";
  isLoading?: boolean;
}

// Calculate adjusted marker positions to prevent overlap based on screen distance
function calculateAdjustedPositions(dancers: Dancer[], map: L.Map | null): Map<string, [number, number]> {
  const positions = new Map<string, [number, number]>();

  if (!map) {
    // Fallback to original positions if map not available
    dancers.forEach(dancer => {
      positions.set(dancer.id, [dancer.latitude, dancer.longitude]);
    });
    return positions;
  }

  const OVERLAP_THRESHOLD_PX = 8; // Pixels - markers closer than this are considered overlapping
  const MIN_SEPARATION_PX = 12; // Pixels - minimum separation between markers

  // Group dancers by screen proximity
  const processed = new Set<string>();

  dancers.forEach((dancer, index) => {
    if (processed.has(dancer.id)) return;

    const dancerPoint = map.latLngToContainerPoint([dancer.latitude, dancer.longitude]);

    // Find nearby dancers based on screen distance
    const nearby = dancers.filter((other, otherIndex) => {
      if (otherIndex <= index || processed.has(other.id)) return false;

      const otherPoint = map.latLngToContainerPoint([other.latitude, other.longitude]);
      const dx = dancerPoint.x - otherPoint.x;
      const dy = dancerPoint.y - otherPoint.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      return distance < OVERLAP_THRESHOLD_PX;
    });

    if (nearby.length === 0) {
      // No nearby dancers, use original position
      positions.set(dancer.id, [dancer.latitude, dancer.longitude]);
      processed.add(dancer.id);
    } else {
      // Spread out nearby dancers in a circular pattern around their center point
      const cluster = [dancer, ...nearby];

      // Calculate the center point of the cluster (in lat/lng)
      const centerLat = cluster.reduce((sum, d) => sum + d.latitude, 0) / cluster.length;
      const centerLng = cluster.reduce((sum, d) => sum + d.longitude, 0) / cluster.length;
      const centerPoint = map.latLngToContainerPoint([centerLat, centerLng]);

      const angleStep = (2 * Math.PI) / cluster.length;

      cluster.forEach((d, i) => {
        const angle = i * angleStep;

        // Calculate offset in pixels from the center
        const offsetX = Math.cos(angle) * MIN_SEPARATION_PX;
        const offsetY = Math.sin(angle) * MIN_SEPARATION_PX;

        // Apply offset from center in screen space
        const adjustedPoint = L.point(
          centerPoint.x + offsetX,
          centerPoint.y + offsetY
        );

        // Convert back to lat/lng
        const adjustedLatLng = map.containerPointToLatLng(adjustedPoint);

        positions.set(d.id, [adjustedLatLng.lat, adjustedLatLng.lng]);
        processed.add(d.id);
      });
    }
  });

  return positions;
}

// Custom marker icons for salsa and bachata
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        width: 24px;
        height: 24px;
        background-color: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        transform: translate(-50%, -50%);
        transition: all 0.2s ease;
      " class="marker-dot"></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [-11, -20],
  });
};

const salsaIcon = createCustomIcon("hsl(0 75% 60%)");
const bachataIcon = createCustomIcon("hsl(280 65% 58%)");

// Component to handle map view changes
function MapViewController({ dancers }: { dancers: Dancer[] }) {
  const map = useMap();
  const hasSetInitialView = useRef(false);

  useEffect(() => {
    if (dancers.length > 0 && !hasSetInitialView.current) {
      // Set initial view to show all dancers
      const bounds = L.latLngBounds(
        dancers.map((d) => [d.latitude, d.longitude])
      );
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 3 });
      hasSetInitialView.current = true;
    }
  }, [dancers, map]);

  return null;
}

// Component to handle view reset
function ViewResetControl({ dancers }: { dancers: Dancer[] }) {
  const map = useMap();

  const resetView = () => {
    if (dancers.length > 0) {
      const bounds = L.latLngBounds(
        dancers.map((d) => [d.latitude, d.longitude])
      );
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 3 });
    }
  };

  return (
    <div
      className="leaflet-top leaflet-right z-[9999] m-2"
      style={{ zIndex: 9999 }}
    >
      <Button
        size="sm"
        variant="secondary"
        onClick={resetView}
        className="bg-background border border-border shadow-md hover-elevate active-elevate-2 pointer-events-auto"
        title="Reset view to show all dancers"
        type="button"
      >
        <RotateCcw className="h-3 w-3" />
      </Button>
    </div>
  );
}

// Component to render markers with adjusted positions
function MarkersLayer({ dancers, mode }: { dancers: Dancer[]; mode: "salsa" | "bachata" }) {
  const map = useMap();
  const markerIcon = mode === "salsa" ? salsaIcon : bachataIcon;
  const [adjustedPositions, setAdjustedPositions] = useState<Map<string, [number, number]>>(new Map());
  const isPopupOpenRef = useRef(false);

  useEffect(() => {
    const updatePositions = () => {
      // Skip position updates when a popup is open to avoid disrupting the autoPan animation
      if (isPopupOpenRef.current) {
        return;
      }
      setAdjustedPositions(calculateAdjustedPositions(dancers, map));
    };

    // Calculate initial positions
    updatePositions();

    // Track popup open/close state
    const handlePopupOpen = () => {
      isPopupOpenRef.current = true;
    };

    const handlePopupClose = () => {
      isPopupOpenRef.current = false;
      // Recalculate positions after popup closes
      updatePositions();
    };

    // Recalculate on zoom or move (when screen coordinates change)
    map.on('zoomend', updatePositions);
    map.on('moveend', updatePositions);
    map.on('popupopen', handlePopupOpen);
    map.on('popupclose', handlePopupClose);

    return () => {
      map.off('zoomend', updatePositions);
      map.off('moveend', updatePositions);
      map.off('popupopen', handlePopupOpen);
      map.off('popupclose', handlePopupClose);
    };
  }, [dancers, map]);

  return (
    <>
      {dancers.map((dancer) => {
        const position = adjustedPositions.get(dancer.id) || [dancer.latitude, dancer.longitude];
        return (
          <DancerMarker
            key={dancer.id}
            dancer={dancer}
            position={position}
            markerIcon={markerIcon}
          />
        );
      })}
    </>
  );
}

// Simplified marker component - dancers are already pre-filtered by image existence
function DancerMarker({ dancer, position, markerIcon }: {
  dancer: Dancer;
  position: LatLngExpression;
  markerIcon: L.DivIcon;
}) {
  return (
    <Marker
      key={dancer.id}
      position={position}
      icon={markerIcon}
      data-testid={`marker-${dancer.id}`}
    >
      <Popup
        className="custom-popup"
        closeButton={true}
        autoPan={typeof window !== 'undefined' && window.innerWidth > 768}
        autoPanSpeed={typeof window !== 'undefined' && window.innerWidth > 768 ? 30 : 30}
        autoPanPadding={[20, 20]}
        data-testid={`popup-${dancer.id}`}
      >
        <DancerPopup dancer={dancer} />
      </Popup>
    </Marker>
  );
}

export function WorldMap({ dancers, mode, isLoading }: WorldMapProps) {
  if (isLoading) {
    return <MapSkeleton />;
  }

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        className="h-full w-full rounded-none lg:rounded-lg"
        zoomControl={false}
        scrollWheelZoom={true}
        data-testid="map-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles"
        />

        <MapViewController dancers={dancers} />
        <ViewResetControl dancers={dancers} />
        <MarkersLayer dancers={dancers} mode={mode} />
      </MapContainer>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] hidden sm:block">
        <MapLegend mode={mode} />
      </div>
      
      {/* Mobile Legend */}
      <div className="absolute bottom-4 left-4 right-4 z-[1000] sm:hidden">
        <MapLegend mode={mode} />
      </div>

      {/* Add custom styles for markers */}
      <style>{`
        .marker-dot:hover {
          transform: translate(-50%, -50%) scale(1.25);
          box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        }
        
        .leaflet-popup-content-wrapper {
          background: hsl(var(--popover));
          color: hsl(var(--popover-foreground));
          border: 1px solid hsl(var(--popover-border));
          border-radius: 0.5rem;
          box-shadow: var(--shadow-lg);
          padding: 0;
        }
        
        .leaflet-popup-content {
          margin: 1rem;
          font-family: var(--font-sans);
        }
        
        .leaflet-popup-tip {
          background: hsl(var(--popover));
          border: 1px solid hsl(var(--popover-border));
          border-top: none;
          border-left: none;
        }
        
        .leaflet-container {
          background: hsl(var(--background));
          font-family: var(--font-sans);
        }
        
        .leaflet-popup-close-button {
          color: hsl(var(--muted-foreground)) !important;
          font-size: 20px !important;
          right: 2px !important;
        }
        
        .leaflet-popup-close-button:hover {
          color: hsl(var(--foreground)) !important;
        }
        
        .map-tiles {
          filter: ${mode === "salsa" ? "hue-rotate(350deg) saturate(0.9)" : "hue-rotate(260deg) saturate(0.9)"};
          opacity: 0.95;
        }
        
        @media (prefers-color-scheme: dark), .dark {
          .map-tiles {
            filter: ${mode === "salsa" ? "hue-rotate(350deg) saturate(0.8) brightness(0.7)" : "hue-rotate(260deg) saturate(0.8) brightness(0.7)"};
          }
        }
      `}</style>
    </div>
  );
}
