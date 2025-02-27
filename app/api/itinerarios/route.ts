import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prismadb";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { title, description, startDate, endDate, imageUrl } = body;

    if (!title || !startDate || !endDate) {
      return new NextResponse(
        JSON.stringify({
          error: "Faltan campos requeridos",
          details: {
            title: !title ? "El título es requerido" : null,
            startDate: !startDate ? "La fecha de inicio es requerida" : null,
            endDate: !endDate ? "La fecha de fin es requerida" : null,
          },
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Validar que la imagen sea base64 si existe
    if (imageUrl && !imageUrl.startsWith("data:image")) {
      return new NextResponse(
        JSON.stringify({
          error: "Formato de imagen inválido",
          details: "La imagen debe estar en formato base64",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: "Usuario no encontrado" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Convertir las fechas a objetos Date si son strings
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    const itinerary = await prisma.itinerary.create({
      data: {
        title,
        description: description || "",
        imageUrl: imageUrl || "",
        startDate: parsedStartDate,
        endDate: parsedEndDate,
        ownerId: user.id,
      },
    });

    return NextResponse.json(itinerary);
  } catch (error) {
    console.error("[ITINERARIOS_POST]", error);
    return new NextResponse(
      JSON.stringify({
        error: "Error Interno del Servidor",
        details: error instanceof Error ? error.message : "Error desconocido",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
