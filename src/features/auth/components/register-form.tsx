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
import { useRegister } from "../auth.queries";
import { registerSchema } from "../auth.schemas";

export function RegisterForm() {
  const register = useRegister();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: registerSchema,
    },
    onSubmit: ({ value }) => {
      register.mutate(value);
    },
  });

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Создать аккаунт</CardTitle>
        <CardDescription>Зарегистрируйтесь в Efir</CardDescription>
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
                  disabled={register.isPending}
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
                  placeholder="минимум 8 символов"
                  autoComplete="new-password"
                  disabled={register.isPending}
                />
              )}
            />
            <form.Field
              name="confirmPassword"
              children={(field) => (
                <FormField
                  field={field}
                  label="Подтвердите пароль"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  disabled={register.isPending}
                />
              )}
            />

            {/* Server error */}
            {register.error && (
              <p className="text-sm text-destructive">
                {register.error.message}
              </p>
            )}
          </FieldGroup>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button
            type="submit"
            className="w-full"
            disabled={register.isPending}
          >
            {register.isPending ? "Создание..." : "Зарегистрироваться"}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            Уже есть аккаунт?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Войти
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
