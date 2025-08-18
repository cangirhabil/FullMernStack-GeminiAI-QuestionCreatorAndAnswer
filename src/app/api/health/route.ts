import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";

export async function GET() {
  try {
    const conn = await connectToDatabase();
    return NextResponse.json({ status: "ok", db: conn.connection.name });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Database connection failed';
    return NextResponse.json(
      { status: "error", message },
      { status: 500 }
    );
  }
}
