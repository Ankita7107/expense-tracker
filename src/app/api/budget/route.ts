import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Budget from '@/models/Budget';

export async function GET() {
  try {
    await dbConnect();
    let budget = await Budget.findOne({});
    if (!budget) {
      budget = await Budget.create({ amount: 5000 });
    }
    return NextResponse.json(budget);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch budget' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { amount } = await request.json();
    let budget = await Budget.findOne({});
    if (budget) {
      budget.amount = amount;
      await budget.save();
    } else {
      budget = await Budget.create({ amount });
    }
    return NextResponse.json(budget);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update budget' }, { status: 400 });
  }
}
