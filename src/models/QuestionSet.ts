import mongoose, { Document, Schema } from "mongoose";

export interface IQuestionSet extends Document {
  userId: mongoose.Types.ObjectId;
  documentId: mongoose.Types.ObjectId;
  title: string;
  questions: Array<{
    question: string;
    answer: string;
    difficulty: "easy" | "medium" | "hard";
    category?: string;
    cognitive_level?: string;
    keywords?: string[];
    sourceContext?: string;
    assessment_criteria?: string;
    follow_up_potential?: string;
    industry_relevance?: string;
  }>;
  totalQuestions: number;
  metadata?: {
    generationMethod?: string;
    documentLength?: number;
    generatedAt?: Date;
    ragEnabled?: boolean;
    aiModel?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSetSchema = new Schema<IQuestionSet>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    documentId: {
      type: Schema.Types.ObjectId,
      ref: "Document",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    questions: [
      {
        question: {
          type: String,
          required: true,
        },
        answer: {
          type: String,
          required: true,
        },
        difficulty: {
          type: String,
          enum: ["easy", "medium", "hard"],
          default: "medium",
        },
        category: {
          type: String,
        },
        cognitive_level: {
          type: String,
          enum: ["Remember", "Understand", "Apply", "Analyze", "Evaluate", "Create"],
        },
        keywords: {
          type: [String],
          default: [],
        },
        sourceContext: {
          type: String,
        },
        assessment_criteria: {
          type: String,
        },
        follow_up_potential: {
          type: String,
        },
        industry_relevance: {
          type: String,
        },
      },
    ],
    totalQuestions: {
      type: Number,
      default: 0,
    },
    metadata: {
      generationMethod: {
        type: String,
        default: "standard",
      },
      documentLength: {
        type: Number,
      },
      generatedAt: {
        type: Date,
        default: Date.now,
      },
      ragEnabled: {
        type: Boolean,
        default: false,
      },
      aiModel: {
        type: String,
        default: "gemini-1.5-flash",
      },
    },
  },
  {
    timestamps: true,
  }
);

QuestionSetSchema.pre("save", function (next) {
  this.totalQuestions = this.questions.length;
  next();
});

export default mongoose.models.QuestionSet ||
  mongoose.model<IQuestionSet>("QuestionSet", QuestionSetSchema);
