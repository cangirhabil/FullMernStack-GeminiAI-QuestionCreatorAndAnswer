"use client";

import { AuthForm } from "@/components/auth/auth-form";
import { useAuth } from "@/components/providers/auth-provider";
import { UploadAndGenerate } from "@/components/dashboard/upload-and-generate";
import { QuestionSetList } from "@/components/dashboard/question-set-list";
import { UserMenu } from "@/components/ui/user-menu";
import { ApiKeyWarning } from "@/components/ui/api-key-warning";
import { useLang } from "@/components/providers/lang-provider";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { Brain, Sparkles, Zap, Shield } from "lucide-react";
import { useEffect } from "react";
import { useStats } from "@/components/providers/stats-provider";

export default function Home() {
  const { user, loading } = useAuth();
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
  <div className="container mx-auto px-4 py-16 sm:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-8 mb-16">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                {t("hero_poweredBy")}
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent leading-tight break-words">
                {t("hero_title")}
              </h1>
              
              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-2">
                {t("hero_subtitle")}
                <span className="text-blue-600 font-semibold"> {t("hero_ragEnhanced")}</span> {t("hero_subtitle2")}
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
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
        <div className="container mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent truncate">
              {t("appTitle")}
            </h1>
            <div className="hidden lg:flex items-center gap-2 ml-2 sm:ml-4">
              <div className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                Gemini 2.5 Flash
              </div>
              <div className="px-2 sm:px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                RAG Enhanced
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <LanguageSwitcher />
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Main Content */}
  <main className="container mx-auto p-4 sm:p-6">
        {/* API Key warning (only shown if key missing) */}
        <ApiKeyWarning />
        <div className="max-w-10xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-6 sm:mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden min-w-0">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 break-words">
                  {t("dashboard_welcome")}
                </h2>
                <p className="text-blue-100 text-base sm:text-lg break-words">
                  {t("dashboard_welcomeDesc")}
                </p>
              </div>
              <div className="absolute -right-6 sm:-right-8 -top-6 sm:-top-8 w-24 sm:w-32 h-24 sm:h-32 bg-white/10 rounded-full"></div>
              <div className="absolute -right-2 sm:-right-4 -bottom-2 sm:-bottom-4 w-16 sm:w-20 h-16 sm:h-20 bg-white/5 rounded-full"></div>
            </div>
          </div>

          {/* Dashboard Grid */}
          <div className="grid gap-8 xl:grid-cols-3 min-w-0 w-full">
            {/* Upload & Generate Section */}
            <div className="xl:col-span-2 space-y-6 min-w-0">
              <div className="bg-white rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-lg transition-all duration-300 min-w-0 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-100">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 min-w-0">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{t("dashboard_createTitle")}</h3>
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm break-words">{t("dashboard_createDesc")}</p>
                </div>
                <div className="p-4 sm:p-6">
                  <UploadAndGenerate />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-lg transition-all duration-300 min-w-0 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-100">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 min-w-0">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Brain className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{t("dashboard_questionSetsTitle")}</h3>
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm break-words">{t("dashboard_questionSetsDesc")}</p>
                </div>
                <div className="p-4 sm:p-6">
                  <QuestionSetList />
                </div>
              </div>
            </div>

            {/* Stats & Info Sidebar */}
            <div className="space-y-4 sm:space-y-6 order-first xl:order-none min-w-0 w-full overflow-hidden">
              {/* AI Model Info */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-4 sm:p-6 border border-blue-200/50 min-w-0">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 min-w-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{t("dashboard_aiEngine")}</h4>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">Gemini 2.5 Flash</p>
                  </div>
                </div>
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between items-center gap-2 min-w-0">
                    <span className="text-gray-600 truncate flex-shrink">{t("dashboard_processingSpeed")}</span>
                    <span className="font-medium text-green-600 flex-shrink-0">{t("dashboard_ultraFast")}</span>
                  </div>
                  <div className="flex justify-between items-center gap-2 min-w-0">
                    <span className="text-gray-600 truncate flex-shrink">{t("dashboard_ragTechnology")}</span>
                    <span className="font-medium text-blue-600 flex-shrink-0">{t("dashboard_active")}</span>
                  </div>
                  <div className="flex justify-between items-center gap-2 min-w-0">
                    <span className="text-gray-600 truncate flex-shrink">{t("dashboard_exportFormats")}</span>
                    <span className="font-medium text-purple-600 flex-shrink-0">{t("dashboard_fourTypes")}</span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-2xl border border-gray-200/50 p-4 sm:p-6 shadow-sm min-w-0">
                <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base truncate">{t("dashboard_quickStats")}</h4>
                {statsLoading ? (
                  <div className="flex items-center justify-center py-6 sm:py-8">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between gap-2 min-w-0">
                      <span className="text-gray-600 text-xs sm:text-sm truncate flex-shrink">{t("stats_totalSessions")}</span>
                      <span className="font-bold text-lg sm:text-xl text-blue-600 flex-shrink-0">
                        {stats.totalSessions.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 min-w-0">
                      <span className="text-gray-600 text-xs sm:text-sm truncate flex-shrink">{t("stats_questionsGenerated")}</span>
                      <span className="font-bold text-lg sm:text-xl text-green-600 flex-shrink-0">
                        {stats.totalQuestions.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 min-w-0">
                      <span className="text-gray-600 text-xs sm:text-sm truncate flex-shrink">{t("stats_documentsProcessed")}</span>
                      <span className="font-bold text-lg sm:text-xl text-purple-600 flex-shrink-0">
                        {stats.documentsProcessed.toLocaleString()}
                      </span>
                    </div>
                    {stats.avgQuestionsPerSession > 0 && (
                      <div className="pt-2 border-t border-gray-100">
                        <div className="flex items-center justify-between gap-2 min-w-0">
                          <span className="text-gray-600 text-xs sm:text-sm truncate flex-shrink">{t("stats_avgPerSession")}</span>
                          <span className="font-bold text-base sm:text-lg text-orange-600 flex-shrink-0">
                            {stats.avgQuestionsPerSession}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Tips */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-4 sm:p-6 border border-yellow-200/50 min-w-0">
                <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base truncate">
                  {t("dashboard_proTips")}
                </h4>
                <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-700">
                  <li className="break-words">{t("dashboard_tip1")}</li>
                  <li className="break-words">{t("dashboard_tip2")}</li>
                  <li className="break-words">{t("dashboard_tip3")}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
