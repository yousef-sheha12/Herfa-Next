"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Mail, Lock, LogIn, ArrowRight, Loader2 } from "lucide-react";
import AuthInput from "@/components/ui/AuthInput";
import RoleToggle from "@/components/ui/RoleToggle";
import SocialLogins from "@/components/ui/SocialLogins";
import { useAuth } from "@/hooks/useApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/schemas/auth";
import { useToast } from "@/hooks/useToast";

export default function LoginForm() {
  const [activeRole, setActiveRole] = useState("customer");
  const { login, isAuthenticated, user, loginLoading } = useAuth();
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push(
        user?.role === "artisan" ? "/artisan/dashboard" : "/customer/dashboard",
      );
    }
  }, [isAuthenticated, user, router]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values) => {
    try {
      await login({ email: values.email, password: values.password });
      toast.success("Welcome back!");
      router.push(
        activeRole === "artisan" ? "/artisan/dashboard" : "/customer/dashboard",
      );
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.title ||
        err?.message ||
        "Login failed";
      setError("email", { type: "manual", message });
      toast.error(message);
    }
  };

  return (
    <>
      <motion.div
        className="flex flex-col items-center gap-2 text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-emerald-500 sm:h-14 sm:w-14">
          <LogIn className="h-6 w-6 sm:h-7 sm:w-7" />
        </div>
        <h2 className="text-2xl font-black tracking-tight text-gray-800 sm:text-3xl">
          Welcome Back
        </h2>
        <p className="text-sm font-medium text-gray-400">
          Log in to your Herfa account
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <RoleToggle activeRole={activeRole} setActiveRole={setActiveRole} />
      </motion.div>

      <motion.form
        className="flex flex-col gap-3.5 sm:gap-4"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <AuthInput
          label="Email Address"
          icon={Mail}
          placeholder="name@example.com"
          type="email"
          error={errors.email?.message}
          {...register("email")}
        />

        <div className="flex flex-col gap-3">
          <AuthInput
            label="Password"
            icon={Lock}
            placeholder="Enter your password"
            type="password"
            error={errors.password?.message}
            {...register("password")}
          />
          <Link
            href="/auth/forgot-password"
            className="self-end text-[11px] font-bold tracking-[0.14em] text-emerald-500 hover:underline sm:text-xs sm:tracking-wider"
          >
            Forgot Password?
          </Link>
        </div>

        <motion.button
          type="submit"
          disabled={loginLoading}
          className="group mt-1 flex w-full cursor-pointer items-center justify-center gap-3 rounded-2xl bg-emerald-500 py-3 text-sm font-bold text-white shadow-lg transition-all hover:shadow-emerald-500/30 disabled:opacity-60 disabled:cursor-not-allowed sm:mt-2 sm:py-3.5 sm:text-base"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loginLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          )}
          <span>
            {loginLoading ? "Signing in..." : `Continue as ${activeRole.charAt(0).toUpperCase() + activeRole.slice(1)}`}
          </span>
        </motion.button>
      </motion.form>

      <div className="relative my-1 flex h-px items-center justify-center bg-gray-100">
        <span className="bg-white px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300">
          Or login with
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <SocialLogins />
      </motion.div>

      <p className="text-center text-sm font-medium leading-6 tracking-wide text-gray-500">
        Don't have an account?{" "}
        <Link
          href="/auth/signup"
          className="cursor-pointer font-bold text-emerald-500 transition-all hover:underline underline-offset-4"
        >
          Create account
        </Link>
      </p>
    </>
  );
}
