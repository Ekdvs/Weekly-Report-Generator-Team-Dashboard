import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { ErrorState } from "../components/ui/Primitives";
import { Input } from "../components/ui/FormFields";
import { Button } from "../components/ui/Button";


const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
type FormValues = z.infer<typeof schema>;

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      const user = await login(values.email, values.password);
      navigate(user.role === "MANAGER" ? "/dashboard" : "/reports");
    } catch (err: any) {
      setServerError(err.response?.data?.message || "Login failed. Try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-sunken px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid h-11 w-11 grid-cols-3 gap-[3px] rounded-xl bg-nav p-2.5">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <span
                key={i}
                className={i % 2 === 0 ? "h-1 w-1 rounded-full bg-brand-500" : "h-1 w-1 rounded-full bg-brand-300"}
              />
            ))}
          </div>
          <h1 className="font-display text-2xl font-semibold text-ink">Welcome back</h1>
          <p className="mt-1 text-sm text-ink-soft">Sign in to your weekly reports</p>
        </div>

        <div className="rounded-xl border border-slate-200/70 bg-white p-6 shadow-card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {serverError && <ErrorState message={serverError} />}
            <Input
              label="Email"
              type="email"
              placeholder="you@company.com"
              error={errors.email?.message}
              {...register("email")}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register("password")}
            />
            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              Sign in
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-ink-soft">
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-brand-700 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};
