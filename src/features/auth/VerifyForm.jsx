"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ArrowLeft, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/useToast";

export default function VerifyForm() {
  const toast = useToast();
  const router = useRouter();
  const [email, setEmail] = useState("");

  useEffect(() => {
    try {
      const reset = localStorage.getItem("herfa-password-reset-email");
      if (reset) {
        setEmail(reset);
      } else {
        router.push("/auth/forgot-password");
      }
    } catch {}
  }, [router]);

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);

  const handleChange = (element, index) => {
    const value = element.value;
    if (isNaN(value)) return false;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleContinue = () => {
    const code = otp.join("");
    if (!code || code.length < 6) {
      toast.error("Please enter the full 6-digit code");
      return;
    }

    localStorage.setItem("herfa-password-reset-token", code);
    toast.success("Code verified!");
    router.push("/auth/reset-password");
  };

  return (
    <>
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 sm:h-16 sm:w-16">
          <ShieldCheck size={28} />
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-800 sm:text-3xl">
          Verify Code.
        </h2>
        <p className="px-2 text-sm font-light leading-relaxed text-gray-500 sm:px-4">
          Enter the 6-digit code sent to your email to continue resetting your password.
        </p>
        {email && (
          <p className="rounded-full bg-emerald-50 px-4 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-600">
            Code sent to {email}
          </p>
        )}
      </div>

      <form
        className="mt-1 flex flex-col gap-4 sm:mt-2 sm:gap-5"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="grid grid-cols-6 gap-2 sm:gap-3">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              ref={(el) => (inputRefs.current[index] = el)}
              value={data}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onFocus={(e) => e.target.select()}
              className="h-11 w-full rounded-xl border border-transparent bg-gray-100 text-center text-lg font-bold outline-none transition-all duration-300 focus:border-emerald-500/30 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 sm:h-12 sm:text-xl md:h-14 md:text-2xl"
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleContinue}
          className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-emerald-500 py-3 text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-emerald-500/30 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed sm:py-3.5 sm:text-base"
        >
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          <span>Verify & Continue</span>
        </button>
      </form>

      <div className="flex flex-col items-center gap-3 text-center">
        <Link
          href="/auth/forgot-password"
          className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-emerald-500 transition-all duration-300 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Edit Email Address</span>
        </Link>
      </div>
    </>
  );
}
