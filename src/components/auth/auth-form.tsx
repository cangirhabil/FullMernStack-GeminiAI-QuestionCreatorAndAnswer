"use client";

import React, { useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useLang } from "@/components/providers/lang-provider";
import { Label } from "@/components/ui/label";
import { Brain, Mail, Lock, User, Sparkles } from "lucide-react";

export function AuthForm() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { t } = useLang();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto border-0 shadow-2xl bg-white/90 backdrop-blur-lg">
      <CardHeader className="text-center space-y-4 pb-6 sm:pb-8 px-4 sm:px-6">
        <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
          <Brain className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
        </div>
        <div>
          <CardTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            {mode === "login" ? "Welcome Back" : "Join AI Creator"}
          </CardTitle>
          <p className="text-gray-600 mt-2 text-sm sm:text-base px-2">
            {mode === "login" 
              ? "Sign in to your intelligent question creator" 
              : "Create your account and start generating questions"
            }
          </p>
        </div>
      </CardHeader>
      
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-8">
          {mode === "register" && (
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <User className="w-4 h-4" />
                {t("auth_name")}
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-10 sm:h-12 px-3 sm:px-4 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all text-sm sm:text-base"
                placeholder="Enter your full name"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              {t("auth_email")}
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-10 sm:h-12 px-3 sm:px-4 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all text-sm sm:text-base"
              placeholder="Enter your email address"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              {t("auth_password")}
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="h-10 sm:h-12 px-3 sm:px-4 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all text-sm sm:text-base"
              placeholder="Enter your password (min. 6 characters)"
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-3 sm:gap-4 px-4 sm:px-8 pb-6 sm:pb-8">
          <Button 
            type="submit" 
            disabled={submitting} 
            className="w-full h-10 sm:h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 text-sm sm:text-base"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {t("auth_submitting")}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                {mode === "login" ? t("auth_login") : t("auth_register")}
              </>
            )}
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            className="w-full h-8 sm:h-10 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors text-sm sm:text-base"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
          >
            {mode === "login"
              ? t("auth_noAccountRegister")
              : t("auth_haveAccountLogin")}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
