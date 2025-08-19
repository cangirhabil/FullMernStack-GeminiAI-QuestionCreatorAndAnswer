"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ExportButtons } from "@/components/ui/export-buttons";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Hash, Brain, Tag } from "lucide-react";

interface Question {
  question: string;
  answer: string;
  difficulty: string;
  category: string;
  cognitive_level?: string;
  keywords?: string[];
  assessment_criteria?: string;
  follow_up_potential?: string;
  industry_relevance?: string;
}

interface QuestionSet {
  _id: string;
  title: string;
  questions: Question[];
  createdAt: string;
  totalQuestions: number;
  metadata?: {
    generationMethod?: string;
    aiModel?: string;
    documentLength?: number;
    ragEnabled?: boolean;
  };
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
  if (!data) return <div className="p-10">Question set not found</div>;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCognitiveLevelColor = (level: string) => {
    const colors = {
      'Remember': 'bg-blue-50 text-blue-700',
      'Understand': 'bg-green-50 text-green-700',
      'Apply': 'bg-yellow-50 text-yellow-700',
      'Analyze': 'bg-orange-50 text-orange-700',
      'Evaluate': 'bg-red-50 text-red-700',
      'Create': 'bg-purple-50 text-purple-700',
    };
    return colors[level as keyof typeof colors] || 'bg-gray-50 text-gray-700';
  };

  return (
    <div className="container max-w-6xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <h1 className="text-3xl font-bold">{data.title}</h1>
          </div>
          
          {/* Export Buttons */}
          <ExportButtons questionSet={data} />
        </div>

        {/* Question Set Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Hash className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Total Questions:</span>
            <Badge variant="secondary">{data.questions.length}</Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Created:</span>
            <span className="text-sm text-muted-foreground">
              {new Date(data.createdAt).toLocaleDateString()}
            </span>
          </div>

          {data.metadata?.aiModel && (
            <div className="flex items-center space-x-2">
              <Brain className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">AI Model:</span>
              <Badge variant="outline" className="text-xs">
                {data.metadata.aiModel}
              </Badge>
            </div>
          )}

          {data.metadata?.ragEnabled && (
            <div className="flex items-center space-x-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                RAG Enhanced
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {data.questions.map((q, idx) => (
          <Card key={idx} className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    {idx + 1}
                  </span>
                  Question {idx + 1}
                </CardTitle>
                
                <div className="flex gap-2 flex-wrap">
                  <Badge className={getDifficultyColor(q.difficulty)}>
                    {q.difficulty.toUpperCase()}
                  </Badge>
                  {q.category && (
                    <Badge variant="outline">
                      {q.category}
                    </Badge>
                  )}
                  {q.cognitive_level && (
                    <Badge className={getCognitiveLevelColor(q.cognitive_level)}>
                      {q.cognitive_level}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Question */}
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">QUESTION:</h4>
                <p className="text-base leading-relaxed">{q.question}</p>
              </div>

              {/* Answer */}
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">ANSWER:</h4>
                <p className="text-sm leading-relaxed whitespace-pre-wrap bg-muted/30 p-3 rounded-md">
                  {q.answer}
                </p>
              </div>

              {/* Enhanced Metadata */}
              {(q.keywords || q.assessment_criteria || q.industry_relevance) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t">
                  {q.keywords && q.keywords.length > 0 && (
                    <div>
                      <h5 className="text-xs font-medium text-muted-foreground mb-1">KEYWORDS:</h5>
                      <div className="flex flex-wrap gap-1">
                        {q.keywords.map((keyword, kidx) => (
                          <Badge key={kidx} variant="secondary" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {q.assessment_criteria && (
                    <div>
                      <h5 className="text-xs font-medium text-muted-foreground mb-1">ASSESSMENT:</h5>
                      <p className="text-xs text-muted-foreground">
                        {q.assessment_criteria}
                      </p>
                    </div>
                  )}

                  {q.industry_relevance && (
                    <div>
                      <h5 className="text-xs font-medium text-muted-foreground mb-1">RELEVANCE:</h5>
                      <p className="text-xs text-muted-foreground">
                        {q.industry_relevance}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
