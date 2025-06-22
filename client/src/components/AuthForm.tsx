import { type ReactNode } from "react";
import { Form } from "./ui/form";
import { type FieldValues, type UseFormReturn } from "react-hook-form";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AuthFormProps<TFormValues extends FieldValues> {
  form: UseFormReturn<TFormValues>;
  onSubmit: (data: TFormValues) => void;
  children: ReactNode;
  error: string | null;
  submitLabel: string;
  title?: string;
  subtitle?: string;
  footerContent?: ReactNode;
}

export function AuthForm<TFormValues extends FieldValues>({
  form,
  onSubmit,
  children,
  error,
  submitLabel,
  title,
  subtitle,
  footerContent,
}: AuthFormProps<TFormValues>) {
  return (
    <Card className="w-full">
      {(title || subtitle) && (
        <CardHeader className="space-y-1">
          {title && <CardTitle className="text-2xl">{title}</CardTitle>}
          {subtitle && <CardDescription>{subtitle}</CardDescription>}
        </CardHeader>
      )}

      <CardContent>
        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md mb-6 text-sm">
            {error}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {children}

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                  Processing...
                </>
              ) : (
                submitLabel
              )}
            </Button>
          </form>
        </Form>
      </CardContent>

      {footerContent && (
        <CardFooter className="flex justify-center">{footerContent}</CardFooter>
      )}
    </Card>
  );
}
