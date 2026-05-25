import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";

export async function GET() {
  try {
    const session =
      await getServerSession(
        authOptions
      );

    if (
      !session?.user?.email
    ) {
      return NextResponse.json(
        {
          error:
            "Unauthorized",
        },
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
        {
          error:
            "User not found",
        },
        {
          status: 404,
        }
      );
    }

    // Delete cards first
    await prisma.card.deleteMany({
      where: {
        userId:
          user.id,
      },
    });

    // Delete orphaned words
    await prisma.word.deleteMany();

    return NextResponse.json({
      success: true,
      message:
        "Words cleared",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to clear words",
      },
      {
        status: 500,
      }
    );
  }
}