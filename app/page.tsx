import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Plane,
  Map,
  Users,
  FileDown,
  Wifi,
  CalendarClock,
  PenLine,
  Share2,
  Globe,
  Compass,
  Star,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center w-full">
      {/* Hero Section with animated background */}
      <section className="relative py-20 md:py-32 overflow-hidden w-full">
        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-background to-muted">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/2 right-1/3 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        {/* Floating icons */}
        <div
          className="absolute top-20 left-[10%] opacity-20 animate-bounce"
          style={{ animationDuration: "3s" }}
        >
          <Plane className="h-12 w-12 text-primary" />
        </div>
        <div
          className="absolute bottom-20 right-[15%] opacity-20 animate-bounce"
          style={{ animationDuration: "4s", animationDelay: "1s" }}
        >
          <Map className="h-10 w-10 text-primary" />
        </div>
        <div
          className="absolute top-1/2 left-[80%] opacity-20 animate-bounce"
          style={{ animationDuration: "5s", animationDelay: "0.5s" }}
        >
          <Globe className="h-14 w-14 text-primary" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative max-w-7xl">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2 max-w-3xl mx-auto">
              <div className="inline-block rounded-full bg-muted px-3 py-1 text-sm mb-4 animate-fade-in">
                <span className="text-primary font-medium">
                  Planifica · Colabora · Viaja
                </span>
              </div>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                Tu viaje perfecto comienza aquí
              </h1>
              <p className="mx-auto max-w-[800px] text-muted-foreground text-lg md:text-xl lg:text-2xl mt-4">
                Crea, personaliza y comparte tus itinerarios de viaje. Colabora
                con amigos y accede a tus planes incluso sin conexión.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link href="/itinerario/nuevo">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                  Crear Itinerario
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/itinerarios">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 rounded-full"
                >
                  Ver Ejemplos
                </Button>
              </Link>
            </div>
          </div>

          {/* Preview mockup */}
          <div className="mt-16 md:mt-20 max-w-5xl mx-auto">
            <div className="relative rounded-xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent z-10 pointer-events-none"></div>
              <img
                src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
                alt="TravelPlan en acción"
                className="w-full h-auto rounded-xl transform hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trusted by section */}
      <section className="py-12 bg-muted/50 w-full">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="text-center mb-8">
            <p className="text-muted-foreground">
              Utilizado por viajeros de todo el mundo
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            <div className="flex items-center gap-2 text-muted-foreground/70">
              <Star className="h-5 w-5 text-primary" />
              <span className="font-medium">TripAdvisor</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground/70">
              <Star className="h-5 w-5 text-primary" />
              <span className="font-medium">Lonely Planet</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground/70">
              <Star className="h-5 w-5 text-primary" />
              <span className="font-medium">National Geographic</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground/70">
              <Star className="h-5 w-5 text-primary" />
              <span className="font-medium">Travel + Leisure</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with cards */}
      <section className="py-20 md:py-32 bg-background w-full">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
              Todo lo que necesitas para el viaje perfecto
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
              Herramientas diseñadas por viajeros para viajeros
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            <FeatureCard
              icon={<CalendarClock className="h-12 w-12 mb-6 text-primary" />}
              title="Itinerarios Detallados"
              description="Crea planes de viaje completos con vuelos, alojamientos y actividades organizadas por día y hora."
              gradient="from-blue-500/20 to-purple-500/20"
            />
            <FeatureCard
              icon={<PenLine className="h-12 w-12 mb-6 text-primary" />}
              title="Edición Flexible"
              description="Modifica fácilmente horarios, agrega notas y personaliza cada detalle de tu itinerario."
              gradient="from-green-500/20 to-teal-500/20"
            />
            <FeatureCard
              icon={<FileDown className="h-12 w-12 mb-6 text-primary" />}
              title="Exportación a PDF"
              description="Genera automáticamente documentos PDF con toda la información de tu viaje para llevar contigo."
              gradient="from-orange-500/20 to-red-500/20"
            />
            <FeatureCard
              icon={<Wifi className="h-12 w-12 mb-6 text-primary" />}
              title="Modo Offline"
              description="Accede a tus itinerarios sin conexión a internet desde nuestra aplicación móvil."
              gradient="from-purple-500/20 to-pink-500/20"
            />
            <FeatureCard
              icon={<Users className="h-12 w-12 mb-6 text-primary" />}
              title="Colaboración"
              description="Invita a amigos y familiares a editar y votar sobre las actividades del viaje."
              gradient="from-yellow-500/20 to-amber-500/20"
            />
            <FeatureCard
              icon={<Share2 className="h-12 w-12 mb-6 text-primary" />}
              title="Compartir Fácilmente"
              description="Comparte tus itinerarios con cualquier persona mediante un enlace único."
              gradient="from-cyan-500/20 to-blue-500/20"
            />
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section className="py-20 md:py-32 bg-muted/30 w-full">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
              Cómo funciona
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
              Tres simples pasos para planificar tu próxima aventura
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
            <StepCard
              number="01"
              title="Crea tu itinerario"
              description="Ingresa las fechas, destino y comienza a añadir actividades, vuelos y alojamientos."
              icon={<PenLine className="h-8 w-8 text-primary" />}
            />
            <StepCard
              number="02"
              title="Personaliza y organiza"
              description="Ajusta horarios, añade notas y organiza cada día de tu viaje según tus preferencias."
              icon={<CalendarClock className="h-8 w-8 text-primary" />}
            />
            <StepCard
              number="03"
              title="Comparte y colabora"
              description="Invita a tus compañeros de viaje para que contribuyan con ideas y voten por actividades."
              icon={<Users className="h-8 w-8 text-primary" />}
            />
          </div>
        </div>
      </section>

      {/* Testimonials section */}
      <section className="py-20 md:py-32 bg-background w-full">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
              Lo que dicen nuestros usuarios
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
              Experiencias reales de viajeros como tú
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard
              quote="TravelPlan hizo que organizar nuestro viaje familiar fuera increíblemente sencillo. Todos pudimos colaborar y el resultado fue un itinerario perfecto."
              author="María García"
              role="Viajera frecuente"
              avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            />
            <TestimonialCard
              quote="La función de exportación a PDF fue un salvavidas cuando nos quedamos sin conexión durante nuestro viaje por el sudeste asiático."
              author="Carlos Rodríguez"
              role="Mochilero"
              avatar="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            />
            <TestimonialCard
              quote="Nunca había sido tan fácil planificar un viaje de negocios. La interfaz es intuitiva y me permite tener todo organizado en un solo lugar."
              author="Laura Martínez"
              role="Ejecutiva"
              avatar="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            />
          </div>
        </div>
      </section>

      {/* CTA Section with background */}
      <section className="relative py-20 md:py-32 overflow-hidden w-full">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5"></div>
          <img
            src="https://images.unsplash.com/photo-1488085061387-422e29b40080?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
            alt="Viaje"
            className="w-full h-full object-cover opacity-20"
          />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative max-w-7xl">
          <div className="max-w-3xl mx-auto bg-card/80 backdrop-blur-sm p-8 md:p-12 rounded-2xl shadow-xl">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  ¿Listo para tu próxima aventura?
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
                  Crea tu primer itinerario gratis y descubre cómo TravelPlan
                  puede hacer que tu próximo viaje sea inolvidable.
                </p>
              </div>
              <Link href="/itinerario/nuevo">
                <Button
                  size="lg"
                  className="mt-8 text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                  Comenzar Ahora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer with stats */}
      <section className="py-12 md:py-16 bg-muted/50 w-full">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StatCard number="10K+" label="Usuarios activos" />
            <StatCard number="50K+" label="Itinerarios creados" />
            <StatCard number="120+" label="Países visitados" />
            <StatCard number="4.9/5" label="Valoración media" />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  gradient,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}) {
  return (
    <div className="group relative flex flex-col items-center text-center p-8 rounded-2xl transition-all duration-300 hover:shadow-lg">
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      ></div>
      <div className="relative z-10">
        <div className="rounded-full p-4 bg-muted mb-4 mx-auto transform group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
  icon,
}: {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col items-center text-center p-8 rounded-2xl bg-card shadow-sm border border-border/50 hover:shadow-md transition-all">
      <div className="absolute -top-6 rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center">
        <span className="font-bold text-primary">{number}</span>
      </div>
      <div className="mt-6 mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

function TestimonialCard({
  quote,
  author,
  role,
  avatar,
}: {
  quote: string;
  author: string;
  role: string;
  avatar: string;
}) {
  return (
    <div className="flex flex-col p-6 bg-card rounded-2xl shadow-sm border border-border/50 hover:shadow-md transition-all">
      <div className="mb-4">
        <svg
          className="h-6 w-6 text-primary/60"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
      </div>
      <p className="text-lg mb-6">{quote}</p>
      <div className="mt-auto flex items-center">
        <img
          src={avatar}
          alt={author}
          className="h-10 w-10 rounded-full mr-3"
        />
        <div>
          <p className="font-medium">{author}</p>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <p className="text-3xl md:text-4xl font-bold text-primary">{number}</p>
      <p className="text-muted-foreground">{label}</p>
    </div>
  );
}
