import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Budget from '@/models/Budget';
import { getUserIdFromToken } from '@/lib/auth';

export async function GET() {
  try {
    const userId = await getUserIdFromToken();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    let budget = await Budget.findOne({ userId });
    if (!budget) {
      budget = await Budget.create({ amount: 5000, userId });
    }
    return NextResponse.json(budget);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch budget' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getUserIdFromToken();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const { amount } = await request.json();
    let budget = await Budget.findOne({ userId });
    
    if (budget) {
      budget.amount = amount;
      await budget.save();
    } else {
      budget = await Budget.create({ amount, userId });
    }
    return NextResponse.json(budget);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update budget' }, { status: 400 });
  }
}
