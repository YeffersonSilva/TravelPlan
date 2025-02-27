import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/prismadb";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  CalendarRange,
  MapPin,
  Users,
  FileDown,
  Share2,
  Pencil,
  Info,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FlightSection } from "@/components/FlightSection";

export default async function ItinerarioPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const itinerario = await prisma.itinerary.findUnique({
    where: {
      id: params.id,
    },
    include: {
      owner: true,
      flights: true,
      lodgings: true,
      activities: true,
      notes: true,
      collaborators: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!itinerario) {
    notFound();
  }

  // Verificar si el usuario actual es el propietario o un colaborador
  const isOwner = itinerario.owner.email === session!.user!.email;
  const isCollaborator = itinerario.collaborators.some(
    (collaborator) => collaborator.user.email === session!.user!.email
  );

  if (!isOwner && !isCollaborator) {
    redirect("/itinerarios");
  }

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {itinerario.title}
          </h1>
          {itinerario.description && (
            <p className="text-muted-foreground mt-1">
              {itinerario.description}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <FileDown className="mr-2 h-4 w-4" /> Exportar PDF
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" /> Compartir
          </Button>
          {isOwner && (
            <Link href={`/itinerario/${itinerario.id}/editar`}>
              <Button size="sm">
                <Pencil className="mr-2 h-4 w-4" /> Editar
              </Button>
            </Link>
          )}
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
                      {format(itinerario.startDate, "dd MMM yyyy", {
                        locale: es,
                      })}{" "}
                      -{" "}
                      {format(itinerario.endDate, "dd MMM yyyy", {
                        locale: es,
                      })}
                    </p>
                  </div>
                </div>
                {itinerario.description && (
                  <div className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Descripción</p>
                      <p className="text-sm text-muted-foreground">
                        {itinerario.description}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Creado</p>
                    <p className="text-sm text-muted-foreground">
                      {format(itinerario.createdAt, "dd MMM yyyy", {
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
                      {itinerario.isPublic ? "Público" : "Privado"}
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
                  <AvatarImage src={itinerario.owner.image || undefined} />
                  <AvatarFallback>
                    {itinerario.owner.name?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{itinerario.owner.name}</p>
                  <p className="text-xs text-muted-foreground">Propietario</p>
                </div>
              </div>

              {itinerario.collaborators.length > 0 ? (
                itinerario.collaborators.map((collaborator) => (
                  <div
                    key={collaborator.id}
                    className="flex items-center gap-3"
                  >
                    <Avatar>
                      <AvatarImage src={collaborator.user.image || undefined} />
                      <AvatarFallback>
                        {collaborator.user.name?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {collaborator.user.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Colaborador
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-2">
                  <p className="text-sm text-muted-foreground">
                    No hay colaboradores
                  </p>
                  {isOwner && (
                    <Button variant="link" size="sm" className="mt-1">
                      <Users className="mr-1 h-3 w-3" /> Invitar colaboradores
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="detalles" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="detalles">Detalles</TabsTrigger>
          <TabsTrigger value="vuelos">Vuelos</TabsTrigger>
          <TabsTrigger value="alojamiento">Alojamiento</TabsTrigger>
          <TabsTrigger value="actividades">Actividades</TabsTrigger>
        </TabsList>

        <TabsContent value="detalles">
          <div className="relative max-w-2xl mx-auto aspect-video rounded-lg overflow-hidden mb-6">
            {itinerario.imageUrl ? (
              itinerario.imageUrl.startsWith("data:image") ? (
                <Image
                  src={itinerario.imageUrl}
                  alt={itinerario.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <MapPin className="w-12 h-12 text-muted-foreground" />
                </div>
              )
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <MapPin className="w-12 h-12 text-muted-foreground" />
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="vuelos">
          <FlightSection
            flights={itinerario.flights}
            itineraryId={itinerario.id}
            isOwner={isOwner}
          />
        </TabsContent>

        <TabsContent value="alojamiento">
          {itinerario.lodgings.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2">
                No hay alojamientos registrados
              </h2>
              <p className="text-muted-foreground mb-6">
                Añade información sobre tus alojamientos durante el viaje
              </p>
              {isOwner && (
                <Button>
                  <Pencil className="mr-2 h-4 w-4" /> Añadir Alojamiento
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {itinerario.lodgings.map((lodging) => (
                <Link
                  href={`/itinerario/${params.id}/alojamientos/${lodging.id}`}
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
                              {format(lodging.checkIn, "dd MMM yyyy HH:mm", {
                                locale: es,
                              })}
                            </p>
                            <p className="text-sm">
                              Check-out:{" "}
                              {format(lodging.checkOut, "dd MMM yyyy HH:mm", {
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
          )}
        </TabsContent>

        <TabsContent value="actividades">
          {itinerario.activities.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2">
                No hay actividades registradas
              </h2>
              <p className="text-muted-foreground mb-6">
                Añade las actividades que planeas realizar durante tu viaje
              </p>
              {isOwner && (
                <Button>
                  <Pencil className="mr-2 h-4 w-4" /> Añadir Actividad
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {itinerario.activities.map((activity) => (
                <Link
                  href={`/itinerario/${params.id}/actividades/${activity.id}`}
                  key={activity.id}
                  className="block"
                >
                  <Card className="transition-all hover:shadow-md">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{activity.title}</h3>
                          {activity.description && (
                            <p className="text-sm text-muted-foreground">
                              {activity.description}
                            </p>
                          )}
                          <div className="mt-2">
                            <p className="text-sm">
                              {format(activity.startTime, "dd MMM yyyy HH:mm", {
                                locale: es,
                              })}
                              {activity.endTime &&
                                ` - ${format(activity.endTime, "HH:mm", {
                                  locale: es,
                                })}`}
                            </p>
                            {activity.location && (
                              <p className="text-sm text-muted-foreground">
                                <MapPin className="inline-block w-3 h-3 mr-1" />
                                {activity.location}
                              </p>
                            )}
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
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
