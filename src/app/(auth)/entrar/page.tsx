import { AuthForm } from "../auth-form";

export default async function SignInPage({ searchParams }: PageProps<"/entrar">) {
  const { erro } = await searchParams;
  return (
    <AuthForm
      mode="entrar"
      notice={erro === "link" ? "O link de confirmação expirou ou já foi usado. Tente entrar com sua senha." : undefined}
    />
  );
}
