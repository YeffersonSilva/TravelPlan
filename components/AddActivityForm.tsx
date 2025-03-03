"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const activityFormSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  description: z.string().optional(),
  location: z.string().optional(),
  startTime: z.string().min(1, "La fecha y hora de inicio son requeridas"),
  endTime: z.string().optional(),
  price: z.string().optional(),
  category: z.string().optional(),
});

type ActivityFormValues = z.infer<typeof activityFormSchema>;

interface AddActivityFormProps {
  itineraryId: string;
  onSuccess?: () => void;
}

interface PlaceSuggestion {
  name: string;
  address: string;
  placeId: string;
  categories?: string[];
}

// Categorías de actividades
const activityCategories = [
  { value: "sightseeing", label: "Turismo" },
  { value: "museum", label: "Museo" },
  { value: "restaurant", label: "Restaurante" },
  { value: "shopping", label: "Compras" },
  { value: "nature", label: "Naturaleza" },
  { value: "beach", label: "Playa" },
  { value: "entertainment", label: "Entretenimiento" },
  { value: "nightlife", label: "Vida nocturna" },
  { value: "sport", label: "Deporte" },
  { value: "other", label: "Otro" },
];

export function AddActivityForm({
  itineraryId,
  onSuccess,
}: AddActivityFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    string | undefined
  >();

  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      startTime: "",
      endTime: "",
      price: "",
      category: "",
    },
  });

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.length < 3) {
        setSuggestions([]);
        return;
      }

      setIsSearching(true);
      try {
        // Usar la API key proporcionada
        const apiKey = "c9c95d95729141679f5dc4e7bfa4c037";

        // Filtrar por tipo según la categoría seleccionada
        let typeParam = "";
        if (selectedCategory) {
          switch (selectedCategory) {
            case "sightseeing":
              typeParam = "&type=tourism";
              break;
            case "museum":
              typeParam = "&type=amenity";
              break;
            case "restaurant":
              typeParam = "&type=amenity";
              break;
            case "shopping":
              typeParam = "&type=amenity";
              break;
            case "nature":
              typeParam = "&type=natural";
              break;
            case "beach":
              typeParam = "&type=natural";
              break;
            case "entertainment":
              typeParam = "&type=amenity";
              break;
            case "nightlife":
              typeParam = "&type=amenity";
              break;
            case "sport":
              typeParam = "&type=amenity";
              break;
          }
        }

        // Usar la API de Geocoding Autocomplete
        const response = await fetch(
          `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
            searchTerm
          )}${typeParam}&limit=10&format=json&apiKey=${apiKey}`
        );

        if (!response.ok) {
          throw new Error("Error al buscar lugares");
        }

        const data = await response.json();

        const places: PlaceSuggestion[] =
          data.results?.map((result: any) => ({
            name: result.name || result.formatted,
            address: result.formatted,
            placeId: result.place_id,
            categories: result.category?.split(",") || [],
          })) || [];

        setSuggestions(places);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        toast.error("Error al buscar lugares");
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(() => {
      if (searchTerm) {
        fetchSuggestions();
      }
    }, 500);

    return () => clearTimeout(debounce);
  }, [searchTerm, selectedCategory]);

  const handleSelectPlace = (place: PlaceSuggestion) => {
    form.setValue("title", place.name);
    form.setValue("location", place.address);

    // Detectar categoría basada en las categorías del lugar
    if (place.categories && place.categories.length > 0) {
      const categories = place.categories.join(",");
      if (categories.includes("museum")) {
        form.setValue("category", "museum");
        setSelectedCategory("museum");
      } else if (categories.includes("restaurant")) {
        form.setValue("category", "restaurant");
        setSelectedCategory("restaurant");
      } else if (categories.includes("shopping")) {
        form.setValue("category", "shopping");
        setSelectedCategory("shopping");
      } else if (categories.includes("beach")) {
        form.setValue("category", "beach");
        setSelectedCategory("beach");
      } else if (categories.includes("natural")) {
        form.setValue("category", "nature");
        setSelectedCategory("nature");
      } else if (categories.includes("entertainment")) {
        form.setValue("category", "entertainment");
        setSelectedCategory("entertainment");
      } else if (
        categories.includes("nightclub") ||
        categories.includes("bar")
      ) {
        form.setValue("category", "nightlife");
        setSelectedCategory("nightlife");
      } else if (categories.includes("sport")) {
        form.setValue("category", "sport");
        setSelectedCategory("sport");
      } else if (categories.includes("tourism")) {
        form.setValue("category", "sightseeing");
        setSelectedCategory("sightseeing");
      } else {
        form.setValue("category", "other");
        setSelectedCategory("other");
      }
    }

    setOpen(false);
    setSearchTerm(place.name);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    form.setValue("category", value);
  };

  async function onSubmit(data: ActivityFormValues) {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/itinerario/${itineraryId}/actividades`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...data,
            price: data.price ? parseFloat(data.price) : null,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al crear la actividad");
      }

      toast.success("Actividad añadida correctamente");
      form.reset();
      onSuccess?.();
    } catch (error) {
      toast.error("Error al crear la actividad");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <FormLabel>Categoría</FormLabel>
          <Select onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una categoría" />
            </SelectTrigger>
            <SelectContent>
              {activityCategories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <FormLabel>Buscar lugar</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {searchTerm || "Buscar museo, restaurante, etc."}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput
                  placeholder="Buscar lugar..."
                  value={searchTerm}
                  onValueChange={setSearchTerm}
                />
                <CommandList>
                  {isSearching && (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="ml-2">Buscando...</span>
                    </div>
                  )}
                  <CommandEmpty>No se encontraron resultados.</CommandEmpty>
                  <CommandGroup>
                    {suggestions.map((place) => (
                      <CommandItem
                        key={place.placeId}
                        onSelect={() => handleSelectPlace(place)}
                      >
                        <div>
                          <p className="font-medium">{place.name}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {place.address}
                          </p>
                          {place.categories && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {place.categories.slice(0, 3).join(", ")}
                            </p>
                          )}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título de la actividad</FormLabel>
              <FormControl>
                <Input placeholder="Visita al museo" {...field} />
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
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Detalles sobre la actividad..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ubicación</FormLabel>
              <FormControl>
                <Input placeholder="Dirección o lugar" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha y hora de inicio</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha y hora de fin (opcional)</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Precio (€)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="15.00"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Añadiendo..." : "Añadir Actividad"}
        </Button>
      </form>
    </Form>
  );
}
