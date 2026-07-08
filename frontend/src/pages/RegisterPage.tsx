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
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  
});
type FormValues = z.infer<typeof schema>;

export const RegisterPage = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    
  });

  const onSubmit = async (values: FormValues) => {
  setServerError(null);

  try {
      // include role in the payload passed to registerUser
      await registerUser({ ...values, role: "TEAM_MEMBER" });

    // registration successful → go to login page
    navigate("/login");

  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } };
    //console.log("Register error:", error.response?.data || err);

    setServerError(
      error.response?.data?.message ||
      "Registration failed. Try again."
    );
  }
};

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-sunken px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl font-semibold text-ink">Create your account</h1>
          <p className="mt-1 text-sm text-ink-soft">Start logging your weekly work</p>
        </div>

        <div className="rounded-xl border border-slate-200/70 bg-white p-6 shadow-card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {serverError && <ErrorState message={serverError} />}
            <Input label="Full name" placeholder="Jane Doe" error={errors.name?.message} {...register("name")} />
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
              placeholder="At least 6 characters"
              error={errors.password?.message}
              {...register("password")}
            />
            
            <Button type="submit" className="w-full "  isLoading={isSubmitting}>
              Create account
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-ink-soft">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-brand-700 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
