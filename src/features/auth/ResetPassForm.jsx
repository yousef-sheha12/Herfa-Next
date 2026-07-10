"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Lock, ArrowRight, ShieldAlert, Loader2 } from "lucide-react";
import AuthInput from "@/components/ui/AuthInput";
import { useResetPassword } from "@/hooks/auth/useAuth";
import { useToast } from "@/hooks/useToast";

export default function ResetPassForm() {
  const toast = useToast();
  const router = useRouter();
  const { mutateAsync: resetPass, isPending } = useResetPassword();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  useEffect(() => {
    const email = localStorage.getItem("herfa-password-reset-email");
    const token = localStorage.getItem("herfa-password-reset-token");
    if (!email || !token) {
      router.push("/auth/forgot-password");
    }
  }, [router]);

  const onSubmit = async ({ newPassword, confirmPassword }) => {
    if (newPassword.length < 6) {
      setError("newPassword", {
        type: "manual",
        message: "Password must be at least 6 characters.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match.",
      });
      return;
    }

    const email = localStorage.getItem("herfa-password-reset-email");
    const token = localStorage.getItem("herfa-password-reset-token");

    if (!email || !token) {
      toast.error("Session expired. Please start over.");
      router.push("/auth/forgot-password");
      return;
    }

    try {
      await resetPass({ email, token, newPassword });
      localStorage.removeItem("herfa-password-reset-email");
      localStorage.removeItem("herfa-password-reset-token");
      toast.success("Password reset successfully!");
      router.push("/auth/login");
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.title ||
        err?.message ||
        "Password reset failed";
      setError("newPassword", { type: "manual", message });
    }
  };

  return (
    <>
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent sm:h-16 sm:w-16">
          <ShieldAlert size={28} />
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-800 sm:text-3xl">
          Reset Password.
        </h2>
        <p className="px-2 text-sm font-light leading-relaxed text-gray-500">
          Enter your new password to reset your account.
        </p>
      </div>

      <form
        className="mt-1 flex flex-col gap-3.5 sm:mt-2 sm:gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <AuthInput
          label="New Password"
          placeholder="********"
          icon={Lock}
          type="password"
          error={errors.newPassword?.message}
          {...register("newPassword")}
        />

        <AuthInput
          label="Confirm New Password"
          placeholder="********"
          icon={Lock}
          type="password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <button
          type="submit"
          disabled={isPending}
          className="group mt-1 flex w-full items-center justify-center gap-3 rounded-2xl bg-emerald-500 py-3 text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-primary/30 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed sm:mt-2 sm:py-3.5 sm:text-base"
        >
          {isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          )}
          <span>{isPending ? "Updating..." : "Update Password"}</span>
        </button>
      </form>
    </>
  );
}
