"use client";

import { useEffect, useRef, useState } from "react";
import { getRandomQuestion } from "@/lib/question";
import { Question } from "@/types/question";

type Props = {
    onCorrect: () => void;
    onWrong: () => void;
    attempt?: number;
};

export default function Quiz({ onCorrect, onWrong, attempt = 1 }: Props) {
    const [question] = useState<Question>(() => getRandomQuestion());
    const [selected, setSelected] = useState<number | null>(null);
    const [timeLeft, setTimeLeft] = useState(10);
    const [answered, setAnswered] = useState(false);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // HANDLE ANSWER
    const handleAnswer = (index: number) => {
        if (answered) return;

        setAnswered(true);
        setSelected(index);

        if (intervalRef.current) clearInterval(intervalRef.current);

        setTimeout(() => {
        if (index === question.correctIndex) {
            onCorrect();
        } else {
            onWrong();
        }
        }, 800);
    };

    // TIMER TANPA VIOLATE RULE
    useEffect(() => {
        intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
            if (prev <= 1) {
            if (!answered) {
                setAnswered(true);
                onWrong();
            }

            if (intervalRef.current) clearInterval(intervalRef.current);
            return 0;
            }
            return prev - 1;
        });
        }, 1000);

        return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    return (
        <div className="mt-6 bg-white shadow-xl rounded-2xl p-6 max-w-md w-full text-center">

        {/* ATTEMPT */}
        <p className="text-xs text-gray-400 mb-2">
            Kesempatan ke-{attempt}
        </p>

        {/* TIMER BAR */}
        <div className="w-full bg-gray-200 h-2 rounded">
            <div
            className="bg-red-500 h-2 rounded transition-all"
            style={{ width: `${(timeLeft / 10) * 100}%` }}
            />
        </div>

        <p className="text-xs text-gray-500 mt-1">
            ⏱ {timeLeft} detik
        </p>

        {/* QUESTION */}
        <p className="font-bold text-lg text-gray-800 mt-4">
            🇮🇩 {question.question_id}
        </p>

        <p className="text-gray-500 italic mt-2">
            🇬🇧 {question.question_en}
        </p>

        {/* OPTIONS */}
        <div className="mt-6 flex flex-col gap-3">
            {question.options.map((opt, i) => (
            <button
                key={i}
                disabled={answered}
                onClick={() => handleAnswer(i)}
                className={`
                border rounded-lg px-4 py-2 text-left transition
                ${
                    selected === i
                    ? i === question.correctIndex
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    : "bg-[var(--color-primary)] text-white hover:bg-[var(--color-secondary)]"
                }
                `}
            >
                {String.fromCharCode(65 + i)}. {opt}
            </button>
            ))}
        </div>
        </div>
    );
}