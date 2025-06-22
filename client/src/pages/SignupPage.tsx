import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/authApi";
import { useAuthStore } from "../store/useAuthStore";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { AxiosError } from "axios";
import { Input } from "@/components/ui/input";
import { AuthForm } from "@/components/AuthForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const signupSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(5, "Password must be at least 5 characters"),
    confirmPassword: z.string().min(5, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const { control } = form;

  const signupMutation = useMutation({
    mutationFn: (data: Omit<SignupFormData, "confirmPassword">) =>
      authApi.register(data),
    onSuccess: (user) => {
      setUser(user);
      navigate("/");
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        setError(error.response?.data?.message || "Signup failed.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    },
  });

  const onSubmit = (data: SignupFormData) => {
    setError(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...registerData } = data;
    signupMutation.mutate(registerData);
  };

  return (
    <AuthForm
      form={form}
      onSubmit={onSubmit}
      error={error}
      submitLabel="Create Account"
      title="Create an Account"
      subtitle="Join our community and start sharing your moments"
      footerContent={
        <div className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/auth/login"
            className="text-primary hover:underline font-medium"
          >
            Sign in
          </Link>
        </div>
      }
    >
      <FormField
        control={control}
        name="username"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input placeholder="Choose a username" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="name@example.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input type="password" placeholder="••••••••" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Confirm Password</FormLabel>
            <FormControl>
              <Input type="password" placeholder="••••••••" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </AuthForm>
  );
}
