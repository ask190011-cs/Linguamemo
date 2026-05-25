"use client";

import Link from "next/link";
import { useEffect } from "react";
import { signOut, useSession }
from "next-auth/react";
import { useRouter }
from "next/navigation";
import { useState }
from "react";
import ReviewCalendar
from "./ReviewCalendar";

export default function Dashboard() {
  const router = useRouter();

  const {
    data: session,
    status,
  } = useSession();

  const [selectedDeck,
    setSelectedDeck] =
    useState(
      "spanish-core-1000"
    );

  const [batchSize,
    setBatchSize] =
    useState(25);
  
  async function addDeck() {
    
    const response =
      await fetch(
        "/api/add-deck",
        {
          method:
            "POST",
  
          headers: {
            "Content-Type":
              "application/json",
          },
  
          body:
            JSON.stringify({
                deckId:
                selectedDeck,
                batchSize,
            }),
        }
      );
  
    const data =
      await response.json();
  
    alert(
      `Added ${data.added} words`
    );
  }

  useEffect(() => {
    if (
      status ===
      "unauthenticated"
    ) {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  

  return (
    <main className="min-h-screen p-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <p className="text-sm text-gray-500">
            Welcome back
          </p>

          <h1 className="text-5xl font-bold tracking-tight">
            Dashboard
          </h1>

          <p className="mt-3 text-gray-500">
            Signed in as{" "}
            {
              session?.user
                ?.email
            }
          </p>
        </div>
        
        {/* dashboard cards*/}
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          <Link
            href="/add-word"
            className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition"
          >
            <p className="text-sm text-gray-500 mb-2">
              Vocabulary
            </p>

            <h2 className="text-2xl font-semibold">
              Add Word
            </h2>

            <p className="mt-3 text-gray-500">
              Create a new
              language card
            </p>
          </Link>

          <Link
            href="/my-words"
            className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition"
          >
            <p className="text-sm text-gray-500 mb-2">
              Library
            </p>

            <h2 className="text-2xl font-semibold">
              My Words
            </h2>

            <p className="mt-3 text-gray-500">
              Browse saved
              vocabulary
            </p>
          </Link>

          <Link
            href="/study"
            className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition"
          >
            <p className="text-sm text-gray-500 mb-2">
              Practice
            </p>

            <h2 className="text-2xl font-semibold">
              Study
            </h2>

            <p className="mt-3 text-gray-500">
              Review due cards
            </p>
          </Link>

          <button
            onClick={() =>
              signOut({
                callbackUrl:
                  "/login",
              })
            }
            className="bg-[#111827] text-white rounded-3xl p-8 text-left hover:bg-[#1f2937]"
          >
            <p className="text-sm opacity-70 mb-2">
              Session
            </p>

            <h2 className="text-2xl font-semibold">
              Logout
            </h2>

            <p className="mt-3 opacity-70">
              End current
              session
            </p>
          </button>
        </div>

        {/*language deck*/}
        <div className="mt-10 bg-white border border-gray-200 rounded-[32px] p-8 shadow-sm">
            <p className="text-sm text-gray-500 mb-2">
                Language Decks
            </p>

            <h2 className="text-2xl font-semibold mb-6">
                Add Vocabulary
            </h2>

            <div className="flex flex-wrap gap-4 items-center">
                <select
                value={
                    selectedDeck
                }
                onChange={(e) =>
                    setSelectedDeck(
                    e.target.value
                    )
                }
                className="border border-gray-200 rounded-2xl px-4 py-3 bg-white"
                >
                <option value="spanish-core-1000">
                    Spanish Core 1000
                </option>
                </select>

                <select
                value={batchSize}
                onChange={(e) =>
                    setBatchSize(
                    Number(
                        e.target.value
                    )
                    )
                }
                className="border border-gray-200 rounded-2xl px-4 py-3 bg-white"
                >
                <option value={10}>
                    10 words
                </option>

                <option value={25}>
                    25 words
                </option>

                <option value={50}>
                    50 words
                </option>
                </select>

                <button
                onClick={addDeck}
                className="bg-[#111827] text-white px-6 py-3 rounded-2xl"
                >
                Add Words
                </button>
            </div>
        </div>


        <div className="mt-10">
            <ReviewCalendar />
        </div>
      </div>
    </main>

    
  );
}