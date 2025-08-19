import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { QuestionSet, Document } from "@/models";
import { verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // Extract id from URL (last segment)
    const url = new URL(request.url);
    const segments = url.pathname.split("/").filter(Boolean);
    const id = segments[segments.length - 1];
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    // Verify authentication
    const userId = await verifyToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const questionSet = await QuestionSet.findOne({
      _id: id,
      userId,
    }).populate("documentId", "originalName");

    if (!questionSet) {
      return NextResponse.json(
        { error: "Question set not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      questionSet,
    });
  } catch (error) {
    console.error("Get question set error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
