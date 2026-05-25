import { prisma }
from "@/lib/prisma";

import {
  NextResponse,
} from "next/server";

export async function POST(
  req: Request
) {
  try {
    const body =
      await req.json();

    console.log(
      "BODY:",
      body
    );

    const {
      cardId,
    } = body;

    if (!cardId) {
      return NextResponse.json(
        {
          error:
            "Missing cardId",
        },
        {
          status: 400,
        }
      );
    }

    const card =
      await prisma.card.findUnique({
        where: {
          id:
            cardId,
        },

        include: {
          word: true,
        },
      });

    console.log(
      "CARD:",
      card
    );

    if (!card) {
      return NextResponse.json(
        {
          error:
            "Card not found",
        },
        {
          status: 404,
        }
      );
    }

    if (
      card.mnemonic
    ) {
      return NextResponse.json({
        mnemonic:
          card.mnemonic,
      });
    }

    const mnemonic =
      `Imagine "${card.word.text}" meaning "${card.word.translation}" in a vivid scene.`;

    await prisma.card.update({
      where: {
        id:
          card.id,
      },

      data: {
        mnemonic,
      },
    });

    return NextResponse.json({
      mnemonic,
    });
  } catch (error) {
    console.error(
      "MNEMONIC ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to generate mnemonic",
      },
      {
        status: 500,
      }
    );
  }
}