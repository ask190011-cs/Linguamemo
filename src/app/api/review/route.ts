import { prisma }
from "@/lib/prisma";

import {
  NextResponse,
} from "next/server";

const intervals = [
  10 / 1440, // 10 min
  1,         // 1 day
  3,
  7,
  14,
  30,
  90,
  180,
];

export async function POST(
  req: Request
) {
  try {
    const {
      cardId,
      rating,
    } =
      await req.json();

    const card =
      await prisma.card.findUnique({
        where: {
          id:
            cardId,
        },
      });

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

    let stage = 0;

    const currentIndex =
      intervals.findIndex(
        (i) =>
          i ===
          card.intervalDays
      );

    if (
      currentIndex !==
      -1
    ) {
      stage =
        currentIndex;
    }

    switch (
      rating
    ) {
      case "again":
        stage = 0;
        break;

      case "hard":
        stage =
          Math.max(
            0,
            stage
          );
        break;

      case "good":
        stage =
          Math.min(
            stage + 1,
            intervals.length -
              1
          );
        break;

      case "easy":
        stage =
          Math.min(
            stage + 2,
            intervals.length -
              1
          );
        break;
    }

    const intervalDays =
      intervals[
        stage
      ];

    const nextReview =
      new Date();

    nextReview.setMinutes(
      nextReview.getMinutes() +
        intervalDays *
          1440
    );

    await prisma.card.update({
      where: {
        id:
          card.id,
      },

      data: {
        intervalDays,
        nextReview,
      },
    });

    return NextResponse.json({
      success:
        true,

      intervalDays,

      nextReview,
    });
  } catch (
    error
  ) {
    console.error(
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed review",
      },
      {
        status: 500,
      }
    );
  }
}