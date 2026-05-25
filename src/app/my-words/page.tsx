import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

import { redirect } from "next/navigation";

export default async function MyWordsPage() {
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
      },

      include: {
        word: true,
      },

      orderBy: {
        nextReview: "asc",
      },
    });

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">
        My Words
      </h1>

      <div className="space-y-4">
        {cards.map((card) => (
          <div
            key={card.id}
            className="border p-4 rounded-lg"
          >
            <h2 className="text-xl font-bold">
              {card.word.text}
            </h2>

            <p>
              Language:{" "}
              {
                card.word
                  .language
              }
            </p>

            <p>
              Meaning:{" "}
              {
                card.word
                  .translation
              }
            </p>

            <p>
              Mnemonic:{" "}
              {card.mnemonic}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}