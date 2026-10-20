import { Logo } from "@/components/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-10">
      <div className="mb-6">
        <Logo />
      </div>
      <div className="card w-full max-w-sm">{children}</div>
      <p className="mt-6 text-xs text-stone-400">By Pegasus</p>
    </main>
  );
}
