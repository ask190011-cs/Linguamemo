import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function GET() {
  const session =
    await getServerSession(
      authOptions
    );

  if (
    !session?.user?.email
  ) {
    return NextResponse.json(
      [],
      {
        status: 401,
      }
    );
  }

  const user =
    await prisma.user.findUnique({
      where: {
        email:
          session.user.email,
      },
    });

  if (!user) {
    return NextResponse.json(
      []
    );
  }

  const cards =
    await prisma.card.findMany({
      where: {
        userId: user.id,
      },

      select: {
        nextReview: true,
      },
    });

  const grouped: Record<
    string,
    number
  > = {};

  cards.forEach(
    (card) => {
      const date =
        card.nextReview
          .toISOString()
          .split("T")[0];

      grouped[date] =
        (grouped[
          date
        ] || 0) + 1;
    }
  );

  return NextResponse.json(
    grouped
  );
}