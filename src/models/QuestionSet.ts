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
  }>;
  totalQuestions: number;
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
      },
    ],
    totalQuestions: {
      type: Number,
      default: 0,
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
