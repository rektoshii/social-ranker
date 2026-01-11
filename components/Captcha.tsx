"use client";

import { useState, useEffect } from "react";

type CaptchaProps = {
  onVerify: (isValid: boolean) => void;
};

export default function Captcha({ onVerify }: CaptchaProps) {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    generateNewCaptcha();
  }, []);

  function generateNewCaptcha() {
    setNum1(Math.floor(Math.random() * 10) + 1);
    setNum2(Math.floor(Math.random() * 10) + 1);
    setUserAnswer("");
    setError("");
    onVerify(false);
  }

  function handleVerify() {
    const correctAnswer = num1 + num2;
    const userAnswerNum = parseInt(userAnswer);

    if (userAnswerNum === correctAnswer) {
      setError("");
      onVerify(true);
    } else {
      setError("Incorrect answer. Please try again.");
      generateNewCaptcha();
      onVerify(false);
    }
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      handleVerify();
    }
  }

  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Verify you're human
      </label>
      
      <div className="flex items-center gap-3 mb-3">
        <div className="bg-white border border-gray-300 rounded px-4 py-2 font-mono text-lg">
          {num1} + {num2} = ?
        </div>
        <input
          type="number"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyPress={handleKeyPress}
          className="border border-gray-300 rounded px-3 py-2 w-20"
          placeholder="?"
        />
        <button
          onClick={handleVerify}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
        >
          Verify
        </button>
      </div>

      {error && (
        <p className="text-red-600 text-sm">{error}</p>
      )}

      <button
        onClick={generateNewCaptcha}
        className="text-xs text-gray-500 hover:text-gray-700 underline"
      >
        Generate new captcha
      </button>
    </div>
  );
}