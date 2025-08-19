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
import { useStats } from "@/components/providers/stats-provider";
import { Upload, FileText, Zap, Settings, CheckCircle, AlertCircle } from "lucide-react";

export function UploadAndGenerate() {
  const [file, setFile] = useState<File | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState("medium");
  const [numberOfQuestions, setNumberOfQuestions] = useState(10);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const router = useRouter();
  const { t } = useLang();
  const { refreshStats } = useStats();

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
      
      // Refresh stats after successful generation
      refreshStats();
      
      router.push(`/questions/${data.questionSetId}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : t("ug_err_generate");
      toast.error(message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Step 1: Upload */}
      <div className="space-y-4">
  <div className="flex items-center gap-3 flex-wrap">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            file ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
          }`}>
            {file ? <CheckCircle className="w-4 h-4" /> : '1'}
          </div>
          <h3 className="font-semibold text-gray-900">{t("ug_step1")}</h3>
          {file && (
            <div className="flex items-center gap-2 ml-auto min-w-0">
              <FileText className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600 font-medium truncate max-w-[150px] sm:max-w-[220px]" title={file.name}>{file.name}</span>
            </div>
          )}
        </div>

        <div className="relative">
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            id="file-upload"
          />
          <label 
            htmlFor="file-upload"
            className={`
              relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all
              ${file 
                ? 'border-green-300 bg-green-50 hover:bg-green-100' 
                : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'
              }
            `}
          >
            {file ? (
              <div className="text-center">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-green-700">{t("ug_uploadSuccess")}</p>
                <p className="text-xs text-green-600">{file.name}</p>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">{t("ug_clickToUpload")}</p>
                <p className="text-xs text-gray-500">{t("ug_orDragDrop")}</p>
              </div>
            )}
          </label>
        </div>
      </div>

      {/* Step 2: Configuration */}
      <div className="space-y-4">
  <div className="flex items-center gap-3 flex-wrap">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            file ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400'
          }`}>
            <Settings className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-gray-900">{t("ug_configureTitle")}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">{t("ug_difficultyLevel")}</Label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger className="h-11 rounded-xl border-gray-200">
                <SelectValue placeholder={t("ug_selectDifficulty")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy" className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  {t("ug_difficulty_easy")}
                </SelectItem>
                <SelectItem value="medium" className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  {t("ug_difficulty_medium")}
                </SelectItem>
                <SelectItem value="hard" className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  {t("ug_difficulty_hard")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">{t("ug_numberOfQuestions")}</Label>
            <Input
              type="number"
              min={1}
              max={50}
              value={numberOfQuestions}
              onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
              className="h-11 rounded-xl border-gray-200"
              placeholder={t("ug_numberPlaceholder")}
            />
          </div>
        </div>
      </div>

      {/* Step 3: Actions */}
      <div className="space-y-4">
  <div className="flex items-center gap-3 flex-wrap">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            documentId ? 'bg-green-100 text-green-700' : file ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400'
          }`}>
            {documentId ? <CheckCircle className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
          </div>
          <h3 className="font-semibold text-gray-900">{t("ug_step3")}</h3>
          {documentId && (
            <div className="flex items-center gap-2 ml-auto">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-600 font-medium">{t("ug_documentProcessed")}</span>
            </div>
          )}
        </div>

    <div className="flex gap-3 flex-col sm:flex-row">
          <Button
            onClick={handleUpload}
            disabled={!file || uploading || !!documentId}
            className={`
      flex-1 h-12 rounded-xl font-medium transition-all duration-200 w-full
              ${!file || uploading || !!documentId 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
              }
            `}
          >
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                {t("ug_processing")}
              </>
            ) : documentId ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                {t("ug_uploadedStatus")}
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                {t("ug_uploadProcess")}
              </>
            )}
          </Button>

      <Button
            onClick={handleGenerate}
            disabled={!documentId || generating}
            className={`
        flex-1 h-12 rounded-xl font-medium transition-all duration-200 w-full
              ${!documentId || generating
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl'
              }
            `}
          >
            {generating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                {t("ug_generating")}
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                {t("ug_generate")}
              </>
            )}
          </Button>
        </div>

        {documentId && !generating && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                <AlertCircle className="w-3 h-3 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">{t("ug_readyTitle")}</p>
                <p className="text-xs text-blue-700 mt-1">
                  {t("ug_readyDesc")}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
