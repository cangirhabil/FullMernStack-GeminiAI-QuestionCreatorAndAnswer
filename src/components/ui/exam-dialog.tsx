"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!examInfo.title.trim()) {
      newErrors.title = "Exam title is required";
    }
    if (!examInfo.institution.trim()) {
      newErrors.institution = "Institution name is required";
    }
    if (!examInfo.examDate) {
      newErrors.examDate = "Exam date is required";
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
          <DialogTitle>Export as Exam</DialogTitle>
          <DialogDescription>
            Fill in the exam information to create a professional exam document.
            Required fields are marked with *.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Exam Title */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Exam Title *
            </Label>
            <div className="col-span-3">
              <Input
                id="title"
                value={examInfo.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className={errors.title ? "border-red-500" : ""}
                placeholder="Enter exam title"
              />
              {errors.title && (
                <p className="text-sm text-red-500 mt-1">{errors.title}</p>
              )}
            </div>
          </div>

          {/* Institution */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="institution" className="text-right">
              Institution *
            </Label>
            <div className="col-span-3">
              <Input
                id="institution"
                value={examInfo.institution}
                onChange={(e) => handleInputChange("institution", e.target.value)}
                className={errors.institution ? "border-red-500" : ""}
                placeholder="University, School, or Company name"
              />
              {errors.institution && (
                <p className="text-sm text-red-500 mt-1">{errors.institution}</p>
              )}
            </div>
          </div>

          {/* Student Information */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="studentName" className="text-right">
              Student Name
            </Label>
            <div className="col-span-3 grid grid-cols-2 gap-2">
              <Input
                id="studentName"
                value={examInfo.studentName}
                onChange={(e) => handleInputChange("studentName", e.target.value)}
                placeholder="First name"
              />
              <Input
                id="studentSurname"
                value={examInfo.studentSurname}
                onChange={(e) => handleInputChange("studentSurname", e.target.value)}
                placeholder="Last name"
              />
            </div>
          </div>

          {/* Student Number */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="studentNumber" className="text-right">
              Student Number
            </Label>
            <div className="col-span-3">
              <Input
                id="studentNumber"
                value={examInfo.studentNumber}
                onChange={(e) => handleInputChange("studentNumber", e.target.value)}
                placeholder="Student ID or number"
              />
            </div>
          </div>

          {/* Exam Date and Duration */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="examDate" className="text-right">
              Exam Date *
            </Label>
            <div className="col-span-3 grid grid-cols-2 gap-2">
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
                placeholder="e.g., 60 minutes, 2 hours"
              />
            </div>
          </div>

          {/* Course */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="course" className="text-right">
              Course
            </Label>
            <div className="col-span-3">
              <Input
                id="course"
                value={examInfo.course}
                onChange={(e) => handleInputChange("course", e.target.value)}
                placeholder="Course name or code"
              />
            </div>
          </div>

          {/* Instructor */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="instructor" className="text-right">
              Instructor
            </Label>
            <div className="col-span-3">
              <Input
                id="instructor"
                value={examInfo.instructor}
                onChange={(e) => handleInputChange("instructor", e.target.value)}
                placeholder="Instructor or examiner name"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Generate Exam PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
