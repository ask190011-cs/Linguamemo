"use client";

import Link from "next/link";
import { useRouter }
from "next/navigation";
import { useState }
from "react";

export default function SignupPage() {
  const router =
    useRouter();

  const [email,
    setEmail] =
    useState("");

  const [password,
    setPassword] =
    useState("");

  const [loading,
    setLoading] =
    useState(false);

  async function handleSignup(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setLoading(true);

    const response =
      await fetch(
        "/api/signup",
        {
          method:
            "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body:
            JSON.stringify({
              email,
              password,
            }),
        }
      );

    setLoading(false);

    if (
      response.ok
    ) {
      router.push(
        "/login"
      );
    } else {
      alert(
        "Signup failed"
      );
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-bold tracking-tight">
            LinguaMemo
          </h1>

          <p className="text-gray-500 mt-3">
            Learn languages
            intelligently
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-[32px] p-10 shadow-sm">
          <h2 className="text-3xl font-semibold">
            Create account
          </h2>

          <p className="text-gray-500 mt-2">
            Start learning
            smarter
          </p>

          <form
            onSubmit={
              handleSignup
            }
            className="mt-8 space-y-5"
          >
            <div>
              <label className="text-sm text-gray-500 block mb-2">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target
                      .value
                  )
                }
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500 block mb-2">
                Password
              </label>

              <input
                type="password"
                value={
                  password
                }
                onChange={(e) =>
                  setPassword(
                    e.target
                      .value
                  )
                }
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>

            <button
              className="w-full bg-[#111827] text-white rounded-2xl py-4 hover:bg-[#1f2937]"
            >
              {loading
                ? "Creating account..."
                : "Create Account"}
            </button>
          </form>

          <p className="text-center text-gray-500 mt-8">
            Already have an
            account?{" "}
            <Link
              href="/login"
              className="text-black font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}