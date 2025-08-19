import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import connectToDatabase from "@/lib/mongodb";
import Document from "@/models/Document";
import { verifyToken } from "@/lib/auth";
import { getStorageStrategy, saveLocalFile } from "@/lib/storage";
import { existsSync } from "fs"; // only used while legacy local path code remains
// removed direct fs writeFile/mkdir usage in favor of storage helper

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const userId = await verifyToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file type
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed" },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size must be less than 10MB" },
        { status: 400 }
      );
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

    const strategy = getStorageStrategy();
    let uploadPath: string | undefined;
    let content: Buffer | undefined;
    if (strategy === "local") {
      uploadPath = await saveLocalFile(filename, bytes);
    } else {
      content = bytes; // store binary in DB
    }

    await connectToDatabase();

    // Save document info to database
    const document = new Document({
      userId,
      filename,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      uploadPath,
      content,
      status: "processing",
    });

    await document.save();

    return NextResponse.json({
      message: "File uploaded successfully",
      documentId: document._id,
      filename: document.filename,
      storage: strategy,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
