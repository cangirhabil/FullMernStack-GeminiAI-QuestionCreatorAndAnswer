import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Document from "@/models/Document";
import QuestionSet from "@/models/QuestionSet";

export async function DELETE() {
  try {
    await connectToDatabase();

    // Delete all documents and question sets (for development only)
    await Document.deleteMany({});
    await QuestionSet.deleteMany({});

    return NextResponse.json({
      message: "Database cleaned successfully",
      deletedDocuments: true,
      deletedQuestionSets: true,
    });
  } catch (error) {
    console.error("Database cleanup error:", error);
    return NextResponse.json(
      { error: "Failed to clean database" },
      { status: 500 }
    );
  }
}
