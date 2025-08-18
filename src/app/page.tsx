"use client";

import { AuthForm } from "@/components/auth/auth-form";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/components/providers/auth-provider";
import { UploadAndGenerate } from "@/components/dashboard/upload-and-generate";
import { QuestionSetList } from "@/components/dashboard/question-set-list";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
        <AuthForm />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b px-6 h-14 flex items-center justify-between bg-background/80 backdrop-blur">
        <h1 className="font-semibold">Interview Question Creator</h1>
        <div className="flex items-center gap-3 text-sm">
          <span className="hidden sm:inline text-muted-foreground">
            {user.email}
          </span>
          <Button variant="outline" size="sm" onClick={logout}>
            Çıkış
          </Button>
        </div>
      </header>
      <main className="flex-1 container mx-auto p-6 grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <UploadAndGenerate />
          <QuestionSetList />
        </div>
        <aside className="space-y-4">
          <div className="p-4 rounded border text-sm text-muted-foreground">
            <p className="font-medium mb-1">Not</p>
            <p>
              Vercel üzerinde kalıcı dosya depolama için harici bir object
              storage (S3 vb.) yapılandırılmalıdır. Şu anki demo local disk
              kullanır.
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}
