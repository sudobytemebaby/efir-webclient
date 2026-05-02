import { useForm } from "@tanstack/react-form";
import { Link } from "@tanstack/react-router";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { FieldGroup } from "@/shared/ui/field";
import { FormField } from "@/shared/ui/form-field";
import { useLogin } from "../auth.queries";
import { loginSchema } from "../auth.schemas";

export function LoginForm() {
  const login = useLogin();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: ({ value }) => {
      login.mutate(value);
    },
  });

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Войти в Efir</CardTitle>
        <CardDescription>Введите email и пароль</CardDescription>
      </CardHeader>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <CardContent className="mb-8">
          <FieldGroup>
            <form.Field
              name="email"
              children={(field) => (
                <FormField
                  field={field}
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  disabled={login.isPending}
                />
              )}
            />
            <form.Field
              name="password"
              children={(field) => (
                <FormField
                  field={field}
                  label="Пароль"
                  type="password"
                  placeholder="********"
                  autoComplete="current-password"
                  disabled={login.isPending}
                />
              )}
            />

            {/* Server error */}
            {login.error && (
              <p className="text-sm text-destructive">{login.error.message}</p>
            )}
          </FieldGroup>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={login.isPending}>
            {login.isPending ? "Вход..." : "Войти"}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            Нет аккаунта?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Зарегистрироваться
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
