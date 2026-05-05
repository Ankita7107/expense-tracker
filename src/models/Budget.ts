import mongoose, { Schema, Document } from 'mongoose';

export interface IBudget extends Document {
  amount: number;
}

const BudgetSchema: Schema = new Schema({
  amount: { type: Number, required: true },
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

export default mongoose.models.Budget || mongoose.model<IBudget>('Budget', BudgetSchema);
