import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";

import Flashcard from "./Flashcard";

export default async function StudyPage() {
  const session =
    await getServerSession(
      authOptions
    );

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user =
    await prisma.user.findUnique({
      where: {
        email:
          session.user.email,
      },
    });

  if (!user) {
    redirect("/login");
  }

  const cards =
    await prisma.card.findMany({
      where: {
        userId: user.id,

        nextReview: {
          lte: new Date(),
        },
      },

      include: {
        word: true,
      },
    });

  return (
    <main className="min-h-screen px-6 py-14">
      <div className="max-w-6xl mx-auto">
        {cards.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-[40px] p-16 shadow-sm text-center">
            <p className="text-sm text-gray-500 mb-4">
              Study Session
            </p>

            <h1 className="text-5xl font-bold tracking-tight mb-4">
              No cards due 🎉
            </h1>

            <p className="text-gray-500 text-lg">
              You’re caught up.
              Come back later for
              more review.
            </p>
          </div>
        ) : (
          <Flashcard
            cards={cards}
          />
        )}
      </div>
    </main>
  );
}