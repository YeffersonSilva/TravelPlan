"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Pencil } from "lucide-react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AddFlightForm } from "./AddFlightForm";
import { useRouter } from "next/navigation";

interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  departure: Date;
  arrival: Date;
  fromAirport: string;
  toAirport: string;
  price: number | null;
}

interface FlightSectionProps {
  flights: Flight[];
  itineraryId: string;
  isOwner: boolean;
}

export function FlightSection({
  flights,
  itineraryId,
  isOwner,
}: FlightSectionProps) {
  const router = useRouter();

  const handleFlightAdded = () => {
    router.refresh();
  };

  if (flights.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">
          No hay vuelos registrados
        </h2>
        <p className="text-muted-foreground mb-6">
          Añade información sobre tus vuelos para este viaje
        </p>
        {isOwner && (
          <Sheet>
            <SheetTrigger asChild>
              <Button>
                <Pencil className="mr-2 h-4 w-4" /> Añadir Vuelo
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-xl">
              <SheetHeader>
                <SheetTitle>Añadir Vuelo</SheetTitle>
                <SheetDescription>
                  Añade los detalles del vuelo para este itinerario
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <AddFlightForm
                  itineraryId={itineraryId}
                  onSuccess={handleFlightAdded}
                />
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Vuelos</h2>
        {isOwner && (
          <Sheet>
            <SheetTrigger asChild>
              <Button>
                <Pencil className="mr-2 h-4 w-4" /> Añadir Vuelo
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-xl">
              <SheetHeader>
                <SheetTitle>Añadir Vuelo</SheetTitle>
                <SheetDescription>
                  Añade los detalles del vuelo para este itinerario
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <AddFlightForm
                  itineraryId={itineraryId}
                  onSuccess={handleFlightAdded}
                />
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
      {flights.map((flight) => (
        <Link
          href={`/itinerario/${itineraryId}/vuelos/${flight.id}`}
          key={flight.id}
          className="block"
        >
          <Card className="transition-all hover:shadow-md">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{flight.airline}</h3>
                  <p className="text-sm text-muted-foreground">
                    Vuelo {flight.flightNumber}
                  </p>
                  <div className="mt-2">
                    <p className="text-sm">
                      {format(flight.departure, "dd MMM yyyy HH:mm", {
                        locale: es,
                      })}
                      {" - "}
                      {flight.fromAirport}
                    </p>
                    <p className="text-sm">
                      {format(flight.arrival, "dd MMM yyyy HH:mm", {
                        locale: es,
                      })}
                      {" - "}
                      {flight.toAirport}
                    </p>
                  </div>
                </div>
                {flight.price && (
                  <p className="text-sm font-medium">
                    {flight.price.toLocaleString("es-ES", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
