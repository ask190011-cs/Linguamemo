"use client";

import { useState } from "react";

export default function AddWordPage() {
  const [language, setLanguage] =
    useState("");

  const [word, setWord] =
    useState("");

  const [translation,
    setTranslation] =
    useState("");

  const [mnemonic,
    setMnemonic] =
    useState("");

  const [loading,
    setLoading] =
    useState(false);

  async function handleGenerateMnemonic() {
    try {
      setLoading(true);

      const response =
        await fetch(
          "/api/generate-mnemonic",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              language,
              word,
              translation,
            }),
          }
        );

      const data =
        await response.json();

      setMnemonic(
        data.mnemonic
      );
    } catch (error) {
      console.error(error);
      alert(
        "Failed to generate mnemonic"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    const response =
      await fetch(
        "/api/cards",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({
              language,
              word,
              translation,
              mnemonic,
            }),
        }
      );

    if (response.ok) {
      alert("Word added!");

      setLanguage("");
      setWord("");
      setTranslation("");
      setMnemonic("");
    } else {
      alert("Failed to save");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={
          handleSubmit
        }
        className="flex flex-col gap-4 border p-8 rounded-lg w-[450px]"
      >
        <h1 className="text-2xl font-bold">
          Add Word
        </h1>

        <input
          placeholder="Language"
          value={language}
          onChange={(e) =>
            setLanguage(
              e.target.value
            )
          }
          className="border p-2 rounded"
        />

        <input
          placeholder="Word"
          value={word}
          onChange={(e) =>
            setWord(
              e.target.value
            )
          }
          className="border p-2 rounded"
        />

        <input
          placeholder="Meaning"
          value={
            translation
          }
          onChange={(e) =>
            setTranslation(
              e.target.value
            )
          }
          className="border p-2 rounded"
        />

        <button
          type="button"
          onClick={
            handleGenerateMnemonic
          }
          className="border p-2 rounded"
        >
          {loading
            ? "Generating..."
            : "Generate Mnemonic"}
        </button>

        {mnemonic && (
          <div className="border rounded p-4">
            <h2 className="font-bold">
              Mnemonic
            </h2>

            <p>{mnemonic}</p>
          </div>
        )}

        <button className="bg-black text-white p-2 rounded">
          Save Word
        </button>
      </form>
    </main>
  );
}