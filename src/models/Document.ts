import mongoose, { Document, Schema } from "mongoose";

export interface IDocument extends Document {
  userId: mongoose.Types.ObjectId;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadPath?: string; // optional when using database storage
  content?: Buffer; // binary content when STORAGE_STRATEGY=database
  status: "processing" | "completed" | "failed";
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema = new Schema<IDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    uploadPath: {
      type: String,
      required: false,
    },
    content: {
      type: Buffer,
      required: false,
      select: false,
    },
    status: {
      type: String,
      enum: ["processing", "completed", "failed"],
      default: "processing",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Document ||
  mongoose.model<IDocument>("Document", DocumentSchema);
