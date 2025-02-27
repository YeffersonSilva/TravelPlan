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
import { useState } from "react";

const flightFormSchema = z.object({
  airline: z.string().min(1, "La aerolínea es requerida"),
  flightNumber: z.string().min(1, "El número de vuelo es requerido"),
  fromAirport: z.string().min(1, "El aeropuerto de origen es requerido"),
  toAirport: z.string().min(1, "El aeropuerto de destino es requerido"),
  departure: z.string().min(1, "La fecha y hora de salida son requeridas"),
  arrival: z.string().min(1, "La fecha y hora de llegada son requeridas"),
  price: z.string().optional(),
});

type FlightFormValues = z.infer<typeof flightFormSchema>;

interface AddFlightFormProps {
  itineraryId: string;
  onSuccess?: () => void;
}

export function AddFlightForm({ itineraryId, onSuccess }: AddFlightFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FlightFormValues>({
    resolver: zodResolver(flightFormSchema),
    defaultValues: {
      airline: "",
      flightNumber: "",
      fromAirport: "",
      toAirport: "",
      departure: "",
      arrival: "",
      price: "",
    },
  });

  async function onSubmit(data: FlightFormValues) {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/itinerario/${itineraryId}/vuelos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          price: data.price ? parseFloat(data.price) : null,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al crear el vuelo");
      }

      toast.success("Vuelo añadido correctamente");
      form.reset();
      onSuccess?.();
    } catch (error) {
      toast.error("Error al crear el vuelo");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="airline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Aerolínea</FormLabel>
              <FormControl>
                <Input placeholder="Iberia" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="flightNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de vuelo</FormLabel>
              <FormControl>
                <Input placeholder="IB1234" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="fromAirport"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Origen</FormLabel>
                <FormControl>
                  <Input placeholder="MAD" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="toAirport"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Destino</FormLabel>
                <FormControl>
                  <Input placeholder="BCN" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="departure"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salida</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="arrival"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Llegada</FormLabel>
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
                  placeholder="150.00"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Añadiendo..." : "Añadir Vuelo"}
        </Button>
      </form>
    </Form>
  );
}
