"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { dictionaries, Locale } from "@/i18n";

interface LangContextValue {
  locale: Locale;
  t: (key: keyof (typeof dictionaries)[Locale]) => string;
  setLocale: (l: Locale) => void;
}

const LangContext = createContext<LangContextValue | undefined>(undefined);

const STORAGE_KEY = "app.locale";
const DEFAULT_LOCALE: Locale = "tr"; // default Turkish for existing user base

export const LangProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    const stored =
      typeof window !== "undefined"
        ? (localStorage.getItem(STORAGE_KEY) as Locale | null)
        : null;
    if (stored && dictionaries[stored]) setLocale(stored);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const change = (l: Locale) => {
    setLocale(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {}
  };

  const t: LangContextValue["t"] = (key) => {
    const dict = dictionaries[locale] as Record<string, string>;
    return dict[key as string] || key;
  };

  return (
    <LangContext.Provider value={{ locale, t, setLocale: change }}>
      {children}
    </LangContext.Provider>
  );
};

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
