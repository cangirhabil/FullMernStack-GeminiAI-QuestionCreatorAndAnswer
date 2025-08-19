"use client";

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        {/* Hero Section */}
        <section className="relative py-20 sm:py-28 lg:py-36 overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50" />
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-32 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-indigo-200/15 rounded-full blur-3xl" />
          
          <div className="relative container mx-auto px-4 sm:px-6">
            <div className="max-w-5xl mx-auto text-center space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-blue-200/50 px-4 py-2 rounded-full shadow-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">{t("hero_poweredBy")}</span>
              </div>

              {/* Main heading */}
              <div className="space-y-6">
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                  <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent leading-tight">
                    {t("hero_title")}
                  </span>
                  <br className="hidden sm:block" />
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    with AI Power
                  </span>
                </h1>
                <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  {t("hero_subtitle")} <span className="font-semibold text-blue-600">{t("hero_ragEnhanced")}</span> {t("hero_subtitle2")}
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode: 'register' } }))}
                  className="group relative px-8 py-4 rounded-2xl text-white font-semibold bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg hover:shadow-xl transition-all overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    {t("auth_register")} - It's Free
                  </span>
                </button>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode: 'login' } }))}
                  className="px-8 py-4 rounded-2xl font-semibold border border-gray-300 bg-white/80 backdrop-blur hover:bg-white shadow hover:shadow-md transition-all"
                >
                  {t("auth_login")}
                </button>
              </div>

              {/* Tech Stack */}
              <div className="pt-8">
                <p className="text-sm text-gray-500 mb-4">Built with modern technologies</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {['Next.js 15', 'TypeScript', 'Gemini 2.5 Flash', 'RAG', 'MongoDB', 'Tailwind'].map(tech => (
                    <span key={tech} className="px-3 py-1 bg-white/60 backdrop-blur border border-gray-200 rounded-full text-xs font-medium text-gray-700 shadow-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white/50 backdrop-blur">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Why Choose Our Platform?
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Experience the next generation of AI-powered question generation with cutting-edge technology
                </p>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {[
                  { 
                    icon: Brain, 
                    title: t("hero_feature1Title"), 
                    desc: t("hero_feature1Desc"),
                    gradient: "from-blue-500 to-cyan-500",
                    bgGradient: "from-blue-50 to-cyan-50"
                  },
                  { 
                    icon: Zap, 
                    title: t("hero_feature2Title"), 
                    desc: t("hero_feature2Desc"),
                    gradient: "from-purple-500 to-pink-500",
                    bgGradient: "from-purple-50 to-pink-50"
                  },
                  { 
                    icon: Shield, 
                    title: t("hero_feature3Title"), 
                    desc: t("hero_feature3Desc"),
                    gradient: "from-emerald-500 to-teal-500",
                    bgGradient: "from-emerald-50 to-teal-50"
                  }
                ].map((feature, i) => (
                  <div key={i} className={`group relative rounded-3xl bg-gradient-to-br ${feature.bgGradient} p-8 border border-gray-200/50 hover:shadow-xl transition-all duration-500 overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16" />
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-white shadow-lg mb-6`}>
                      <feature.icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
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
                  { step: '01', title: 'Upload Document', desc: 'Upload your PDF or text files. Our advanced parser extracts and segments content intelligently.', icon: '📄' },
                  { step: '02', title: 'AI Processing', desc: 'RAG technology retrieves relevant context while Gemini 2.5 Flash crafts precise, contextual questions.', icon: '🤖' },
                  { step: '03', title: 'Export & Use', desc: 'Download in multiple formats: JSON, CSV, PDF, or exam-ready documents. Perfect for interviews.', icon: '📋' }
                ].map((step, i) => (
                  <div key={i} className="relative group">
                    <div className="bg-white rounded-3xl p-8 border border-gray-200/50 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                      <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-100/50 to-purple-100/50 rounded-full blur-xl" />
                      
                      <div className="relative">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="text-2xl">{step.icon}</div>
                          <div>
                            <div className="text-sm font-mono text-blue-600 tracking-wider mb-1">STEP {step.step}</div>
                            <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                          </div>
                        </div>
                        <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                      </div>
                      
                      {/* Connection line */}
                      {i < 2 && (
                        <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-200 to-purple-200" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Export Formats */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Export in Any Format
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto mb-12">
                Professional outputs ready for learning platforms, HR workflows, and assessment boards
              </p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { format: 'JSON', desc: 'Machine-readable structured data for API integrations', icon: '{ }', color: 'blue' },
                  { format: 'CSV', desc: 'Spreadsheet-friendly format for easy editing and review', icon: '📊', color: 'green' },
                  { format: 'PDF', desc: 'Beautiful printable documents with professional formatting', icon: '📄', color: 'red' },
                  { format: 'Exam', desc: 'Assessment-ready exam sheets with answer keys included', icon: '📝', color: 'purple' }
                ].map((item, i) => (
                  <div key={i} className="group bg-white rounded-2xl p-6 border border-gray-200/50 shadow-sm hover:shadow-lg transition-all">
                    <div className="text-3xl mb-4">{item.icon}</div>
                    <h3 className="font-semibold text-gray-900 mb-2">{item.format}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">{item.desc}</p>
                    <div className={`h-1 w-full rounded-full bg-gradient-to-r from-${item.color}-400 to-${item.color}-600`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-purple-600/90" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
          
          <div className="relative container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto text-center text-white">
              <h2 className="text-3xl sm:text-5xl font-bold mb-6">
                Ready to Transform Your 
                <br className="hidden sm:block" />
                Interview Process?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join thousands who are already using AI to create smarter, more effective interview questions
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode: 'register' } }))}
                  className="px-8 py-4 rounded-2xl font-semibold bg-white text-blue-600 hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all"
                >
                  Start Creating Questions Now
                </button>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { mode: 'login' } }))}
                  className="px-8 py-4 rounded-2xl font-semibold border border-white/30 text-white hover:bg-white/10 transition-all"
                >
                  Sign In to Your Account
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-300">
          <div className="container mx-auto px-4 sm:px-6 py-12">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-4 gap-8 mb-8">
                <div className="md:col-span-2">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-white">Interview Question Creator</span>
                  </div>
                  <p className="text-gray-400 mb-4 max-w-md">
                    Harness the power of AI to generate intelligent, contextual interview questions from your documents.
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Powered by Gemini 2.5 Flash</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-white mb-4">Platform</h4>
                  <ul className="space-y-2 text-sm">
                    <li><a href="#" className="hover:text-white transition">Features</a></li>
                    <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                    <li><a href="#" className="hover:text-white transition">Documentation</a></li>
                    <li><a href="#" className="hover:text-white transition">API</a></li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-white mb-4">Support</h4>
                  <ul className="space-y-2 text-sm">
                    <li><a href="#" className="hover:text-white transition">Help Center</a></li>
                    <li><a href="#" className="hover:text-white transition">Contact</a></li>
                    <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                    <li><a href="#" className="hover:text-white transition">Terms</a></li>
                  </ul>
                </div>
              </div>
              
              <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-sm text-gray-400">
                  © {new Date().getFullYear()} Interview Question Creator. All rights reserved.
                </p>
                <div className="flex items-center gap-6 text-sm">
                  <span className="text-gray-400">Made with ❤️ using RAG + AI</span>
                </div>
              </div>
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
