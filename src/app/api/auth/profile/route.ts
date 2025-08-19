import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";

// Helper function to mask API key
function maskApiKey(apiKey: string): string {
  if (!apiKey || apiKey.length < 8) return '';
  return `${apiKey.substring(0, 8)}${'*'.repeat(apiKey.length - 12)}${apiKey.substring(apiKey.length - 4)}`;
}

// GET - Get user profile with API key status
export async function GET() {
  try {
    await connectToDatabase();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = verify(token, process.env.JWT_SECRET!) as { userId: string };
    const user = await User.findById(decoded.userId).select('+geminiApiKey');

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        image: user.image,
      },
      hasApiKey: !!user.geminiApiKey,
      maskedApiKey: user.geminiApiKey ? maskApiKey(user.geminiApiKey) : null,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update user profile and API key
export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = verify(token, process.env.JWT_SECRET!) as { userId: string };
    const { name, geminiApiKey } = await request.json();

    const updateData: Record<string, string> = {};
    
    if (name !== undefined) {
      updateData.name = name;
    }
    
    if (geminiApiKey !== undefined) {
      updateData.geminiApiKey = geminiApiKey;
    }

    const user = await User.findByIdAndUpdate(
      decoded.userId,
      updateData,
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        image: user.image,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}