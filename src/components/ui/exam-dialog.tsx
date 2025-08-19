"use client";

import { useState } from "react";
import { useLang } from "@/components/providers/lang-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExamInfo } from "@/lib/export-utils";

interface ExamDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (examInfo: ExamInfo) => void;
  questionSetTitle: string;
}

export function ExamDialog({ isOpen, onClose, onExport, questionSetTitle }: ExamDialogProps) {
  const [examInfo, setExamInfo] = useState<ExamInfo>({
    title: questionSetTitle,
    institution: "",
    studentName: "",
    studentSurname: "",
    studentNumber: "",
    examDate: new Date().toISOString().split('T')[0],
    duration: "60 minutes",
    instructor: "",
    course: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const { t } = useLang();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!examInfo.title.trim()) {
  newErrors.title = t("exam_error_title");
    }
    if (!examInfo.institution.trim()) {
  newErrors.institution = t("exam_error_institution");
    }
    if (!examInfo.examDate) {
  newErrors.examDate = t("exam_error_examDate");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onExport(examInfo);
      onClose();
      // Reset form
      setExamInfo({
        title: questionSetTitle,
        institution: "",
        studentName: "",
        studentSurname: "",
        studentNumber: "",
        examDate: new Date().toISOString().split('T')[0],
        duration: "60 minutes",
        instructor: "",
        course: "",
      });
      setErrors({});
    }
  };

  const handleInputChange = (field: keyof ExamInfo, value: string) => {
    setExamInfo(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("exam_exportTitle")}</DialogTitle>
          <DialogDescription>
            {t("exam_dialogDesc")}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Exam Title */}
          <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-2 sm:gap-4">
            <Label htmlFor="title" className="sm:text-right text-left">
              {t("exam_titleLabel")} *
            </Label>
            <div className="sm:col-span-3">
              <Input
                id="title"
                value={examInfo.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className={errors.title ? "border-red-500" : ""}
                placeholder={t("exam_titleLabel")}
              />
              {errors.title && (
                <p className="text-sm text-red-500 mt-1">{errors.title}</p>
              )}
            </div>
          </div>

          {/* Institution */}
          <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-2 sm:gap-4">
            <Label htmlFor="institution" className="sm:text-right text-left">
              {t("exam_institutionLabel")} *
            </Label>
            <div className="sm:col-span-3">
              <Input
                id="institution"
                value={examInfo.institution}
                onChange={(e) => handleInputChange("institution", e.target.value)}
                className={errors.institution ? "border-red-500" : ""}
                placeholder={t("exam_institutionLabel")}
              />
              {errors.institution && (
                <p className="text-sm text-red-500 mt-1">{errors.institution}</p>
              )}
            </div>
          </div>

          {/* Student Information */}
          <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-2 sm:gap-4">
            <Label htmlFor="studentName" className="sm:text-right text-left">
              {t("exam_studentNameLabel")}
            </Label>
            <div className="sm:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-2">
              <Input
                id="studentName"
                value={examInfo.studentName}
                onChange={(e) => handleInputChange("studentName", e.target.value)}
                placeholder={t("exam_firstNamePlaceholder")}
              />
              <Input
                id="studentSurname"
                value={examInfo.studentSurname}
                onChange={(e) => handleInputChange("studentSurname", e.target.value)}
                placeholder={t("exam_lastNamePlaceholder")}
              />
            </div>
          </div>

          {/* Student Number */}
          <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-2 sm:gap-4">
            <Label htmlFor="studentNumber" className="sm:text-right text-left">
              {t("exam_studentNumberLabel")}
            </Label>
            <div className="sm:col-span-3">
              <Input
                id="studentNumber"
                value={examInfo.studentNumber}
                onChange={(e) => handleInputChange("studentNumber", e.target.value)}
                placeholder={t("exam_studentNumberPlaceholder")}
              />
            </div>
          </div>

          {/* Exam Date and Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-2 sm:gap-4">
            <Label htmlFor="examDate" className="sm:text-right text-left">
              {t("exam_examDateLabel")} *
            </Label>
            <div className="sm:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <Input
                  id="examDate"
                  type="date"
                  value={examInfo.examDate}
                  onChange={(e) => handleInputChange("examDate", e.target.value)}
                  className={errors.examDate ? "border-red-500" : ""}
                />
                {errors.examDate && (
                  <p className="text-sm text-red-500 mt-1">{errors.examDate}</p>
                )}
              </div>
              <Input
                id="duration"
                value={examInfo.duration}
                onChange={(e) => handleInputChange("duration", e.target.value)}
                placeholder={t("exam_durationPlaceholder")}
              />
            </div>
          </div>

          {/* Course */}
          <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-2 sm:gap-4">
            <Label htmlFor="course" className="sm:text-right text-left">
              {t("exam_courseLabel")}
            </Label>
            <div className="sm:col-span-3">
              <Input
                id="course"
                value={examInfo.course}
                onChange={(e) => handleInputChange("course", e.target.value)}
                placeholder={t("exam_coursePlaceholder")}
              />
            </div>
          </div>

          {/* Instructor */}
          <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-2 sm:gap-4">
            <Label htmlFor="instructor" className="sm:text-right text-left">
              {t("exam_instructorLabel")}
            </Label>
            <div className="sm:col-span-3">
              <Input
                id="instructor"
                value={examInfo.instructor}
                onChange={(e) => handleInputChange("instructor", e.target.value)}
                placeholder={t("exam_instructorPlaceholder")}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button onClick={handleSubmit}>
            {t("exam_generateButton")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
