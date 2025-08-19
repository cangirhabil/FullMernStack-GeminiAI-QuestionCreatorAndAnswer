"use client";
import { useLang } from "@/components/providers/lang-provider";
import type { Locale } from "@/i18n";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLang();
  const onChange = (v: string) => setLocale(v as Locale);
  return (
    <Select value={locale} onValueChange={onChange}>
      <SelectTrigger className="w-[110px] h-8 text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="tr">Türkçe</SelectItem>
        <SelectItem value="nl">Nederlands</SelectItem>
      </SelectContent>
    </Select>
  );
}
