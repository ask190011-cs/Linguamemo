import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { translateWord }
from "@/lib/translateWord";
import { getServerSession }
from "next-auth";

import { authOptions }
from "@/auth";

import { decks }
from "@/data/decks";

import {
    spanishDictionary,
  } from "@/data/decks/spanishDictionary";

export async function POST(
  req: Request
) {
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

    const body =
      await req.json();

    const {
      deckId,
      batchSize,
    } = body;

    const deck =
      decks.find(
        (d) =>
          d.id === deckId
      );

    if (!deck) {
      return NextResponse.json(
        {
          error:
            "Deck not found",
        },
        {
          status: 404,
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

    const existing =
      await prisma.card.findMany({
        where: {
          userId:
            user.id,
        },

        include: {
          word: true,
        },
      });

      const normalizeWord =
      (word: string) =>
        word
          .trim()
          .toLowerCase();
    
    const existingWords =
      new Set(
        existing.map((c) =>
          normalizeWord(
            c.word.text
          )
        )
      );
    
    const seen =
      new Set<string>();
    
    const unseen =
      deck.words.filter(
        (item) => {
          const normalized =
            normalizeWord(
              item.word
            );
    
          // duplicate inside dataset
          if (
            seen.has(
              normalized
            )
          ) {
            return false;
          }
    
          seen.add(
            normalized
          );
    
          // already in DB
          return !existingWords.has(
            normalized
          );
        }
      );

    const toAdd =
      unseen.slice(
        0,
        batchSize
      );

    for (const item of toAdd) {
        const normalized =
          item.word.toLowerCase();

        const wordInfo =
          spanishDictionary[
              normalized
          ] ??
          await translateWord(
            item.word
          );

            const word =
            await prisma.word.create({
                data: {
                language:
                    deck.language,

                text:
                    item.word,

                translation:
                    item.translation ||
                    wordInfo.translation,

                partOfSpeech:
                    wordInfo.partOfSpeech,

                exampleSentence:
                    wordInfo.exampleSentence,

                exampleTranslation:
                    wordInfo.exampleTranslation,
                },
            });

      await prisma.card.create({
        data: {
          userId:
            user.id,
          wordId:
            word.id,
          mnemonic:
            "",
          intervalDays:
            1,
          nextReview:
            new Date(),
        },
      });
    }

    return NextResponse.json({
      added:
        toAdd.length,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to add deck",
      },
      {
        status: 500,
      }
    );
  }
}