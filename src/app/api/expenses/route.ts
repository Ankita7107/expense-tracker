import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Expense from "@/models/Expense";
import { getUserIdFromToken } from "@/lib/auth";

export async function GET() {
  try {
    const userId = await getUserIdFromToken();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const expenses = await Expense.find({ userId }).sort({ date: -1 });
    return NextResponse.json(expenses);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch expenses" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserIdFromToken();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const data = await request.json();
    const expense = await Expense.create({ ...data, userId });
    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create expense" },
      { status: 400 },
    );
  }
}
