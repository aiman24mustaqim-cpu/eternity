import mongoose, { Document, Schema } from 'mongoose'
import bcrypt from 'bcryptjs'

export type UserPlan = 'free' | 'basic' | 'premium'

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId
  name: string
  email: string
  password: string
  plan: UserPlan
  avatar?: string
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  planExpiresAt?: Date
  isEmailVerified: boolean
  createdAt: Date
  updatedAt: Date
  // Methods
  comparePassword(plain: string): Promise<boolean>
  canCreateInvitation(currentCount: number): boolean
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Never returned in queries by default
    },
    plan: {
      type: String,
      enum: ['free', 'basic', 'premium'],
      default: 'free',
    },
    avatar: { type: String },
    stripeCustomerId: { type: String, select: false },
    stripeSubscriptionId: { type: String, select: false },
    planExpiresAt: { type: Date },
    isEmailVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, obj) => {
        if (obj.password) delete obj.password
        if (obj.stripeCustomerId) delete obj.stripeCustomerId
        if (obj.stripeSubscriptionId) delete obj.stripeSubscriptionId
        return obj
      },
    },
  }
)

// ── Hash password before save ──
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(12)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// ── Compare password ──
UserSchema.methods.comparePassword = async function (plain: string): Promise<boolean> {
  return bcrypt.compare(plain, this.password)
}

// ── Check if user can create more invitations ──
UserSchema.methods.canCreateInvitation = function (currentCount: number): boolean {
  const limits: Record<UserPlan, number> = { free: 1, basic: 3, premium: -1 }
  const limit = limits[this.plan as UserPlan]
  if (limit === -1) return true  // unlimited
  return currentCount < limit
}

// ── Index for faster queries ──
UserSchema.index({ email: 1 })
UserSchema.index({ stripeCustomerId: 1 })

export default mongoose.model<IUser>('User', UserSchema)