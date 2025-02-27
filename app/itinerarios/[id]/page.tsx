import { getItinerary, getUserById } from "@/lib/data";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import {
  CalendarRange,
  MapPin,
  Users,
  FileDown,
  Share2,
  Pencil,
  Plane,
  Building,
  MapPinned,
  Bus,
  StickyNote,
  Clock,
  Info,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ItemType } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

export default async function ItinerarioPage({
  params,
}: {
  params: { id: string };
}) {
  const itinerary = await getItinerary(params.id);

  if (!itinerary) {
    notFound();
  }

  const owner = await getUserById(itinerary.ownerId);

  // Helper function to get icon based on item type
  const getItemIcon = (type: ItemType) => {
    switch (type) {
      case "flight":
        return <Plane className="h-5 w-5" />;
      case "accommodation":
        return <Building className="h-5 w-5" />;
      case "activity":
        return <MapPinned className="h-5 w-5" />;
      case "transport":
        return <Bus className="h-5 w-5" />;
      case "note":
        return <StickyNote className="h-5 w-5" />;
      default:
        return <MapPin className="h-5 w-5" />;
    }
  };

  // Helper function to get badge color based on item type
  const getItemBadgeVariant = (type: ItemType) => {
    switch (type) {
      case "flight":
        return "default";
      case "accommodation":
        return "secondary";
      case "activity":
        return "outline";
      case "transport":
        return "destructive";
      case "note":
        return "default";
      default:
        return "default";
    }
  };

  // Helper function to format item type in Spanish
  const formatItemType = (type: ItemType) => {
    switch (type) {
      case "flight":
        return "Vuelo";
      case "accommodation":
        return "Alojamiento";
      case "activity":
        return "Actividad";
      case "transport":
        return "Transporte";
      case "note":
        return "Nota";
      default:
        return type;
    }
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {itinerary.title}
          </h1>
          <div className="flex items-center gap-2 text-muted-foreground mt-1">
            <MapPin className="h-4 w-4" />
            <span>{itinerary.destination}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <FileDown className="mr-2 h-4 w-4" /> Exportar PDF
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" /> Compartir
          </Button>
          <Link href={`/itinerario/${itinerary.id}/editar`}>
            <Button size="sm">
              <Pencil className="mr-2 h-4 w-4" /> Editar
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Información General</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CalendarRange className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Fechas</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(itinerary.startDate), "dd MMM yyyy", {
                        locale: es,
                      })}{" "}
                      -{" "}
                      {format(new Date(itinerary.endDate), "dd MMM yyyy", {
                        locale: es,
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Descripción</p>
                    <p className="text-sm text-muted-foreground">
                      {itinerary.description}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Creado</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(itinerary.createdAt), "dd MMM yyyy", {
                        locale: es,
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Tipo</p>
                    <p className="text-sm text-muted-foreground">
                      {itinerary.isCollaborative ? "Colaborativo" : "Personal"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Colaboradores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={owner?.avatar} alt={owner?.name} />
                  <AvatarFallback>
                    {owner?.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{owner?.name}</p>
                  <p className="text-xs text-muted-foreground">Propietario</p>
                </div>
              </div>

              {itinerary.collaborators && itinerary.collaborators.length > 0 ? (
                itinerary.collaborators.map((collaborator) => (
                  <div
                    key={collaborator.id}
                    className="flex items-center gap-3"
                  >
                    <Avatar>
                      <AvatarImage
                        src={collaborator.avatar}
                        alt={collaborator.name}
                      />
                      <AvatarFallback>
                        {collaborator.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{collaborator.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Colaborador
                      </p>
                    </div>
                  </div>
                ))
              ) : itinerary.isCollaborative ? (
                <div className="text-center py-2">
                  <p className="text-sm text-muted-foreground">
                    No hay colaboradores aún
                  </p>
                  <Button variant="link" size="sm" className="mt-1">
                    <Users className="mr-1 h-3 w-3" /> Invitar
                  </Button>
                </div>
              ) : (
                <div className="text-center py-2">
                  <p className="text-sm text-muted-foreground">
                    Itinerario personal
                  </p>
                  <Button variant="link" size="sm" className="mt-1">
                    <Users className="mr-1 h-3 w-3" /> Convertir a colaborativo
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="cronograma" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="cronograma">Cronograma</TabsTrigger>
          <TabsTrigger value="mapa">Mapa</TabsTrigger>
          <TabsTrigger value="documentos">Documentos</TabsTrigger>
        </TabsList>

        <TabsContent value="cronograma">
          {itinerary.days.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-6 mb-4">
                <CalendarRange className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2">
                No hay actividades planificadas
              </h2>
              <p className="text-muted-foreground max-w-md mb-6">
                Comienza a añadir vuelos, alojamientos y actividades a tu
                itinerario.
              </p>
              <Link href={`/itinerario/${itinerary.id}/editar`}>
                <Button>
                  <Pencil className="mr-2 h-4 w-4" /> Editar Itinerario
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {itinerary.days.map((day) => (
                <div key={day.id} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CalendarRange className="h-5 w-5" />
                    <h3 className="text-lg font-semibold">
                      {format(new Date(day.date), "EEEE d MMMM yyyy", {
                        locale: es,
                      })}
                    </h3>
                  </div>

                  <div className="border rounded-lg divide-y">
                    {day.items.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">
                        No hay actividades para este día
                      </div>
                    ) : (
                      day.items
                        .sort((a, b) => {
                          if (!a.startTime) return 1;
                          if (!b.startTime) return -1;
                          return a.startTime.localeCompare(b.startTime);
                        })
                        .map((item) => (
                          <div key={item.id} className="p-4 hover:bg-muted/50">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3">
                                <div className="mt-0.5 rounded-full p-2 bg-muted">
                                  {getItemIcon(item.type)}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-medium">
                                      {item.title}
                                    </h4>
                                    <Badge
                                      variant={getItemBadgeVariant(item.type)}
                                    >
                                      {formatItemType(item.type)}
                                    </Badge>
                                  </div>
                                  {item.description && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {item.description}
                                    </p>
                                  )}
                                  {item.location && (
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                      <MapPin className="h-3 w-3" />
                                      <span>{item.location}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                {item.startTime && (
                                  <p className="text-sm font-medium">
                                    {item.startTime}
                                    {item.endTime && ` - ${item.endTime}`}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="mapa">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-6 mb-4">
              <MapPin className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Mapa no disponible</h2>
            <p className="text-muted-foreground max-w-md mb-6">
              La visualización en mapa estará disponible próximamente.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="documentos">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-6 mb-4">
              <FileDown className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No hay documentos</h2>
            <p className="text-muted-foreground max-w-md mb-6">
              Puedes añadir documentos como reservas, tickets o información
              importante para tu viaje.
            </p>
            <Button variant="outline">
              <FileDown className="mr-2 h-4 w-4" /> Añadir Documento
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
