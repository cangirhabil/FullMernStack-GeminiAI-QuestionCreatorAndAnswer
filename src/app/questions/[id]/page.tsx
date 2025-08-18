"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { saveAs } from "file-saver";

interface Question {
  question: string;
  answer: string;
  difficulty: string;
  category: string;
}
interface QuestionSet {
  _id: string;
  title: string;
  questions: Question[];
  createdAt: string;
}

export default function QuestionSetDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { user, loading } = useAuth();
  const [data, setData] = useState<QuestionSet | null>(null);
  const [fetching, setFetching] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && id) {
      (async () => {
        setFetching(true);
        try {
          const res = await fetch(`/api/questions/${id}`);
          const json = await res.json();
          if (res.ok) setData(json.questionSet);
        } finally {
          setFetching(false);
        }
      })();
    }
  }, [loading, user, id]);

  if (loading)
    return (
      <div className="flex justify-center p-10">
        <Spinner />
      </div>
    );
  if (!user) return <div className="p-10 text-center">Giriş gerekli</div>;
  if (fetching)
    return (
      <div className="flex justify-center p-10">
        <Spinner />
      </div>
    );
  if (!data) return <div className="p-10">Bulunamadı</div>;

  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{data.title}</h1>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              const jsonBlob = new Blob(
                [JSON.stringify(data.questions, null, 2)],
                { type: "application/json" }
              );
              saveAs(jsonBlob, `questions-${data._id}.json`);
            }}
          >
            JSON
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              const header = "question,answer,difficulty,category";
              const rows = data.questions.map((q) =>
                [q.question, q.answer, q.difficulty, q.category]
                  .map((v) => '"' + v.replace(/"/g, '""') + '"')
                  .join(",")
              );
              const csv = [header, ...rows].join("\n");
              const csvBlob = new Blob([csv], {
                type: "text/csv;charset=utf-8;",
              });
              saveAs(csvBlob, `questions-${data._id}.csv`);
            }}
          >
            CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            Geri
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        {data.questions.map((q, idx) => (
          <Card key={idx}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex justify-between items-center">
                <span>Soru {idx + 1}</span>
                <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
                  {q.difficulty}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-medium">{q.question}</p>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {q.answer}
              </p>
              <p className="text-xs text-muted-foreground">
                Kategori: {q.category}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
