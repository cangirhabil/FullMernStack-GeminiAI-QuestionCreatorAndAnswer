"use client";

import { AuthForm } from "@/components/auth/auth-form";
import { useAuth } from "@/components/providers/auth-provider";
import { UploadAndGenerate } from "@/components/dashboard/upload-and-generate";
import { QuestionSetList } from "@/components/dashboard/question-set-list";
import { UserMenu } from "@/components/ui/user-menu";
import { ApiKeyWarning } from "@/components/ui/api-key-warning";
import { useLang } from "@/components/providers/lang-provider";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { Brain, Sparkles, Zap, Shield, ArrowRight, CheckCircle, FileText, Cpu, Download } from "lucide-react";
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              
              {/* Left Side - Hero Content */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-4 py-2 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">{t("hero_poweredBy")}</span>
                  </div>
                  
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                    <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      {t("hero_title")}
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      with Smart AI
                    </span>
                  </h1>
                  
                  <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                    {t("hero_subtitle")} <span className="font-semibold text-blue-600">{t("hero_ragEnhanced")}</span> {t("hero_subtitle2")}
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-4">
                  {[
                    { icon: CheckCircle, text: "Upload PDF documents instantly" },
                    { icon: Cpu, text: "RAG-enhanced AI processing" },
                    { icon: FileText, text: "Multiple export formats" },
                    { icon: Download, text: "Professional question sets" }
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <feature.icon className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">{feature.text}</span>
                    </div>
                  ))}
                </div>

                {/* Tech Stack */}
                <div className="pt-4">
                  <p className="text-sm text-gray-500 mb-3">Powered by</p>
                  <div className="flex flex-wrap gap-2">
                    {['Next.js 15', 'Gemini 2.5', 'RAG', 'MongoDB'].map(tech => (
                      <span key={tech} className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side - Auth Form */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-200/30 to-purple-200/30 blur-3xl rounded-3xl" />
                <div className="relative">
                  <AuthForm />
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="mt-24">
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Why Choose Our Platform?
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Advanced AI technology meets user-friendly design for the ultimate question generation experience
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    icon: Brain,
                    title: t("hero_feature1Title"),
                    desc: t("hero_feature1Desc"),
                    gradient: "from-blue-500 to-blue-600",
                    bg: "bg-blue-50"
                  },
                  {
                    icon: Zap,
                    title: t("hero_feature2Title"),
                    desc: t("hero_feature2Desc"),
                    gradient: "from-purple-500 to-purple-600",
                    bg: "bg-purple-50"
                  },
                  {
                    icon: Shield,
                    title: t("hero_feature3Title"),
                    desc: t("hero_feature3Desc"),
                    gradient: "from-emerald-500 to-emerald-600",
                    bg: "bg-emerald-50"
                  }
                ].map((feature, i) => (
                  <div key={i} className={`${feature.bg} rounded-2xl p-8 border border-gray-200/50 hover:shadow-lg transition-all group`}>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* How It Works */}
            <div className="mt-24">
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  How It Works
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Generate professional interview questions in three simple steps
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { step: "01", title: "Upload", desc: "Upload your PDF documents and let our parser extract the content", emoji: "📄" },
                  { step: "02", title: "Process", desc: "RAG technology and Gemini 2.5 Flash work together to understand context", emoji: "🔍" },
                  { step: "03", title: "Export", desc: "Get professional question sets in multiple formats ready for use", emoji: "📋" }
                ].map((item, i) => (
                  <div key={i} className="relative text-center">
                    <div className="bg-white rounded-2xl p-8 border border-gray-200/50 shadow-sm hover:shadow-lg transition-all">
                      <div className="text-4xl mb-4">{item.emoji}</div>
                      <div className="text-sm font-mono text-blue-600 mb-2">STEP {item.step}</div>
                      <h3 className="text-xl font-semibold mb-3 text-gray-900">{item.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                    </div>
                    {i < 2 && (
                      <div className="hidden md:block absolute top-1/2 -right-4 z-10">
                        <ArrowRight className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Export Formats */}
            <div className="mt-24 bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl p-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Multiple Export Formats
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Choose the perfect format for your workflow and platform requirements
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { format: "JSON", desc: "Structured data for APIs and integrations", icon: "{ }", color: "blue" },
                  { format: "CSV", desc: "Spreadsheet format for easy editing", icon: "📊", color: "green" },
                  { format: "PDF", desc: "Professional printable documents", icon: "📄", color: "red" },
                  { format: "Exam", desc: "Ready-to-use exam formats", icon: "📋", color: "purple" }
                ].map((item, i) => (
                  <div key={i} className="bg-white rounded-xl p-6 border border-gray-200/50 text-center hover:shadow-lg transition-all">
                    <div className="text-2xl mb-3">{item.icon}</div>
                    <h3 className="font-semibold text-gray-900 mb-2">{item.format}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white/80 backdrop-blur mt-24">
          <div className="container mx-auto px-4 sm:px-6 py-12">
            <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-bold text-gray-900">Interview Question Creator</span>
                </div>
                <p className="text-gray-600 mb-4 max-w-md">
                  Transform your documents into intelligent interview questions with the power of AI and RAG technology.
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>Powered by Gemini 2.5 Flash</span>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>Features</li>
                  <li>API</li>
                  <li>Documentation</li>
                  <li>Support</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>About</li>
                  <li>Privacy</li>
                  <li>Terms</li>
                  <li>Contact</li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-500">
              © {new Date().getFullYear()} Interview Question Creator. Made with ❤️ using Next.js and AI.
            </div>
          </div>
        </footer>
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
