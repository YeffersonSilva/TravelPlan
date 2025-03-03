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

const lodgingFormSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  address: z.string().min(1, "La dirección es requerida"),
  checkIn: z.string().min(1, "La fecha de check-in es requerida"),
  checkOut: z.string().min(1, "La fecha de check-out es requerida"),
  price: z.string().optional(),
});

type LodgingFormValues = z.infer<typeof lodgingFormSchema>;

interface AddLodgingFormProps {
  itineraryId: string;
  onSuccess?: () => void;
}

interface PlaceSuggestion {
  name: string;
  address: string;
  placeId: string;
}

export function AddLodgingForm({
  itineraryId,
  onSuccess,
}: AddLodgingFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LodgingFormValues>({
    resolver: zodResolver(lodgingFormSchema),
    defaultValues: {
      name: "",
      address: "",
      checkIn: "",
      checkOut: "",
      price: "",
    },
  });

  async function onSubmit(data: LodgingFormValues) {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/itinerario/${itineraryId}/alojamientos`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Error al crear el alojamiento");
      }

      toast.success("Alojamiento añadido correctamente");
      form.reset();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error al crear el alojamiento:", error);
      toast.error("Error al crear el alojamiento");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del alojamiento</FormLabel>
              <FormControl>
                <Input placeholder="Hotel Example" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dirección</FormLabel>
              <FormControl>
                <Input placeholder="Calle Example, 123, Ciudad" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="checkIn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Check-in</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="checkOut"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Check-out</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
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
              <FormLabel>Precio (opcional)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="100" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Añadiendo...
            </>
          ) : (
            "Añadir alojamiento"
          )}
        </Button>
      </form>
    </Form>
  );
}
