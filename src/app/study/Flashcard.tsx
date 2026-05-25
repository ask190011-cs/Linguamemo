"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const intervals = [
  10 / 1440,
  1,
  3,
  7,
  14,
  30,
  90,
  180,
];

function formatInterval(
  days: number
) {
  if (days < 1) {
    const minutes =
      Math.round(
        days * 1440
      );

    return `${minutes} min`;
  }

  if (days === 1) {
    return "1 day";
  }

  return `${days} days`;
}

export default function Flashcard({
  cards,
}: any) {
  const [index, setIndex] =
    useState(0);

  const [revealed,
    setRevealed] =
    useState(false);

  const [stats,
    setStats] =
    useState({
      again: 0,
      hard: 0,
      good: 0,
      easy: 0,
    });

  const card =
    cards[index];

  const progress =
    ((index + 1) /
      cards.length) *
    100;

  let stage = 0;

  const currentStage =
    intervals.findIndex(
      (i) =>
        i ===
        card.intervalDays
    );

  if (
    currentStage !== -1
  ) {
    stage =
      currentStage;
  }

  const againInterval =
    intervals[0];

  const hardInterval =
    intervals[stage];

  const goodInterval =
    intervals[
      Math.min(
        stage + 1,
        intervals.length - 1
      )
    ];

  const easyInterval =
    intervals[
      Math.min(
        stage + 2,
        intervals.length - 1
      )
    ];

  function speakWord() {
    if (
      typeof window ===
      "undefined"
    ) {
      return;
    }

    speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(
        card.word.text
      );

    // Spanish pronunciation
    utterance.lang =
      "es-ES";

    utterance.rate =
      0.9;

    const voices =
      speechSynthesis.getVoices();

    const spanishVoice =
      voices.find(
        (voice) =>
          voice.lang
            .toLowerCase()
            .includes("es")
      );

    if (
      spanishVoice
    ) {
      utterance.voice =
        spanishVoice;
    }

    speechSynthesis.speak(
      utterance
    );
  }

  async function revealAnswer() {
    try {
      if (
        !card.mnemonic
      ) {
        const response =
          await fetch(
            "/api/generate-card-mnemonic",
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  cardId:
                    card.id,
                }),
            }
          );

        if (
          response.ok
        ) {
          const data =
            await response.json();

          card.mnemonic =
            data.mnemonic;
        }
      }

      setRevealed(true);
    } catch (
      error
    ) {
      console.error(
        error
      );

      setRevealed(true);
    }
  }

  async function handleReview(
    rating: string
  ) {
    await fetch(
      "/api/review",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify({
            cardId:
              card.id,
            rating,
          }),
      }
    );

    setStats((prev) => ({
      ...prev,
      [rating]:
        prev[
          rating as keyof typeof prev
        ] + 1,
    }));

    setRevealed(false);

    if (
      index <
      cards.length - 1
    ) {
      setIndex(
        (prev) =>
          prev + 1
      );
    } else {
      setIndex(
        cards.length
      );
    }
  }

  useEffect(() => {
    function handleKeyDown(
      e: KeyboardEvent
    ) {
      if (
        index >=
        cards.length
      ) {
        return;
      }

      if (
        !revealed &&
        e.code ===
          "Space"
      ) {
        e.preventDefault();

        revealAnswer();
      }

      if (
        revealed
      ) {
        switch (
          e.key
        ) {
          case "1":
            handleReview(
              "again"
            );
            break;

          case "2":
            handleReview(
              "hard"
            );
            break;

          case "3":
            handleReview(
              "good"
            );
            break;

          case "4":
            handleReview(
              "easy"
            );
            break;

          case "p":
          case "P":
            speakWord();
            break;
        }
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
  }, [
    revealed,
    index,
    cards.length,
  ]);

  if (
    index >=
    cards.length
  ) {
    const totalReviewed =
      Object.values(
        stats
      ).reduce(
        (
          a,
          b
        ) => a + b,
        0
      );

    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-[40px] p-12 shadow-sm">
          <p className="text-sm text-gray-500 mb-3">
            Session Complete
          </p>

          <h1 className="text-5xl font-bold tracking-tight mb-6">
            🎉 Nice work
          </h1>

          <p className="text-gray-500 text-lg mb-8">
            You reviewed{" "}
            <span className="font-semibold text-black">
              {
                totalReviewed
              }
            </span>{" "}
            cards.
          </p>

          <Link
            href="/dashboard"
            className="inline-flex bg-[#111827] text-white px-8 py-4 rounded-2xl hover:bg-[#1f2937]"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between mb-3 text-sm text-gray-500">
          <span>
            Progress
          </span>

          <span>
            {index + 1}
            {" / "}
            {cards.length}
          </span>
        </div>

        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#111827] transition-all duration-500"
            style={{
              width:
                `${progress}%`,
            }}
          />
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-200 shadow-sm p-12 min-h-[560px] flex flex-col justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-8">
            Study Session
          </p>

          <div className="flex flex-col items-center">
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight break-words text-center">
              {
                card.word.text
              }
            </h1>

            <button
              onClick={
                speakWord
              }
              className="mt-5 px-5 py-3 rounded-2xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-all"
            >
              🔊 Pronounce
            </button>

            <p className="text-xs text-gray-400 mt-2">
              Press P
            </p>
          </div>
        </div>

        {!revealed ? (
          <div>
            <button
              onClick={
                revealAnswer
              }
              className="w-full bg-[#111827] text-white rounded-[28px] py-5 text-lg font-medium hover:bg-[#1f2937] transition-all"
            >
              Reveal Answer
            </button>

            <p className="text-center text-sm text-gray-400 mt-4">
              Press Space
            </p>
          </div>
        ) : (
          <div>
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">
                Meaning
              </p>

              <p className="text-4xl font-semibold text-gray-900">
                {
                  card.word
                    .translation
                }
              </p>
            </div>

            <div className="mt-8 rounded-[32px] border border-gray-200 bg-gray-50 p-8">
              <p className="text-sm text-gray-500 mb-3">
                Mnemonic
              </p>

              <p className="text-lg leading-8 text-gray-700">
                {
                  card.mnemonic
                }
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {[
                ["again", againInterval, "1", "bg-red-50 border-red-200"],
                ["hard", hardInterval, "2", "bg-orange-50 border-orange-200"],
                ["good", goodInterval, "3", "bg-green-50 border-green-200"],
                ["easy", easyInterval, "4", "bg-blue-50 border-blue-200"],
              ].map(
                ([label, interval, key, colors]: any) => (
                  <button
                    key={
                      label
                    }
                    onClick={() =>
                      handleReview(
                        label
                      )
                    }
                    className={`py-4 rounded-3xl border hover:scale-105 transition-all ${colors}`}
                  >
                    <p className="font-medium capitalize">
                      {
                        label
                      }
                    </p>

                    <p className="text-sm text-gray-500">
                      {formatInterval(interval)}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      Press {key}
                    </p>
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}