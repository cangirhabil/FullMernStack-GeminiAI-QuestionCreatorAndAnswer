"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExamDialog } from "@/components/ui/exam-dialog";
import { 
  exportToJSON, 
  exportToCSV, 
  exportToPDF, 
  exportToExamPDF,
  type QuestionSet,
  type ExamInfo 
} from "@/lib/export-utils";
import { Download, FileText, Table, FileOutput, GraduationCap } from "lucide-react";

interface ExportButtonsProps {
  questionSet: QuestionSet;
  className?: string;
}

export function ExportButtons({ questionSet, className }: ExportButtonsProps) {
  const [showExamDialog, setShowExamDialog] = useState(false);

  const handleExamExport = (examInfo: ExamInfo) => {
    exportToExamPDF(questionSet, examInfo);
  };

  return (
    <>
      <div className={`flex gap-2 ${className}`}>

        {/* Exam Export Button */}
        <Button
          variant="default"
          size="sm"
          onClick={() => setShowExamDialog(true)}
          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700"
        >
          <GraduationCap className="h-4 w-4" />
          Export as Exam
        </Button>

        {/* Dropdown for All Options */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              More Options
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Export Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={() => exportToJSON(questionSet)}>
              <FileText className="h-4 w-4 mr-2" />
              JSON Format
              <span className="ml-auto text-xs text-muted-foreground">
                .json
              </span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => exportToCSV(questionSet)}>
              <Table className="h-4 w-4 mr-2" />
              CSV Spreadsheet
              <span className="ml-auto text-xs text-muted-foreground">
                .csv
              </span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => exportToPDF(questionSet)}>
              <FileOutput className="h-4 w-4 mr-2" />
              PDF Document
              <span className="ml-auto text-xs text-muted-foreground">
                .pdf
              </span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem 
              onClick={() => setShowExamDialog(true)}
              className="text-blue-600 focus:text-blue-600"
            >
              <GraduationCap className="h-4 w-4 mr-2" />
              Exam Format
              <span className="ml-auto text-xs text-muted-foreground">
                .pdf
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Exam Dialog */}
      <ExamDialog
        isOpen={showExamDialog}
        onClose={() => setShowExamDialog(false)}
        onExport={handleExamExport}
        questionSetTitle={questionSet.title}
      />
    </>
  );
}
