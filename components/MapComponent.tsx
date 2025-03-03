"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Home } from "lucide-react";

interface Location {
  id: string;
  name: string;
  address: string;
  type: "activity" | "lodging";
  lat?: number;
  lng?: number;
}

interface MapComponentProps {
  locations: Location[];
}

// Función para crear un icono personalizado para cada tipo de ubicación
const createIcon = (type: "activity" | "lodging") => {
  const iconHtml =
    type === "activity"
      ? `<div class="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full shadow-md">
         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
       </div>`
      : `<div class="flex items-center justify-center w-8 h-8 bg-secondary text-secondary-foreground rounded-full shadow-md">
         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-home"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
       </div>`;

  return L.divIcon({
    html: iconHtml,
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
};

export default function MapComponent({ locations }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Inicializar el mapa si no existe
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([0, 0], 2);

      // Añadir capa de mapa base
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstanceRef.current);
    }

    const map = mapInstanceRef.current;

    // Limpiar marcadores existentes
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // No hay ubicaciones para mostrar
    if (locations.length === 0) return;

    // Añadir marcadores para cada ubicación
    const bounds = L.latLngBounds([]);

    locations.forEach((location) => {
      if (location.lat && location.lng) {
        const marker = L.marker([location.lat, location.lng], {
          icon: createIcon(location.type),
        }).addTo(map);

        // Añadir popup con información
        marker.bindPopup(`
          <div>
            <h3 class="font-semibold">${location.name}</h3>
            <p class="text-sm">${location.address}</p>
            <p class="text-xs mt-1">${
              location.type === "activity" ? "Actividad" : "Alojamiento"
            }</p>
          </div>
        `);

        // Extender los límites del mapa para incluir este marcador
        bounds.extend([location.lat, location.lng]);
      }
    });

    // Ajustar el mapa para mostrar todos los marcadores
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    // Limpiar al desmontar
    return () => {
      if (mapInstanceRef.current && !mapRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [locations]);

  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden shadow-sm border">
      <div ref={mapRef} className="h-full w-full" />
    </div>
  );
}
