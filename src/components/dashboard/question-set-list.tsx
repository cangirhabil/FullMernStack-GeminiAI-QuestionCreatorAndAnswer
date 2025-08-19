"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useLang } from "@/components/providers/lang-provider";
import { useAuth } from "@/components/providers/auth-provider";
import { FileText, Calendar, Hash, ExternalLink, Sparkles, Brain, Zap } from "lucide-react";

interface QuestionSetSummary {
  _id: string;
  title: string;
  totalQuestions: number;
  createdAt: string;
  documentId?: { originalName?: string };
}

export function QuestionSetList() {
  const [loading, setLoading] = useState(true);
  const [questionSets, setQuestionSets] = useState<QuestionSetSummary[]>([]);
  const router = useRouter();
  const { t, locale } = useLang();
  const { user, loading: authLoading } = useAuth();

  const fetchQuestionSets = useCallback(async () => {
    if (!user) return; // safety guard
    setLoading(true);
    try {
      const res = await fetch("/api/questions", { cache: "no-store" });
      // If unauthorized (some rare race), retry once after a short delay
      if (res.status === 401) {
        setTimeout(() => {
          fetch("/api/questions", { cache: "no-store" })
            .then((r) =>
              r.json().then((d) => ({ ok: r.ok, status: r.status, data: d }))
            )
            .then(({ ok, data }) => {
              if (ok) setQuestionSets(data.questionSets || []);
            })
            .catch(() => {});
        }, 350);
      }
      const data = await res.json();
      if (res.ok) {
        setQuestionSets(data.questionSets || []);
      } else if (res.status !== 401) {
        toast.error(t("ql_fetchFailed"));
      }
      // Light heuristic: if empty, try a silent refetch once (helps with eventual consistency right after login)
      if (res.ok && (!data.questionSets || data.questionSets.length === 0)) {
        setTimeout(async () => {
          try {
            const r2 = await fetch("/api/questions", { cache: "no-store" });
            if (r2.ok) {
              const d2 = await r2.json();
              if (d2.questionSets?.length) setQuestionSets(d2.questionSets);
            }
          } catch {
            /* ignore silent retry */
          }
        }, 250);
      }
    } catch {
      toast.error(t("ql_fetchFailed"));
    } finally {
      setLoading(false);
    }
  }, [t, user]);

  const deleteQuestionSet = async (id: string) => {
    if (!confirm(t("ql_deleteConfirm"))) return;
    try {
      const res = await fetch(`/api/questions?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("ql_deleteFailed"));
      toast.success(t("ql_deleted"));
      setQuestionSets((qs) => qs.filter((q) => q._id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : t("ql_deleteFailed");
      toast.error(message);
    }
  };

  // Fetch only after auth fully resolved and user present
  useEffect(() => {
    if (!authLoading && user) {
      fetchQuestionSets();
    }
  }, [authLoading, user, fetchQuestionSets]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-900">{t("ql_recent")}</h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => fetchQuestionSets()}
          disabled={loading || authLoading || !user}
          className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {loading ? t("loading") : t("refresh")}
        </Button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <p className="text-sm text-gray-600">{t("ql_loading")}</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && questionSets.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="font-medium text-gray-900 mb-2">{t("ql_none")}</h3>
          <p className="text-sm text-gray-500 mb-4">
            {t("ql_emptyDesc")}
          </p>
        </div>
      )}

      {/* Question Sets Grid */}
      {!loading && questionSets.length > 0 && (
        <div className="space-y-3">
          {questionSets.slice(0, 5).map((qs, index) => (
            <div
              key={qs._id}
              className="group relative bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer"
              onClick={() => router.push(`/questions/${qs._id}`)}
            >
              {/* Content */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                        {qs.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(qs.createdAt).toLocaleDateString(locale)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Hash className="w-3 h-3" />
                          {qs.totalQuestions} {t("ql_questionsSuffix")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex items-center gap-2 mt-3">
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-md">
                      <Zap className="w-3 h-3" />
                      {t("ug_aiGenerated")}
                    </div>
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-md">
                      <Sparkles className="w-3 h-3" />
                      {t("ug_ragEnhanced")}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/questions/${qs._id}`);
                    }}
                    className="h-8 px-3 text-xs hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    {t("ql_view")}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteQuestionSet(qs._id);
                    }}
                    className="h-8 px-3 text-xs hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                  >
                    {t("ql_delete")}
                  </Button>
                </div>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 rounded-xl ring-1 ring-transparent group-hover:ring-blue-200 transition-all pointer-events-none"></div>
            </div>
          ))}

          {/* View All Button */}
          {questionSets.length > 5 && (
            <div className="pt-4">
              <Button 
                variant="outline" 
                onClick={() => router.push("/questions")}
                className="w-full h-11 rounded-xl border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                {t("ql_viewAll")} ({questionSets.length})
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
