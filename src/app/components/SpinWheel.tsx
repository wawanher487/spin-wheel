"use client";

import dynamic from "next/dynamic";
import { getAvailablePrizes } from "@/lib/prize";
import { useEffect, useState } from "react";
import { Prize } from "@/types/prize";

const Wheel = dynamic(
  () => import("react-custom-roulette").then((mod) => mod.Wheel),
  { ssr: false }
);

type Props = {
  onFinish: (prize: Prize) => void;
};

export default function SpinWheel({ onFinish }: Props) {
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeIndex, setPrizeIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAvailablePrizes();
      setPrizes(data);
      setLoading(false);
    };

    fetchData();
  }, []);

  // loading state
  if (loading) {
    return <p className="text-center">⏳ Loading hadiah...</p>;
  }

  // jika semua hadiah habis
  if (prizes.length === 0) {
    return <p className="text-center">🎁 Semua hadiah sudah habis</p>;
  }

  const handleSpin = () => {
    if (mustSpin) return; // prevent spam click

    const index = Math.floor(Math.random() * prizes.length);
    setPrizeIndex(index);
    setMustSpin(true);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <Wheel
        mustStartSpinning={mustSpin}
        prizeNumber={prizeIndex}
        data={prizes.map((p) => ({ option: p.item }))}
        onStopSpinning={() => {
          setMustSpin(false);
          onFinish(prizes[prizeIndex]);
        }}
      />

      <button
        onClick={handleSpin}
        disabled={mustSpin}
        className="bg-[var(--color-secondary)] hover:bg-[var(--color-primary)] text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
      >
        {mustSpin ? "Spinning..." : "Spin"}
      </button>
    </div>
  );
}