"use client";

import { AuthForm } from "@/components/auth/auth-form";
import { useAuth } from "@/components/providers/auth-provider";
import { UploadAndGenerate } from "@/components/dashboard/upload-and-generate";
import { QuestionSetList } from "@/components/dashboard/question-set-list";
import { Button } from "@/components/ui/button";
import { useLang } from "@/components/providers/lang-provider";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { Brain, Sparkles, Zap, Shield } from "lucide-react";
import { useEffect } from "react";
import { useStats } from "@/components/providers/stats-provider";

export default function Home() {
  const { user, loading, logout } = useAuth();
  const { t } = useLang();
  const { stats, loading: statsLoading, refreshStats } = useStats();

  // Fetch user statistics when user logs in
  useEffect(() => {
    if (user) {
      refreshStats();
    }
  }, [user, refreshStats]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center space-y-4">
          <div className="animate-spin w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto"></div>
          <p className="text-gray-600 font-medium">{t("stats_loadingWorkspace")}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-8 mb-16">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                {t("hero_poweredBy")}
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent leading-tight">
                {t("hero_title")}
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {t("hero_subtitle")}
                <span className="text-blue-600 font-semibold"> {t("hero_ragEnhanced")}</span> {t("hero_subtitle2")}
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{t("hero_feature1Title")}</h3>
                <p className="text-gray-600">{t("hero_feature1Desc")}</p>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{t("hero_feature2Title")}</h3>
                <p className="text-gray-600">{t("hero_feature2Desc")}</p>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{t("hero_feature3Title")}</h3>
                <p className="text-gray-600">{t("hero_feature3Desc")}</p>
              </div>
            </div>

            {/* Auth Form */}
            <div className="max-w-md mx-auto">
              <AuthForm />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Modern Header */}
      <header className="border-b border-gray-200/50 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              {t("appTitle")}
            </h1>
            <div className="hidden md:flex items-center gap-2 ml-4">
              <div className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                Gemini 2.5 Flash
              </div>
              <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                RAG Enhanced
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-3 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium">{user.email}</span>
            </div>
            <LanguageSwitcher />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={logout}
              className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
            >
              {t("logout")}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  {t("dashboard_welcome")}
                </h2>
                <p className="text-blue-100 text-lg">
                  {t("dashboard_welcomeDesc")}
                </p>
              </div>
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full"></div>
              <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/5 rounded-full"></div>
            </div>
          </div>

          {/* Dashboard Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Upload & Generate Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{t("dashboard_createTitle")}</h3>
                  </div>
                  <p className="text-gray-600 text-sm">{t("dashboard_createDesc")}</p>
                </div>
                <div className="p-6">
                  <UploadAndGenerate />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{t("dashboard_questionSetsTitle")}</h3>
                  </div>
                  <p className="text-gray-600 text-sm">{t("dashboard_questionSetsDesc")}</p>
                </div>
                <div className="p-6">
                  <QuestionSetList />
                </div>
              </div>
            </div>

            {/* Stats & Info Sidebar */}
            <div className="space-y-6">
              {/* AI Model Info */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{t("dashboard_aiEngine")}</h4>
                    <p className="text-sm text-gray-600">Gemini 2.5 Flash</p>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t("dashboard_processingSpeed")}</span>
                    <span className="font-medium text-green-600">{t("dashboard_ultraFast")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t("dashboard_ragTechnology")}</span>
                    <span className="font-medium text-blue-600">{t("dashboard_active")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t("dashboard_exportFormats")}</span>
                    <span className="font-medium text-purple-600">{t("dashboard_fourTypes")}</span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-2xl border border-gray-200/50 p-6 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-4">{t("dashboard_quickStats")}</h4>
                {statsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-sm">{t("stats_totalSessions")}</span>
                      <span className="font-bold text-xl text-blue-600">
                        {stats.totalSessions.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-sm">{t("stats_questionsGenerated")}</span>
                      <span className="font-bold text-xl text-green-600">
                        {stats.totalQuestions.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-sm">{t("stats_documentsProcessed")}</span>
                      <span className="font-bold text-xl text-purple-600">
                        {stats.documentsProcessed.toLocaleString()}
                      </span>
                    </div>
                    {stats.avgQuestionsPerSession > 0 && (
                      <div className="pt-2 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 text-sm">{t("stats_avgPerSession")}</span>
                          <span className="font-bold text-lg text-orange-600">
                            {stats.avgQuestionsPerSession}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Tips */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200/50">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  {t("dashboard_proTips")}
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>{t("dashboard_tip1")}</li>
                  <li>{t("dashboard_tip2")}</li>
                  <li>{t("dashboard_tip3")}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
