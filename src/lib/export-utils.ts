import jsPDF from 'jspdf';

export interface ExamInfo {
  title: string;
  institution: string;
  studentName: string;
  studentSurname: string;
  studentNumber?: string;
  examDate: string;
  duration?: string;
  instructor?: string;
  course?: string;
}

export interface Question {
  question: string;
  answer: string;
  difficulty: string;
  category: string;
  keywords?: string[];
  cognitive_level?: string;
  assessment_criteria?: string;
  follow_up_potential?: string;
  industry_relevance?: string;
}

export interface QuestionSet {
  _id: string;
  title: string;
  questions: Question[];
  createdAt: string;
  metadata?: {
    generationMethod?: string;
    aiModel?: string;
  };
}

// JSON Export
export const exportToJSON = (questionSet: QuestionSet): void => {
  const dataStr = JSON.stringify(questionSet, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${questionSet.title.replace(/[^a-z0-9]/gi, '_')}_questions.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// CSV Export
export const exportToCSV = (questionSet: QuestionSet): void => {
  const headers = [
    'Question Number',
    'Question',
    'Answer',
    'Difficulty',
    'Category',
    'Cognitive Level',
    'Keywords',
    'Assessment Criteria',
    'Industry Relevance'
  ];

  const csvContent = [
    headers.join(','),
    ...questionSet.questions.map((q, index) => [
      index + 1,
      `"${q.question.replace(/"/g, '""')}"`,
      `"${q.answer.replace(/"/g, '""')}"`,
      q.difficulty,
      q.category || 'General',
      q.cognitive_level || 'Understand',
      `"${(q.keywords || []).join('; ')}"`,
      `"${(q.assessment_criteria || 'General assessment').replace(/"/g, '""')}"`,
      `"${(q.industry_relevance || 'General application').replace(/"/g, '""')}"`
    ].join(','))
  ].join('\n');

  const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${questionSet.title.replace(/[^a-z0-9]/gi, '_')}_questions.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// PDF Export (Basic)
export const exportToPDF = (questionSet: QuestionSet): void => {
  const pdf = new jsPDF();
  const pageHeight = pdf.internal.pageSize.height;
  let y = 20;

  // Title
  pdf.setFontSize(18);
  pdf.setFont(undefined, 'bold');
  pdf.text(questionSet.title, 20, y);
  y += 15;

  // Metadata
  pdf.setFontSize(10);
  pdf.setFont(undefined, 'normal');
  pdf.text(`Generated: ${new Date(questionSet.createdAt).toLocaleDateString()}`, 20, y);
  y += 8;
  pdf.text(`Total Questions: ${questionSet.questions.length}`, 20, y);
  y += 8;
  if (questionSet.metadata?.aiModel) {
    pdf.text(`AI Model: ${questionSet.metadata.aiModel}`, 20, y);
    y += 8;
  }
  y += 10;

  // Questions
  questionSet.questions.forEach((question, index) => {
    // Check if we need a new page
    if (y > pageHeight - 40) {
      pdf.addPage();
      y = 20;
    }

    // Question number and difficulty
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'bold');
    pdf.text(`${index + 1}. [${question.difficulty.toUpperCase()}] ${question.category || 'General'}`, 20, y);
    y += 8;

    // Question text
    pdf.setFont(undefined, 'normal');
    const questionLines = pdf.splitTextToSize(question.question, 170);
    pdf.text(questionLines, 20, y);
    y += questionLines.length * 5 + 5;

    // Answer
    pdf.setFont(undefined, 'bold');
    pdf.text('Answer:', 20, y);
    y += 6;
    pdf.setFont(undefined, 'normal');
    const answerLines = pdf.splitTextToSize(question.answer, 170);
    pdf.text(answerLines, 20, y);
    y += answerLines.length * 5 + 10;

    // Keywords and cognitive level
    if (question.keywords && question.keywords.length > 0) {
      pdf.setFontSize(9);
      pdf.setFont(undefined, 'italic');
      pdf.text(`Keywords: ${question.keywords.join(', ')}`, 20, y);
      y += 5;
    }
    if (question.cognitive_level) {
      pdf.text(`Cognitive Level: ${question.cognitive_level}`, 20, y);
      y += 5;
    }
    y += 5;
  });

  pdf.save(`${questionSet.title.replace(/[^a-z0-9]/gi, '_')}_questions.pdf`);
};

// Exam PDF Export
export const exportToExamPDF = (questionSet: QuestionSet, examInfo: ExamInfo): void => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.width;
  const pageHeight = pdf.internal.pageSize.height;
  let y = 25;

  // Header
  pdf.setFontSize(16);
  pdf.setFont(undefined, 'bold');
  const titleText = examInfo.title || questionSet.title;
  pdf.text(titleText, pageWidth / 2, y, { align: 'center' });
  y += 10;

  if (examInfo.institution) {
    pdf.setFontSize(12);
    pdf.text(examInfo.institution, pageWidth / 2, y, { align: 'center' });
    y += 8;
  }

  y += 5;

  // Student Information Section
  pdf.setFontSize(10);
  pdf.setFont(undefined, 'normal');
  
  // Left column
  pdf.text('Student Name:', 20, y);
  pdf.text('_'.repeat(30), 60, y);
  if (examInfo.studentName) {
    pdf.text(`${examInfo.studentName} ${examInfo.studentSurname}`, 62, y - 1);
  }

  // Right column
  pdf.text('Date:', pageWidth - 80, y);
  pdf.text('_'.repeat(20), pageWidth - 55, y);
  if (examInfo.examDate) {
    pdf.text(examInfo.examDate, pageWidth - 53, y - 1);
  }

  y += 10;

  // Second row
  if (examInfo.studentNumber) {
    pdf.text('Student Number:', 20, y);
    pdf.text('_'.repeat(25), 70, y);
    pdf.text(examInfo.studentNumber, 72, y - 1);
  }

  if (examInfo.duration) {
    pdf.text('Duration:', pageWidth - 80, y);
    pdf.text('_'.repeat(15), pageWidth - 50, y);
    pdf.text(examInfo.duration, pageWidth - 48, y - 1);
  }

  y += 10;

  // Course and Instructor
  if (examInfo.course) {
    pdf.text('Course:', 20, y);
    pdf.text('_'.repeat(40), 50, y);
    pdf.text(examInfo.course, 52, y - 1);
    y += 8;
  }

  if (examInfo.instructor) {
    pdf.text('Instructor:', 20, y);
    pdf.text('_'.repeat(35), 55, y);
    pdf.text(examInfo.instructor, 57, y - 1);
    y += 8;
  }

  y += 10;

  // Instructions
  pdf.setFont(undefined, 'bold');
  pdf.text('INSTRUCTIONS:', 20, y);
  y += 8;
  pdf.setFont(undefined, 'normal');
  pdf.setFontSize(9);
  const instructions = [
    '• Read all questions carefully before answering.',
    '• Write your answers clearly and legibly.',
    '• Show all your work for calculation problems.',
    '• Manage your time effectively.',
    '• Good luck!'
  ];
  
  instructions.forEach(instruction => {
    pdf.text(instruction, 25, y);
    y += 5;
  });

  y += 10;

  // Questions
  pdf.setFontSize(11);
  questionSet.questions.forEach((question, index) => {
    // Check if we need a new page
    if (y > pageHeight - 60) {
      pdf.addPage();
      y = 25;
    }

    // Question number and points
    pdf.setFont(undefined, 'bold');
    const questionHeader = `${index + 1}. [${question.difficulty.toUpperCase()} - ${question.category || 'General'}]`;
    pdf.text(questionHeader, 20, y);
    
    // Points allocation based on difficulty
    const points = question.difficulty === 'hard' ? '15' : 
                  question.difficulty === 'medium' ? '10' : '5';
    pdf.text(`(${points} points)`, pageWidth - 40, y);
    y += 8;

    // Question text
    pdf.setFont(undefined, 'normal');
    const questionLines = pdf.splitTextToSize(question.question, 170);
    pdf.text(questionLines, 20, y);
    y += questionLines.length * 6;

    // Answer space
    y += 5;
    const answerSpace = question.difficulty === 'hard' ? 25 : 
                       question.difficulty === 'medium' ? 20 : 15;
    
    for (let i = 0; i < answerSpace; i++) {
      pdf.line(20, y, pageWidth - 20, y);
      y += 4;
    }
    y += 8;
  });

  // Footer with total points
  const totalPoints = questionSet.questions.reduce((sum, q) => {
    return sum + (q.difficulty === 'hard' ? 15 : q.difficulty === 'medium' ? 10 : 5);
  }, 0);

  pdf.setFontSize(10);
  pdf.setFont(undefined, 'bold');
  pdf.text(`Total Points: ${totalPoints}`, pageWidth / 2, pageHeight - 15, { align: 'center' });

  const filename = `${titleText.replace(/[^a-z0-9]/gi, '_')}_exam.pdf`;
  pdf.save(filename);
};
