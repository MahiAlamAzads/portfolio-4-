import { NextResponse } from "next/server";
import { syncGitHubProjects } from "@/services/github";

export async function POST() {
  try {
    const result = await syncGitHubProjects();

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("GitHub sync error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to sync GitHub projects",
      },
      {
        status: 500,
      }
    );
  }
}