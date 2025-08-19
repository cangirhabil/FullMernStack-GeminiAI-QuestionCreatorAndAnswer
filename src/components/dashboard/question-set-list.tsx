"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useLang } from "@/components/providers/lang-provider";

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

  const fetchQuestionSets = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/questions");
      const data = await res.json();
      if (res.ok) {
        setQuestionSets(data.questionSets || []);
      } else {
        toast.error(t("ql_fetchFailed"));
      }
    } catch {
      toast.error(t("ql_fetchFailed"));
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    fetchQuestionSets();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("ql_recent")}</CardTitle>
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
