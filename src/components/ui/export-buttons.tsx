"use client";

import { useState } from "react";
import { useLang } from "@/components/providers/lang-provider";
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
  const { t } = useLang();

  const handleExamExport = (examInfo: ExamInfo) => {
    exportToExamPDF(questionSet, examInfo);
  };

  return (
    <>
      <div className={`flex gap-2 flex-wrap ${className}`}>

        {/* Exam Export Button */}
        <Button
          variant="default"
          size="sm"
          onClick={() => setShowExamDialog(true)}
          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-sm whitespace-nowrap"
        >
          <GraduationCap className="h-4 w-4" />
          {t("export_exam")}
        </Button>

        {/* Dropdown for All Options */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="text-sm whitespace-nowrap">
              <Download className="h-4 w-4 mr-1" />
              {t("export_moreOptions")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>{t("export_options")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={() => exportToJSON(questionSet)}>
              <FileText className="h-4 w-4 mr-2" />
              {t("export_json")}
              <span className="ml-auto text-xs text-muted-foreground">
                .json
              </span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => exportToCSV(questionSet)}>
              <Table className="h-4 w-4 mr-2" />
              {t("export_csv")}
              <span className="ml-auto text-xs text-muted-foreground">
                .csv
              </span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => exportToPDF(questionSet)}>
              <FileOutput className="h-4 w-4 mr-2" />
              {t("export_pdf")}
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
              {t("export_examFormat")}
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
