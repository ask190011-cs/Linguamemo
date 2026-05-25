"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
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

  async function handleLogin(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setLoading(true);

    const result =
      await signIn(
        "credentials",
        {
          email,
          password,
          redirect:
            false,
        }
      );

    setLoading(false);

    if (result?.ok) {
      router.push(
        "/dashboard"
      );
    } else {
      alert(
        "Invalid credentials"
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
            Welcome back
          </h2>

          <p className="text-gray-500 mt-2">
            Sign in to continue
          </p>

          <form
            onSubmit={
              handleLogin
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
                ? "Signing in..."
                : "Sign In"}
            </button>
          </form>

          <p className="text-center text-gray-500 mt-8">
            Don’t have an
            account?{" "}
            <Link
              href="/signup"
              className="text-black font-medium"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}