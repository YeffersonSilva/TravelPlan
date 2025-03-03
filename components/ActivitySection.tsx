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
import { AddActivityForm } from "./AddActivityForm";
import { useRouter } from "next/navigation";

interface Activity {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  startTime: Date;
  endTime: Date | null;
  price: number | null;
}

interface ActivitySectionProps {
  activities: Activity[];
  itineraryId: string;
  isOwner: boolean;
}

export function ActivitySection({
  activities,
  itineraryId,
  isOwner,
}: ActivitySectionProps) {
  const router = useRouter();

  const handleActivityAdded = () => {
    router.refresh();
  };

  if (activities.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">
          No hay actividades registradas
        </h2>
        <p className="text-muted-foreground mb-6">
          Añade actividades para disfrutar durante tu viaje
        </p>
        {isOwner && (
          <Sheet>
            <SheetTrigger asChild>
              <Button>
                <Pencil className="mr-2 h-4 w-4" /> Añadir Actividad
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-xl">
              <SheetHeader>
                <SheetTitle>Añadir Actividad</SheetTitle>
                <SheetDescription>
                  Añade los detalles de la actividad para este itinerario
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <AddActivityForm
                  itineraryId={itineraryId}
                  onSuccess={handleActivityAdded}
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
        <h2 className="text-xl font-semibold">Actividades</h2>
        {isOwner && (
          <Sheet>
            <SheetTrigger asChild>
              <Button>
                <Pencil className="mr-2 h-4 w-4" /> Añadir Actividad
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-xl">
              <SheetHeader>
                <SheetTitle>Añadir Actividad</SheetTitle>
                <SheetDescription>
                  Añade los detalles de la actividad para este itinerario
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <AddActivityForm
                  itineraryId={itineraryId}
                  onSuccess={handleActivityAdded}
                />
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
      {activities.map((activity) => (
        <Link
          href={`/itinerario/${itineraryId}/actividades/${activity.id}`}
          key={activity.id}
          className="block"
        >
          <Card className="transition-all hover:shadow-md">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{activity.title}</h3>
                  {activity.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {activity.description}
                    </p>
                  )}
                  {activity.location && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {activity.location}
                    </p>
                  )}
                  <div className="mt-2">
                    <p className="text-sm">
                      {format(activity.startTime, "dd MMM yyyy HH:mm", {
                        locale: es,
                      })}
                      {activity.endTime && (
                        <>
                          {" - "}
                          {format(activity.endTime, "HH:mm", {
                            locale: es,
                          })}
                        </>
                      )}
                    </p>
                  </div>
                </div>
                {activity.price && (
                  <p className="text-sm font-medium">
                    {activity.price.toLocaleString("es-ES", {
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
