import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prismadb";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("No autorizado", { status: 401 });
    }

    const body = await req.json();
    const { name, address, checkIn, checkOut, price } = body;

    if (!name || !address || !checkIn || !checkOut) {
      return new NextResponse("Faltan campos requeridos", { status: 400 });
    }

    // Verificar que el usuario es propietario o colaborador del itinerario
    const itinerary = await prisma.itinerary.findUnique({
      where: {
        id: params.id,
      },
      include: {
        owner: true,
        collaborators: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!itinerary) {
      return new NextResponse("Itinerario no encontrado", { status: 404 });
    }

    const isOwner = itinerary.owner.email === session.user.email;
    const isCollaborator = itinerary.collaborators.some(
      (collaborator) => collaborator.user.email === session.user.email
    );

    if (!isOwner && !isCollaborator) {
      return new NextResponse("No autorizado", { status: 401 });
    }

    const lodging = await prisma.lodging.create({
      data: {
        name,
        address,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        price: price ? parseFloat(price) : null,
        itineraryId: params.id,
      },
    });

    return NextResponse.json(lodging);
  } catch (error) {
    console.error("[LODGINGS_POST]", error);
    return new NextResponse("Error interno", { status: 500 });
  }
}
