"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Interfaces para los datos
interface Location {
  id: string;
  name: string;
  address: string;
  type: "activity" | "lodging";
  lat?: number;
  lng?: number;
}

interface ItineraryMapProps {
  activities: {
    id: string;
    title: string;
    location: string | null;
  }[];
  lodgings: {
    id: string;
    name: string;
    address: string;
  }[];
}

// Cargamos el mapa dinámicamente para evitar problemas con SSR
const MapComponent = dynamic(
  () =>
    import("./MapComponent").then((mod) => {
      // Inicializar Leaflet después de cargar el componente
      if (typeof window !== "undefined") {
        const L = require("leaflet");
        // Solucionar el problema de los iconos de Leaflet en Next.js
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "/leaflet/marker-icon-2x.png",
          iconUrl: "/leaflet/marker-icon.png",
          shadowUrl: "/leaflet/marker-shadow.png",
        });
      }
      return mod;
    }),
  {
    loading: () => (
      <div className="flex items-center justify-center h-[400px] bg-muted rounded-lg">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    ),
    ssr: false,
  }
);

export function ItineraryMap({ activities, lodgings }: ItineraryMapProps) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Función para geocodificar direcciones
    const geocodeAddresses = async () => {
      setIsLoading(true);
      const apiKey = "c9c95d95729141679f5dc4e7bfa4c037"; // Geoapify API key

      // Preparar las ubicaciones de actividades y alojamientos
      const activityLocations = activities
        .filter((activity) => activity.location)
        .map((activity) => ({
          id: activity.id,
          name: activity.title,
          address: activity.location as string,
          type: "activity" as const,
        }));

      const lodgingLocations = lodgings.map((lodging) => ({
        id: lodging.id,
        name: lodging.name,
        address: lodging.address,
        type: "lodging" as const,
      }));

      const allLocations = [...activityLocations, ...lodgingLocations];

      // Geocodificar cada dirección
      const locationsWithCoordinates = await Promise.all(
        allLocations.map(async (location) => {
          try {
            const response = await fetch(
              `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
                location.address
              )}&format=json&apiKey=${apiKey}`
            );

            if (!response.ok) {
              console.error(`Error geocoding ${location.address}`);
              return location;
            }

            const data = await response.json();

            if (data.results && data.results.length > 0) {
              const result = data.results[0];
              return {
                ...location,
                lat: result.lat,
                lng: result.lon,
              };
            }

            return location;
          } catch (error) {
            console.error(`Error geocoding ${location.address}:`, error);
            return location;
          }
        })
      );

      // Filtrar solo las ubicaciones que tienen coordenadas
      const validLocations = locationsWithCoordinates.filter(
        (loc) => loc.lat && loc.lng
      );

      setLocations(validLocations);
      setIsLoading(false);
    };

    if (activities.length > 0 || lodgings.length > 0) {
      geocodeAddresses();
    } else {
      setIsLoading(false);
    }
  }, [activities, lodgings]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px] bg-muted rounded-lg">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] bg-muted rounded-lg">
        <p className="text-muted-foreground">
          No hay ubicaciones para mostrar en el mapa
        </p>
      </div>
    );
  }

  return <MapComponent locations={locations} />;
}
