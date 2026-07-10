"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  BadgeCheck,
  Loader2,
} from "lucide-react";
import AuthInput from "@/components/ui/AuthInput";
import RoleToggle from "@/components/ui/RoleToggle";
import SocialLogins from "@/components/ui/SocialLogins";
import { signupSchema } from "@/lib/schemas/auth";
import { useRegister } from "@/hooks/auth/useAuth";
import { useGetCategories } from "@/hooks/category/useCategory";
import { useCreateArtisanProfile } from "@/hooks/artisan/useArtisan";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/useToast";

export default function SignUpForm() {
  const toast = useToast();
  const [activeRole, setActiveRole] = useState("customer");
  const router = useRouter();
  const { mutateAsync: registerUser, isPending: registerLoading } =
    useRegister();
  const { data: categoriesData, isLoading: categoriesLoading } = useGetCategories();
  const { mutateAsync: createProfile, isPending: profileCreating } =
    useCreateArtisanProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      nationalId: "",
      serviceCategory: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values) => {
    const payload = {
      userName: values.fullName,
      email: values.email,
      password: values.password,
      role: activeRole === "artisan" ? 2 : 3,
    };

    try {
      const response = await registerUser(payload);
      const userId = response?.data?.user?.id || response?.user?.id;

      if (activeRole === "artisan" && userId && values.serviceCategory) {
        try {
          await createProfile({
            userId,
            categoryId: Number(values.serviceCategory),
            nationalId: values.nationalId,
          });
        } catch {
          toast.info(
            "Account created but profile setup failed. You can complete it later.",
          );
        }
      }

      toast.success("Account created!");
      router.push("/auth/login");
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.title ||
        error?.message ||
        "Registration failed";
      const isDuplicate =
        /email/i.test(message) &&
        /(already|exist|duplicate|taken)/i.test(message);
      if (isDuplicate) {
        const roleHint = /artisan/i.test(message)
          ? "an Artisan"
          : /customer|client/i.test(message)
            ? "a Customer"
            : null;
        if (roleHint) {
          toast.error(
            `This email is already registered as ${roleHint}. You cannot register with the same email for a different role. Please log in or use a different email.`,
          );
        } else {
          const tryingAs = activeRole === "artisan" ? "an Artisan" : "a Customer";
          toast.error(
            `This email is already registered as ${tryingAs}. You cannot register the same email as a different role. Please log in or use a different email.`,
          );
        }
      } else {
        toast.error(message);
      }
    }
  };
  return (
    <>
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-800 sm:text-3xl">
          Create Account.
        </h2>
        <p className="text-sm font-light leading-relaxed text-gray-500">
          Join the Herfa community as an artisan or a customer.
        </p>
      </div>

      <RoleToggle activeRole={activeRole} setActiveRole={setActiveRole} />

      <form
        className="flex flex-col gap-3.5 sm:gap-4"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <div className="grid gap-3.5 md:flex-col md:gap-4">
          <AuthInput
            label="Full Name"
            placeholder="e.g. Yousef Sheha"
            icon={User}
            type="text"
            error={errors.fullName?.message}
            {...register("fullName")}
          />

          <AuthInput
            label="Email Address"
            placeholder="e.g. craftsman@herfa.com"
            icon={Mail}
            type="email"
            error={errors.email?.message}
            {...register("email")}
          />
        </div>

        {activeRole === "artisan" && (
          <div className="space-y-3.5">
            <div className="rounded-[1.4rem] border border-emerald-100 bg-emerald-50/60 p-3 sm:p-4">
              <AuthInput
                label="National ID"
                placeholder="784-1998-XXXXX (15 digits)"
                icon={BadgeCheck}
                type="text"
                error={errors.nationalId?.message}
                {...register("nationalId")}
              />
            </div>
            <div className="rounded-[1.4rem] border border-blue-100 bg-blue-50/60 p-3 sm:p-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Service Category *
              </label>
              <select
                {...register("serviceCategory")}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400/50 bg-white"
                defaultValue=""
              >
                <option value="" disabled>
                  {categoriesLoading
                    ? "Loading categories..."
                    : "Select your main service"}
                </option>
                {categoriesData?.map((cat) => (
                  <option key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.serviceCategory && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.serviceCategory.message}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="grid gap-3.5 md:flex-col md:gap-4">
          <AuthInput
            label="Password"
            placeholder="Enter your password"
            icon={Lock}
            type="password"
            error={errors.password?.message}
            {...register("password")}
          />

          <AuthInput
            label="Confirm Password"
            placeholder="Confirm your password"
            icon={Lock}
            type="password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
        </div>

        <button
          type="submit"
          disabled={registerLoading || profileCreating}
          className="group mt-1 flex w-full cursor-pointer items-center justify-center gap-3 rounded-2xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-primary/30 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed sm:mt-2 sm:py-3.5 sm:text-base"
        >
          {registerLoading || profileCreating ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          )}
          <span>
            {registerLoading
              ? "Creating account..."
              : profileCreating
                ? "Setting up profile..."
                : `Sign Up as ${activeRole.charAt(0).toUpperCase() + activeRole.slice(1)}`}
          </span>
        </button>
      </form>

      <div className="flex items-center gap-4 py-1">
        <div className="h-[1px] flex-1 bg-gray-100" />
        <span className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
          OR JOIN WITH
        </span>
        <div className="h-[1px] flex-1 bg-gray-100" />
      </div>

      <SocialLogins />

      <p className="text-center text-sm font-medium leading-6 tracking-wide text-gray-500">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="cursor-pointer font-bold text-emerald-500 transition-all hover:underline underline-offset-4"
        >
          Log In instead
        </Link>
      </p>
    </>
  );
}
