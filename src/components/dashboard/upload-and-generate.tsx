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

export function UploadAndGenerate() {
  const [file, setFile] = useState<File | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState("medium");
  const [numberOfQuestions, setNumberOfQuestions] = useState(10);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const router = useRouter();

  const handleUpload = async () => {
    if (!file) return toast.error("Önce PDF seçin");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Yükleme başarısız");
      setDocumentId(data.documentId);
      toast.success("Dosya yüklendi");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Yükleme hatası";
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  const handleGenerate = async () => {
    if (!documentId) return toast.error("Önce dosya yükleyin");
    setGenerating(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId, numberOfQuestions, difficulty }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Oluşturma hatası");
      toast.success("Sorular hazır");
      router.push(`/questions/${data.questionSetId}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Oluşturma hatası";
      toast.error(message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>PDF Yükle ve Soru Oluştur</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <Label>PDF Dosyası</Label>
          <Input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>
        <div className="flex gap-4 flex-wrap">
          <div className="space-y-1 flex-1 min-w-[140px]">
            <Label>Zorluk</Label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger>
                <SelectValue placeholder="Seç" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Kolay</SelectItem>
                <SelectItem value="medium">Orta</SelectItem>
                <SelectItem value="hard">Zor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1 w-40">
            <Label>Soru Sayısı</Label>
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
            Yüklendi: {documentId}
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
              <Spinner size={16} className="mr-2" /> Yükleniyor...
            </>
          ) : (
            "Yükle"
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
              <Spinner size={16} className="mr-2" /> Oluşturuluyor...
            </>
          ) : (
            "Soruları Oluştur"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
