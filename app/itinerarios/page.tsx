import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import prisma from "@/lib/prismadb";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarRange, MapPin, Plus } from "lucide-react";

export default async function ItinerariosPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const itinerarios = await prisma.itinerary.findMany({
    where: {
      owner: {
        email: session.user.email,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Mis Itinerarios</h1>
        <Link href="/itinerario/nuevo">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Crear Itinerario
          </Button>
        </Link>
      </div>

      {itinerarios.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">
            No tienes itinerarios creados
          </h2>
          <p className="text-muted-foreground mb-8">
            Comienza creando tu primer itinerario de viaje
          </p>
          <Link href="/itinerario/nuevo">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Crear mi primer itinerario
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {itinerarios.map((itinerario) => (
            <Link
              href={`/itinerario/${itinerario.id}`}
              key={itinerario.id}
              className="group"
            >
              <div className="border rounded-lg overflow-hidden transition-all hover:shadow-lg">
                <div className="relative aspect-video">
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
                        <MapPin className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <MapPin className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    {itinerario.title}
                  </h3>
                  {itinerario.description && (
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                      {itinerario.description}
                    </p>
                  )}
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarRange className="w-4 h-4 mr-2" />
                    <span>
                      {format(new Date(itinerario.startDate), "d 'de' MMMM", {
                        locale: es,
                      })}{" "}
                      -{" "}
                      {format(
                        new Date(itinerario.endDate),
                        "d 'de' MMMM, yyyy",
                        {
                          locale: es,
                        }
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
