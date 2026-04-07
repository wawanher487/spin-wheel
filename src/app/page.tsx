"use client";

import { useState } from "react";
import RegistrationForm from "./components/RegistrationForm";
import SpinWheel from "./components/SpinWheel";
import Quiz from "./components/Quiz";
import { User } from "@/types/user";
import { Prize } from "@/types/prize";
import { decreasePrizeStock } from "@/lib/prize";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [result, setResult] = useState<Prize | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [stockUpdated, setStockUpdated] = useState(false);
  const [gameKey, setGameKey] = useState(0);
  const [attempt, setAttempt] = useState(1);
  const [showResult, setShowResult] = useState(false);

  const resetGame = () => {
    setUser(null);
    setResult(null);
    setShowQuiz(false);
    setIsCorrect(false);
    setStockUpdated(false);
    setAttempt(1);
    setShowResult(false);
    setGameKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[var(--color-soft)] flex flex-col items-center justify-center px-4">

      {/* HEADER */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-secondary)]">
          🎓 Edu Spin Quiz
        </h1>
        <p className="text-gray-600 mt-2">
          Belajar sambil bermain bersama SEAMEO CECCEP
        </p>
      </div>

      {/* CARD */}
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md">

        {/* FORM */}
        {!user && (
          <RegistrationForm
            onSubmit={(name, email) => {
              setUser({ name, email });
            }}
          />
        )}

        {/* SPIN */}
        {user && !result && (
          <>
            <p className="text-center text-gray-600 mb-4">
              🎯 Halo {user.name}, ayo putar roda keberuntungan!
            </p>

            <SpinWheel
              key={gameKey}
              onFinish={(prize) => {
                setResult(prize);
                setShowQuiz(true);
              }}
            />
          </>
        )}

        {/* QUIZ */}
        {showQuiz && result && (
          <>
            <p className="text-center text-gray-600 mb-4">
              📚 Jawab pertanyaan berikut ya!
            </p>

            <Quiz
              key={attempt}
              attempt={attempt}
              onCorrect={async () => {
                if (stockUpdated) return;

                setIsCorrect(true);
                setShowQuiz(false);
                setShowResult(true);

                if (result) {
                  await decreasePrizeStock(result.item);
                  setStockUpdated(true);
                }
              }}
              onWrong={() => {
                if (attempt === 1) {
                  setAttempt(2);
                } else {
                  setIsCorrect(false);
                  setShowQuiz(false);
                  setShowResult(true);
                }
              }}
            />
          </>
        )}

        {/* RESULT */}
        {showResult && result && (
          <div className="text-center mt-6">
            {isCorrect ? (
              <div className="bg-green-50 border border-green-200 p-4 rounded-xl">
                <h2 className="text-lg font-bold text-green-600">
                  🎉 Selamat {user?.name}!
                </h2>
                <p className="mt-2 text-gray-700">
                  Kamu mendapatkan hadiah:
                </p>
                <p className="text-xl font-semibold text-[var(--color-secondary)] mt-1">
                  {result.item}
                </p>
              </div>
            ) : (
              <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl">
                <h2 className="text-lg font-bold text-orange-500">
                  🎁 Terima kasih sudah mencoba!
                </h2>
                <p className="mt-2 text-gray-700">
                  Kamu tetap mendapatkan hadiah 🎉
                </p>
              </div>
            )}

            <button
              onClick={resetGame}
              className="mt-6 w-full bg-primary hover:bg-secondary text-white py-2 rounded-lg transition"
            >
              Next Peserta
            </button>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <p className="text-xs text-gray-400 mt-6">
        © 2026 SEAMEO CECCEP • Early Childhood Education Program
      </p>
    </div>
  );
}