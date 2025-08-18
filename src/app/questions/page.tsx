"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

interface QuestionSetSummary {
  _id: string;
  title: string;
  totalQuestions: number;
  createdAt: string;
}

export default function QuestionSetsPage() {
  const { user, loading } = useAuth();
  const [data, setData] = useState<QuestionSetSummary[]>([]);
  const [fetching, setFetching] = useState(false);
  const router = useRouter();

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
      <div className="flex justify-center p-10">
        <Spinner />
      </div>
    );
  if (!user) return <div className="p-10 text-center">Giriş gerekli</div>;

  return (
    <div className="container max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Tüm Soru Setleri</h1>
      {fetching && <Spinner />}
      {!fetching && data.length === 0 && <p>Henüz soru seti yok.</p>}
      <div className="grid md:grid-cols-2 gap-4">
        {data.map((qs) => (
          <Card key={qs._id} className="flex flex-col">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-base font-medium">
                {qs.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 flex-1 flex flex-col justify-between">
              <p className="text-xs text-muted-foreground mb-4">
                {new Date(qs.createdAt).toLocaleString()} • {qs.totalQuestions}{" "}
                soru
              </p>
              <Button
                size="sm"
                onClick={() => router.push(`/questions/${qs._id}`)}
              >
                Detay
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
