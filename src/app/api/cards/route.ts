import { prisma }
from "@/lib/prisma";

import {
  getServerSession,
} from "next-auth";

import {
  authOptions,
} from "@/auth";

import {
  NextResponse,
} from "next/server";

export async function POST(
  req: Request
) {
  const session =
    await getServerSession(
      authOptions
    );

  if (!session?.user?.email) {
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

  const body =
    await req.json();

  const {
    language,
    word,
    translation,
    mnemonic,
  } = body;

  const user =
    await prisma.user.findUnique(
      {
        where: {
          email:
            session.user
              .email,
        },
      }
    );

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

  const savedWord =
    await prisma.word.create(
      {
        data: {
          language,
          text: word,
          translation,
        },
      }
    );

  await prisma.card.create({
    data: {
      userId: user.id,
      wordId:
        savedWord.id,
      mnemonic,
      nextReview:
        new Date(),
    },
  });

  return NextResponse.json(
    {
      success: true,
    }
  );
}