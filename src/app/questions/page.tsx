"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { useLang } from "@/components/providers/lang-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Brain, Calendar, Hash, ExternalLink, ArrowLeft, Sparkles, Zap, FileText } from "lucide-react";

interface QuestionSetSummary {
  _id: string;
  title: string;
  totalQuestions: number;
  createdAt: string;
}

export default function QuestionsPage() {
  const { user, loading } = useAuth();
  const { t } = useLang();
  const router = useRouter();
  const [data, setData] = useState<QuestionSetSummary[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && user) {
      (async () => {
        setFetching(true);
        try {
          const res = await fetch("/api/questions");
          const json = await res.json();
          if (res.ok) setData(json.questionSets || []);
        } finally {
          setFetching(false);
        }
      })();
    }
  }, [loading, user]);

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 font-medium">{t("stats_loadingStats")}</p>
        </div>
      </div>
    );
    
  if (!user) 
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto">
            <Brain className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">{t("auth_required")}</h2>
          <p className="text-gray-600">{t("auth_requiredDesc")}</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="border-b border-gray-200/50 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("back")}
            </Button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                {t("questions_title")}
              </h1>
              <p className="text-gray-600 text-sm">{t("questions_subtitle")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-7xl mx-auto p-6">
        {/* Loading State */}
        {fetching && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-600">{t("loading")}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!fetching && data.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">{t("questions_noSetsTitle")}</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {t("questions_noSetsDesc")}
            </p>
            <Button 
              onClick={() => router.push('/')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {t("questions_createFirstSet")}
            </Button>
          </div>
        )}

        {/* Question Sets Grid */}
        {!fetching && data.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {t("questions_yourSets")} ({data.length})
                </h2>
                <p className="text-sm text-gray-600">{t("ql_aiGeneratedWithModel")}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.map((qs, index) => (
                <Card 
                  key={qs._id} 
                  className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-gray-200/50 bg-white/90 backdrop-blur-sm"
                  onClick={() => router.push(`/questions/${qs._id}`)}
                >
                  <CardHeader className="p-6 pb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Brain className="w-6 h-6 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {qs.title}
                        </CardTitle>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(qs.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Hash className="w-3 h-3" />
                            {qs.totalQuestions} {t("questions_count")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6 pt-0 space-y-4">
                    {/* Tags */}
                    <div className="flex items-center gap-2">
                      <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-md">
                        <Zap className="w-3 h-3" />
                        {t("ug_aiGenerated")}
                      </div>
                      <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-md">
                        <Sparkles className="w-3 h-3" />
                        {t("ug_ragEnhanced")}
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button 
                      className="w-full group-hover:bg-blue-600 group-hover:text-white transition-colors"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/questions/${qs._id}`);
                      }}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      {t("ql_viewDetails")}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
