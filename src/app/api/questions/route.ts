import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import QuestionSet from "@/models/QuestionSet";
import { verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const userId = await verifyToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    // Get all question sets for the user
    const questionSets = await QuestionSet.find({ userId })
      .populate("documentId", "originalName createdAt")
      .sort({ createdAt: -1 })
      .select("title totalQuestions createdAt documentId");

    return NextResponse.json({
      questionSets,
      total: questionSets.length,
    });
  } catch (error) {
    console.error("Get questions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Verify authentication
    const userId = await verifyToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const questionSetId = searchParams.get("id");

    if (!questionSetId) {
      return NextResponse.json(
        { error: "Question set ID is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const questionSet = await QuestionSet.findOneAndDelete({
      _id: questionSetId,
      userId,
    });

    if (!questionSet) {
      return NextResponse.json(
        { error: "Question set not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Question set deleted successfully",
    });
  } catch (error) {
    console.error("Delete question set error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
