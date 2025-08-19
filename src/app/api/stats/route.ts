import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { QuestionSet, Document } from "@/models";
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
    const questionSets = await QuestionSet.find({ userId });
    
    // Get all documents for the user
    const documents = await Document.find({ userId });

    // Calculate statistics
    const totalSessions = questionSets.length;
    const totalQuestions = questionSets.reduce((sum, qs) => sum + (qs.totalQuestions || 0), 0);
    const documentsProcessed = documents.length;

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentSessions = questionSets.filter(qs => 
      new Date(qs.createdAt) > thirtyDaysAgo
    ).length;

    const recentQuestions = questionSets
      .filter(qs => new Date(qs.createdAt) > thirtyDaysAgo)
      .reduce((sum, qs) => sum + (qs.totalQuestions || 0), 0);

    return NextResponse.json({
      stats: {
        totalSessions,
        totalQuestions,
        documentsProcessed,
        recentSessions,
        recentQuestions,
        avgQuestionsPerSession: totalSessions > 0 ? Math.round(totalQuestions / totalSessions) : 0,
      }
    });
  } catch (error) {
    console.error("Get stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
