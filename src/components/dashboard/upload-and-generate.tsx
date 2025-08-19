"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useLang } from "@/components/providers/lang-provider";

export function UploadAndGenerate() {
  const [file, setFile] = useState<File | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState("medium");
  const [numberOfQuestions, setNumberOfQuestions] = useState(10);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const router = useRouter();
  const { t } = useLang();

  const handleUpload = async () => {
    if (!file) return toast.error(t("ug_err_selectPdf"));
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("ug_err_uploadFailed"));
      setDocumentId(data.documentId);
      toast.success(t("ug_success_uploaded"));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : t("ug_err_uploadGeneric");
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  const handleGenerate = async () => {
    if (!documentId) return toast.error(t("ug_err_needUpload"));
    setGenerating(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId, numberOfQuestions, difficulty }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("ug_err_generate"));
      toast.success(t("ug_success_ready"));
      router.push(`/questions/${data.questionSetId}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : t("ug_err_generate");
      toast.error(message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("ug_cardTitle")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <Label>{t("ug_pdfFile")}</Label>
          <Input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>
        <div className="flex gap-4 flex-wrap">
          <div className="space-y-1 flex-1 min-w-[140px]">
            <Label>{t("ug_difficulty")}</Label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger>
                <SelectValue placeholder={t("ug_difficulty")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">{t("ug_difficulty_easy")}</SelectItem>
                <SelectItem value="medium">
                  {t("ug_difficulty_medium")}
                </SelectItem>
                <SelectItem value="hard">{t("ug_difficulty_hard")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1 w-40">
            <Label>{t("ug_questionCount")}</Label>
            <Input
              type="number"
              min={1}
              max={50}
              value={numberOfQuestions}
              onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
            />
          </div>
        </div>
        {documentId && (
          <p className="text-xs text-muted-foreground">
            {t("ug_uploadedPrefix")} {documentId}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex gap-2 flex-wrap">
        <Button
          type="button"
          onClick={handleUpload}
          disabled={!file || uploading || !!documentId}
          className="flex-1 min-w-[140px]"
        >
          {uploading ? (
            <>
              <Spinner size={16} className="mr-2" /> {t("ug_uploading")}
            </>
          ) : (
            t("ug_upload")
          )}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={handleGenerate}
          disabled={!documentId || generating}
          className="flex-1 min-w-[140px]"
        >
          {generating ? (
            <>
              <Spinner size={16} className="mr-2" /> {t("ug_generating")}
            </>
          ) : (
            t("ug_generate")
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
