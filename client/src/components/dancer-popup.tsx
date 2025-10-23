import { ExternalLink, Crosshair, User } from "lucide-react";
import { SiInstagram, SiTiktok } from "react-icons/si";
import { useMap } from "react-leaflet";
import { useState } from "react";
import type { Dancer } from "@/types/schema";

interface DancerPopupProps {
  dancer: Dancer;
}

function DancerPopupContent({ dancer }: DancerPopupProps) {
  const map = useMap();
  const base = import.meta.env.BASE_URL;
  const profilePicUrl = dancer.profilePic.startsWith('http')
    ? dancer.profilePic
    : `${base}${dancer.profilePic.startsWith('/') ? dancer.profilePic.slice(1) : dancer.profilePic}`;

  const [imageError, setImageError] = useState(false);
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  const centerOnMap = () => {
    map.flyTo([dancer.latitude, dancer.longitude], map.getZoom(), {
      duration: 0.6
    });
  };

  return (
    <div className="min-w-[240px] max-w-[280px]">
      <div className="mb-3 flex justify-center">
        {imageError ? (
          <div className="w-20 h-20 rounded-full bg-muted border-2 border-border shadow-lg/20 flex items-center justify-center">
            <User className="h-10 w-10 text-muted-foreground" />
          </div>
        ) : (
          <img
            src={profilePicUrl}
            alt={`${dancer.name} - Profile Photo`}
            className="w-20 h-20 rounded-full object-cover border-2 border-border shadow-lg/20"
            data-testid={`profile-pic-${dancer.id}`}
            onError={() => setImageError(true)}
          />
        )}
      </div>

      <div className="mb-2">
        <h3 className="text-base font-semibold text-foreground" data-testid={`text-dancer-${dancer.id}`}>
          {dancer.name}
        </h3>
        <p className="text-sm text-muted-foreground mt-0.5">{dancer.location}</p>
      </div>
      
      <div className={`flex gap-2 mt-3 ${dancer.instagram && !dancer.tiktok ? 'justify-center' : ''} pointer-events-auto`}>
        {dancer.instagram && (
          <a
            href={dancer.instagram}
            target="_blank"
            rel="noopener noreferrer"
            data-testid={`link-instagram-${dancer.id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-md hover-elevate active-elevate-2 transition-all pointer-events-auto"
          >
            <SiInstagram className="h-3.5 w-3.5" />
            Instagram
            <ExternalLink className="h-3 w-3 ml-0.5" />
          </a>
        )}
        
        {dancer.tiktok && (
          <a
            href={dancer.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            data-testid={`link-tiktok-${dancer.id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-foreground !text-sky-300 dark:!text-sky-700 rounded-md hover-elevate active-elevate-2 transition-all pointer-events-auto"
          >
            <SiTiktok className="h-3.5 w-3.5" />
            TikTok
            <ExternalLink className="h-3 w-3 ml-0.5" />
          </a>
        )}
      </div>

      {isMobile && (
        <div className="mt-3 pt-3 border-t border-border">
          <button
            onClick={centerOnMap}
            className="flex items-center justify-center gap-1.5 w-full px-3 py-2 text-xs font-medium bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-colors"
            data-testid={`center-button-${dancer.id}`}
          >
            <Crosshair className="h-3.5 w-3.5" />
            Center on map
          </button>
        </div>
      )}
    </div>
  );
}

export function DancerPopup(props: DancerPopupProps) {
  return <DancerPopupContent {...props} />;
}
