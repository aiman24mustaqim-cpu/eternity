import mongoose, { Document, Schema } from 'mongoose'

export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId
  packageId: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed'
  stripeSessionId?: string
  createdAt: Date
}

const PaymentSchema = new Schema<IPayment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    packageId: { type: String, required: true, enum: ['basic', 'premium'] },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: 'myr' },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    stripeSessionId: { type: String, index: true },
  },
  { timestamps: true }
)

const Payment = mongoose.model<IPayment>('Payment', PaymentSchema)
export { Payment }
export default Payment