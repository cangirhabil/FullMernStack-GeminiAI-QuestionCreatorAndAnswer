"use client";

import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Brain, X, Sparkles } from "lucide-react";
import { AuthForm } from "@/components/auth/auth-form";
import { useAuth } from "@/components/providers/auth-provider";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { UserMenu } from "@/components/ui/user-menu";
import { useLang } from "@/components/providers/lang-provider";

export const MainHeader = () => {
  const { user } = useAuth();
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { mode?: string } | undefined;
      if (detail?.mode === 'register' || detail?.mode === 'login') {
        setMode(detail.mode as 'login' | 'register');
      }
      setOpen(true);
    };
    window.addEventListener('open-auth-modal', handler as EventListener);
    return () => window.removeEventListener('open-auth-modal', handler as EventListener);
  }, []);

  return (
    <header className="w-full border-b border-gray-200/60 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center gap-4">
        {/* Left cluster */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="flex items-center gap-2 group cursor-pointer select-none">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center shadow-sm">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent tracking-tight">
                {t("appTitle")}
              </span>
              <span className="text-[10px] uppercase font-medium text-blue-600 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> AI
              </span>
            </div>
          </div>

          {!user && (
            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={() => { setMode("login"); setOpen(true); }}
                className="px-3 py-1.5 text-sm font-medium rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                {t("auth_login")}
              </button>
              <button
                onClick={() => { setMode("register"); setOpen(true); }}
                className="px-3 py-1.5 text-sm font-medium rounded-lg border border-blue-300/60 text-blue-700 bg-white hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              >
                {t("auth_register")}
              </button>
            </div>
          )}
        </div>

        {/* Right cluster */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          {user && <UserMenu />}
        </div>
      </div>

      {/* Auth Modal */}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in" />
          <Dialog.Content className="fixed inset-0 flex items-center justify-center p-4">
            <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl border border-gray-200/70 overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="absolute top-2 right-2">
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="px-6 pt-6 pb-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">
                  {mode === "login" ? t("auth_loginTitle") : t("auth_registerTitle")}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  {mode === "login" ? t("auth_requiredDesc") : t("auth_registerTitle")}
                </p>
              </div>
              <div className="p-6">
                {/* AuthForm manages its own internal mode; we show a toggle to sync user intent */}
                <AuthForm />
                <div className="mt-4 text-center text-xs text-gray-600">
                  {mode === 'login' ? (
                    <button
                      onClick={() => setMode('register')}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {t("auth_noAccountRegister")}
                    </button>
                  ) : (
                    <button
                      onClick={() => setMode('login')}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {t("auth_haveAccountLogin")}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </header>
  );
};

export default MainHeader;
