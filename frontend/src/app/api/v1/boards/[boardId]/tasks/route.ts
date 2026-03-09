import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "https://ain-mission-control-backend.vercel.app";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ boardId: string }> }
) {
  const { boardId } = await params;
  const searchParams = request.nextUrl.searchParams;
  
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/v1/boards/${boardId}/tasks?${searchParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Authorization": request.headers.get("Authorization") || "",
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch tasks" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ boardId: string }> }
) {
  const { boardId } = await params;
  
  try {
    const body = await request.json();
    
    const response = await fetch(
      `${BACKEND_URL}/api/v1/boards/${boardId}/tasks`,
      {
        method: "POST",
        headers: {
          "Authorization": request.headers.get("Authorization") || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        errorData || { error: "Failed to create task" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ boardId: string }> }
) {
  const { boardId } = await params;
  const url = new URL(request.url);
  const taskId = url.searchParams.get("taskId");
  
  if (!taskId) {
    return NextResponse.json(
      { error: "taskId query parameter required" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    
    const response = await fetch(
      `${BACKEND_URL}/api/v1/boards/${boardId}/tasks/${taskId}`,
      {
        method: "PATCH",
        headers: {
          "Authorization": request.headers.get("Authorization") || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        errorData || { error: "Failed to update task" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
