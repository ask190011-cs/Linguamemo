"use client";

import { useEffect,
  useState } from "react";

import Calendar
from "react-calendar";

import "react-calendar/dist/Calendar.css";

export default function ReviewCalendar() {
  const [
    reviewDates,
    setReviewDates,
  ] =
    useState<
      Record<
        string,
        number
      >
    >({});

  useEffect(() => {
    async function load() {
      const response =
        await fetch(
          "/api/review-calendar"
        );

      const data =
        await response.json();

      setReviewDates(
        data
      );
    }

    load();
  }, []);

  return (
    <div className="bg-white border border-gray-200 rounded-[32px] p-8 shadow-sm">
      <p className="text-sm text-gray-500 mb-2">
        Upcoming Reviews
      </p>

      <h2 className="text-2xl font-semibold mb-6">
        Study Calendar
      </h2>

      <Calendar
        tileContent={({
          date,
        }) => {
          const key =
            date
              .toISOString()
              .split("T")[0];

          const count =
            reviewDates[
              key
            ];

          if (!count)
            return null;

          return (
            <div className="flex justify-center mt-1">
              <span className="text-xs bg-black text-white rounded-full px-2 py-[2px]">
                {count}
              </span>
            </div>
          );
        }}
      />
    </div>
  );
}