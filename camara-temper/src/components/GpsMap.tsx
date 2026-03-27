import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Props {
  latitude: number;
  longitude: number;
  altitude?: number;
}

const GpsMap = ({ latitude, longitude, altitude }: Props) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [latitude, longitude],
      zoom: 13,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    const icon = L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        width: 24px; height: 24px;
        background: hsl(83, 100%, 36%);
        border: 3px solid hsl(83, 100%, 50%);
        border-radius: 50%;
        box-shadow: 0 0 20px hsl(83, 100%, 36%, 0.6);
      "></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    L.marker([latitude, longitude], { icon }).addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [latitude, longitude]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl overflow-hidden"
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/50">
        <MapPin className="w-4 h-4 text-primary" />
        <span className="font-display text-xs tracking-widest text-primary">GPS ORIGIN LOCATION</span>
      </div>

      <div ref={mapRef} className="h-64 w-full" />

      <div className="px-4 py-3 border-t border-border bg-muted/30 flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground">
            <Navigation className="w-3 h-3 inline mr-1 text-primary" />
            {latitude.toFixed(6)}°, {longitude.toFixed(6)}°
          </span>
          {altitude !== undefined && (
            <span className="text-muted-foreground">
              Alt: {altitude.toFixed(1)}m
            </span>
          )}
        </div>
        <a
          href={`https://www.google.com/maps?q=${latitude},${longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline font-mono-code"
        >
          Open in Maps →
        </a>
      </div>
    </motion.div>
  );
};

export default GpsMap;
