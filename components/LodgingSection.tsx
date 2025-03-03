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
import { AddLodgingForm } from "./AddLodgingForm";
import { useRouter } from "next/navigation";

interface Lodging {
  id: string;
  name: string;
  address: string;
  checkIn: Date;
  checkOut: Date;
  price: number | null;
}

interface LodgingSectionProps {
  lodgings: Lodging[];
  itineraryId: string;
  isOwner: boolean;
}

export function LodgingSection({
  lodgings,
  itineraryId,
  isOwner,
}: LodgingSectionProps) {
  const router = useRouter();

  const handleLodgingAdded = () => {
    router.refresh();
  };

  if (lodgings.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">
          No hay alojamientos registrados
        </h2>
        <p className="text-muted-foreground mb-6">
          Añade información sobre tus alojamientos durante el viaje
        </p>
        {isOwner && (
          <Sheet>
            <SheetTrigger asChild>
              <Button>
                <Pencil className="mr-2 h-4 w-4" /> Añadir Alojamiento
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-xl">
              <SheetHeader>
                <SheetTitle>Añadir Alojamiento</SheetTitle>
                <SheetDescription>
                  Añade los detalles del alojamiento para este itinerario
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <AddLodgingForm
                  itineraryId={itineraryId}
                  onSuccess={handleLodgingAdded}
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
        <h2 className="text-xl font-semibold">Alojamientos</h2>
        {isOwner && (
          <Sheet>
            <SheetTrigger asChild>
              <Button>
                <Pencil className="mr-2 h-4 w-4" /> Añadir Alojamiento
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-xl">
              <SheetHeader>
                <SheetTitle>Añadir Alojamiento</SheetTitle>
                <SheetDescription>
                  Añade los detalles del alojamiento para este itinerario
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <AddLodgingForm
                  itineraryId={itineraryId}
                  onSuccess={handleLodgingAdded}
                />
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
      {lodgings.map((lodging) => (
        <Link
          href={`/itinerario/${itineraryId}/alojamientos/${lodging.id}`}
          key={lodging.id}
          className="block"
        >
          <Card className="transition-all hover:shadow-md">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{lodging.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {lodging.address}
                  </p>
                  <div className="mt-2">
                    <p className="text-sm">
                      Check-in:{" "}
                      {format(lodging.checkIn, "dd MMM yyyy", {
                        locale: es,
                      })}
                    </p>
                    <p className="text-sm">
                      Check-out:{" "}
                      {format(lodging.checkOut, "dd MMM yyyy", {
                        locale: es,
                      })}
                    </p>
                  </div>
                </div>
                {lodging.price && (
                  <p className="text-sm font-medium">
                    {lodging.price.toLocaleString("es-ES", {
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
