"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { CalendarIcon, ImageIcon, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  description: z.string().optional(),
  startDate: z.date({
    required_error: "Se requiere una fecha de inicio",
  }),
  endDate: z.date({
    required_error: "Se requiere una fecha de fin",
  }),
  imageUrl: z.string().optional(),
});

const UNSPLASH_ACCESS_KEY = "tu_access_key_aqui"; // Reemplaza con tu API key de Unsplash

export default function NuevoItinerario() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [unsplashImages, setUnsplashImages] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUnsplashDialogOpen, setIsUnsplashDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("La imagen no debe superar los 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setSelectedImage(base64String);
        form.setValue("imageUrl", base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const searchUnsplash = async (query: string) => {
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${query}&client_id=${UNSPLASH_ACCESS_KEY}`
      );
      const data = await response.json();
      setUnsplashImages(data.results);
    } catch (error) {
      console.error("Error buscando imágenes:", error);
      toast.error("Error al buscar imágenes");
    }
  };

  const selectUnsplashImage = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    form.setValue("imageUrl", imageUrl);
    setIsUnsplashDialogOpen(false);
    toast.success("Imagen seleccionada");
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("/api/itinerarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          startDate: values.startDate.toISOString(),
          endDate: values.endDate.toISOString(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al crear el itinerario");
      }

      toast.success("¡Itinerario creado con éxito!");
      router.push(`/itinerario/${data.id}`);
    } catch (error) {
      console.error("Error detallado:", error);
      toast.error(
        error instanceof Error ? error.message : "Error al crear el itinerario"
      );
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Crear Nuevo Itinerario</h1>

      <div className="max-w-2xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título del Viaje</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: Vacaciones en Barcelona"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe tu viaje..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha de Inicio</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: es })
                            ) : (
                              <span>Selecciona una fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha de Fin</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: es })
                            ) : (
                              <span>Selecciona una fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < form.getValues("startDate") ||
                            !form.getValues("startDate")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imagen del Viaje (opcional)</FormLabel>
                  <div className="space-y-4">
                    {selectedImage && (
                      <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                        <Image
                          src={selectedImage}
                          alt="Vista previa"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          document.getElementById("fileInput")?.click()
                        }
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Subir Imagen
                      </Button>
                    </div>
                    <input
                      id="fileInput"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileUpload}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancelar
              </Button>
              <Button type="submit">Crear Itinerario</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
