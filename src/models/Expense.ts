import mongoose, { Schema, Document } from 'mongoose';

export interface IExpense extends Document {
  date: string;
  category: string;
  amount: number;
  notes?: string;
}

const ExpenseSchema: Schema = new Schema({
  date: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Room Rent', 'Travel to Home', 'Daily Travelling', 'Extra Travelling', 'Vegetables', 'Outside Food']
  },
  amount: { type: Number, required: true },
  notes: { type: String },
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret: any) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
    }
  }
});

export default mongoose.models.Expense || mongoose.model<IExpense>('Expense', ExpenseSchema);
