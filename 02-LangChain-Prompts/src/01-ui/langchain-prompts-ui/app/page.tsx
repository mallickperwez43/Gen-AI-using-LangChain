"use client";

import { useState } from "react";

const papers = [
  "Attention Is All You Need",
  "BERT: Pre-training of Deep Bidirectional Transformers",
  "GPT-3: Language Models are Few-Shot Learners",
  "Diffusion Models Beat GANs on Image Synthesis",
];

const styles = [
  "Beginner-Friendly",
  "Technical",
  "Code-Oriented",
  "Mathematical",
];

const lengths = [
  "Short (1-2 paragraphs)",
  "Medium (3-5 paragraphs)",
  "Long (detailed explanation)",
];

export default function Home() {
  const [paperInput, setPaperInput] = useState(papers[0]);
  const [styleInput, setStyleInput] = useState(styles[0]);
  const [lengthInput, setLengthInput] = useState(lengths[0]);

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    setLoading(true);
    setResult("");

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paperInput,
          styleInput,
          lengthInput,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setResult(data.result);
    } catch (error) {
      console.error(error);

      setResult(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="mx-auto max-w-2xl">

        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Research Tool
          </h1>

          <p className="mt-3 text-gray-600">
            Generate a customized research paper summary.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">

          {/* Paper */}
          <div>
            <label
              htmlFor="paper"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Select Research Paper Name
            </label>

            <select
              id="paper"
              value={paperInput}
              onChange={(e) => setPaperInput(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
            >
              {papers.map((paper) => (
                <option key={paper} value={paper}>
                  {paper}
                </option>
              ))}
            </select>
          </div>

          {/* Style */}
          <div>
            <label
              htmlFor="style"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Select Explanation Style
            </label>

            <select
              id="style"
              value={styleInput}
              onChange={(e) => setStyleInput(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
            >
              {styles.map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>
          </div>

          {/* Length */}
          <div>
            <label
              htmlFor="length"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Select Explanation Length
            </label>

            <select
              id="length"
              value={lengthInput}
              onChange={(e) => setLengthInput(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
            >
              {lengths.map((length) => (
                <option key={length} value={length}>
                  {length}
                </option>
              ))}
            </select>
          </div>

          {/* Button */}
          <button
            onClick={handleSummarize}
            disabled={loading}
            className="w-full rounded-xl bg-black px-4 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Summarizing..." : "Summarize"}
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Summary
            </h2>

            <div className="whitespace-pre-wrap leading-7 text-gray-700">
              {result}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}