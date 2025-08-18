"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

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

  const fetchQuestionSets = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/questions");
      const data = await res.json();
      if (res.ok) {
        setQuestionSets(data.questionSets || []);
      }
    } catch {
      toast.error("Soru setleri alınamadı");
    } finally {
      setLoading(false);
    }
  };

  const deleteQuestionSet = async (id: string) => {
    if (!confirm("Bu soru setini silmek istiyor musunuz?")) return;
    try {
      const res = await fetch(`/api/questions?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Silme başarısız");
      toast.success("Silindi");
      setQuestionSets((qs) => qs.filter((q) => q._id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Silme hatası";
      toast.error(message);
    }
  };

  useEffect(() => {
    fetchQuestionSets();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Son Soru Setleri</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading && <Spinner />}
        {!loading && questionSets.length === 0 && (
          <p className="text-sm text-muted-foreground">Henüz soru seti yok.</p>
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
                  {new Date(qs.createdAt).toLocaleString()} •{" "}
                  {qs.totalQuestions} soru
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push(`/questions/${qs._id}`)}
                >
                  Görüntüle
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteQuestionSet(qs._id)}
                >
                  Sil
                </Button>
              </div>
            </li>
          ))}
        </ul>
        {questionSets.length > 5 && (
          <Button variant="secondary" onClick={() => router.push("/questions")}>
            Tümünü Gör
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
