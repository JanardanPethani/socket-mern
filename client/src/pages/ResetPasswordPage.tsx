import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthForm } from "@/components/AuthForm";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import ShinyText from "@/components/animated/ShinyText";

const resetSchema = z
  .object({
    password: z.string().min(5, "Password must be at least 5 characters"),
    confirmPassword: z.string().min(5, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetFormData = z.infer<typeof resetSchema>;

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export function ResetPasswordPage() {
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });
  const query = useQuery();
  const token = query.get("token");

  const onSubmit = async (data: ResetFormData) => {
    setError(null);
    setSuccess(null);
    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }
    try {
      await axios.post(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:8000/api"
        }/auth/reset-password`,
        { token, password: data.password },
        { withCredentials: true }
      );
      setSuccess("Your password has been reset. You can now sign in.");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to reset password. Please try again."
      );
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-12">
      <CardHeader>
        <CardTitle className="text-2xl">Reset Password</CardTitle>
      </CardHeader>
      <CardContent>
        {success ? (
          <div>
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-sm">
              {success}{" "}
            </div>
            <Link to="/auth/login" className="ml-2">
              <ShinyText text="Sign in" className="underline" />
            </Link>
          </div>
        ) : (
          <AuthForm
            form={form}
            onSubmit={onSubmit}
            error={error}
            submitLabel="Reset Password"
            footerContent={
              <div className="text-sm text-muted-foreground">
                Remembered your password?{" "}
                <Link to="/auth/login" className="hover:underline font-medium">
                  <ShinyText text="Sign in" className="underline" />
                </Link>
              </div>
            }
          >
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-1"
                >
                  New Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...form.register("password")}
                  autoFocus
                />
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium mb-1"
                >
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  {...form.register("confirmPassword")}
                />
              </div>
            </form>
          </AuthForm>
        )}
      </CardContent>
    </Card>
  );
}

export default ResetPasswordPage;
