"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useLang } from "@/components/providers/lang-provider";
import { useAuth } from "@/components/providers/auth-provider";

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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t("ql_recent")}</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => fetchQuestionSets()}
          disabled={loading || authLoading || !user}
        >
          {t("refresh") || "↻"}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading && <Spinner />}
        {!loading && questionSets.length === 0 && (
          <p className="text-sm text-muted-foreground">{t("ql_none")}</p>
        )}
        <ul className="space-y-3">
          {questionSets.slice(0, 5).map((qs) => (
            <li
              key={qs._id}
              className="flex items-center justify-between gap-2 border rounded p-3"
            >
              <div>
                <p className="font-medium text-sm">{qs.title}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(qs.createdAt).toLocaleString(locale)} •{" "}
                  {qs.totalQuestions} {t("ql_questionsSuffix")}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push(`/questions/${qs._id}`)}
                >
                  {t("ql_view")}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteQuestionSet(qs._id)}
                >
                  {t("ql_delete")}
                </Button>
              </div>
            </li>
          ))}
        </ul>
        {questionSets.length > 5 && (
          <Button variant="secondary" onClick={() => router.push("/questions")}>
            {t("ql_seeAll")}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
