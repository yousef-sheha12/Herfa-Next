"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Mail, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import AuthInput from "@/components/ui/AuthInput";
import { useForgotPassword } from "@/hooks/auth/useAuth";
import { useToast } from "@/hooks/useToast";

export default function ForgotPassForm() {
  const toast = useToast();
  const router = useRouter();
  const { mutateAsync: sendForgotPassword, isPending } = useForgotPassword();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "" },
  });

  const onSubmit = async ({ email }) => {
    try {
      const res = await sendForgotPassword({ email });
      const token = res?.data?.token;
      localStorage.setItem("herfa-password-reset-email", email);
      if (token) {
        localStorage.setItem("herfa-password-reset-token", token);
      }
      toast.success("OTP sent to your email!");
      router.push("/auth/reset-password");
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.title ||
        err?.message ||
        "Email not found";
      setError("email", { type: "manual", message });
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-800 sm:text-3xl">
          Forgot Password?
        </h2>
        <p className="text-gray-500 font-light text-sm leading-relaxed">
          Enter your email address and we&apos;ll send you a recovery code to
          access your account.
        </p>
      </div>

      <form
        className="mt-1 flex flex-col gap-4 sm:mt-2 sm:gap-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <AuthInput
          label="Email Address"
          placeholder="e.g. craftsman@herfa.com"
          icon={Mail}
          type="email"
          error={errors.email?.message}
          {...register("email")}
        />

        <button
          type="submit"
          disabled={isPending}
          className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-emerald-500 py-3 text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-primary/30 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed sm:py-3.5 sm:text-base"
        >
          {isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          )}
          <span>{isPending ? "Sending..." : "Send OTP Code"}</span>
        </button>
      </form>

      <div className="flex flex-col items-center gap-3 text-center">
        <Link
          href="/auth/login"
          className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-emerald-500 transition-all duration-300 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Login</span>
        </Link>
      </div>
    </>
  );
}
