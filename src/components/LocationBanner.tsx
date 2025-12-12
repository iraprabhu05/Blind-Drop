import { AlertTriangle, MapPin } from "lucide-react";
import { Button } from "./ui/button";

interface LocationBannerProps {
  onRetry: () => void;
}

export const LocationBanner = ({ onRetry }: LocationBannerProps) => {
  return (
    <div className="w-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center">
        <AlertTriangle className="w-5 h-5 mr-3" />
        <span className="font-medium">
          Location access denied. Enable location services in your browser
          settings to see artists near you.
        </span>
      </div>
      <Button onClick={onRetry} variant="outline" size="sm">
        <MapPin className="w-4 h-4 mr-2" />
        Retry
      </Button>
    </div>
  );
};
