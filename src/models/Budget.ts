import mongoose, { Schema, Document } from 'mongoose';

export interface IBudget extends Document {
  amount: number;
  userId: string;
}

const BudgetSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
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
