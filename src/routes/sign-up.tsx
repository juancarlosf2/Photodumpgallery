import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { authClient } from "~/lib/auth-client";
import { Button, Input } from "@heroui/react";
import { Link } from "~/components/ui/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { UserPlus, Eye, EyeOff } from "lucide-react";

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignUpForm = z.infer<typeof signUpSchema>;

export const Route = createFileRoute("/sign-up")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: search.redirect as string | undefined,
  }),
});

function RouteComponent() {
  const router = useRouter();
  const { redirect } = Route.useSearch();
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignUpForm) => {
    setIsLoading(true);
    setAuthError("");

    try {
      const result = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
      });

      if (result.error) {
        setAuthError(result.error.message || "Sign up failed");
      } else {
        // Redirect to the specified URL or default to home
        if (redirect) {
          window.location.href = redirect;
        } else {
          router.navigate({ to: "/" });
        }
      }
    } catch (err) {
      setAuthError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto relative min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <aside
        className="relative hidden h-full flex-col bg-gradient-to-br from-background to-surface-secondary dark:from-surface dark:to-surface-secondary p-12 text-foreground lg:flex border-r border-border overflow-hidden"
        aria-label="SoundStation branding and platform information"
        role="complementary"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-accent/5 to-transparent dark:from-accent/12 dark:to-accent/5" />
        <div className="absolute top-32 right-32 h-48 w-48 rounded-full bg-gradient-to-br from-accent/20 to-accent/10 dark:from-accent/15 dark:to-accent/8 blur-2xl animate-pulse" />
        <div className="absolute bottom-32 left-32 h-32 w-32 rounded-full bg-gradient-to-br from-accent/12 to-accent/8 dark:from-accent/10 dark:to-accent/6 blur-xl" />

        <header className="relative z-20 flex items-center text-xl font-semibold">
          <div
            className="mr-4 rounded-xl bg-accent-soft p-3 backdrop-blur-sm border border-accent/20 shadow-sm"
            aria-hidden="true"
          >
            <UserPlus className="h-6 w-6 text-accent" />
          </div>
          <h1 className="bg-gradient-to-r from-foreground via-foreground to-accent bg-clip-text text-transparent font-bold">
            SoundStation
          </h1>
        </header>

        <main className="relative z-20 flex-1 flex flex-col justify-center">
          <div className="space-y-8 text-center">
            <h2 className="text-4xl font-bold leading-tight bg-gradient-to-r from-foreground via-foreground to-accent bg-clip-text text-transparent">
              Start creating
            </h2>
            <p className="text-muted-foreground text-lg opacity-85">
              Join thousands of developers sharing knowledge
            </p>

            <div
              className="flex justify-center space-x-8 pt-8"
              role="region"
              aria-label="Platform statistics"
            >
              <div className="text-center">
                <div
                  className="text-2xl font-bold text-foreground"
                  aria-label="50,000 plus creators"
                >
                  50K+
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">
                  Creators
                </div>
              </div>
              <div className="text-center">
                <div
                  className="text-2xl font-bold text-foreground"
                  aria-label="2 million plus videos"
                >
                  2M+
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">
                  Videos
                </div>
              </div>
              <div className="text-center">
                <div
                  className="text-2xl font-bold text-foreground"
                  aria-label="Free forever"
                >
                  Free
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">
                  Forever
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="relative z-20 mt-auto opacity-60">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Start your creator journey today
            </p>
          </div>
        </footer>
      </aside>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[380px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight animate-fadeInUp">
              Create your account
            </h1>
            <p className="text-sm text-muted-foreground animate-fadeInUp animation-delay-100">
              Enter your information below to create your account
            </p>
          </div>
          <div className="grid gap-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-4">
                  {authError && (
                    <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3">
                      <p className="text-sm text-destructive">{authError}</p>
                    </div>
                  )}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your name"
                            type="text"
                            autoComplete="given-name"
                            fullWidth
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="name@example.com"
                            type="email"
                            autoComplete="email"
                            autoCapitalize="none"
                            autoCorrect="off"
                            fullWidth
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative w-full">
                            <Input
                              placeholder="Create a password"
                              type={showPassword ? "text" : "password"}
                              autoComplete="new-password"
                              fullWidth
                              disabled={isLoading}
                              className="w-full pr-10"
                              {...field}
                            />
                            <Button
                              type="button"
                              onPress={() => setShowPassword(!showPassword)}
                              variant="ghost"
                              size="sm"
                              isIconOnly
                              className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-default hover:text-foreground transition-colors"
                              isDisabled={isLoading}
                              aria-label={
                                showPassword ? "Hide password" : "Show password"
                              }
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    isDisabled={isLoading}
                    type="submit"
                    variant="primary"
                    className="w-full transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] font-medium"
                  >
                    {isLoading && (
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    )}
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </div>
              </form>
            </Form>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              type="button"
              isDisabled={isLoading}
              className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] border-muted-foreground/20 hover:border-muted-foreground/40"
            >
              {isLoading ? (
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              ) : (
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              Continue with Google
            </Button>
          </div>
          <p className="px-8 text-center text-sm text-muted-foreground">
            <Link
              to="/sign-in"
              className="underline underline-offset-4 hover:text-primary"
              search={{
                redirect: undefined,
              }}
            >
              Already have an account? Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
