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
  createdAt: Date
  comparePassword(plain: string): Promise<boolean>
  canCreateInvitation(currentCount: number): boolean
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true },
    password: { type: String, required: [true, 'Password is required'], minlength: 8, select: false },
    plan: { type: String, enum: ['free', 'basic', 'premium'], default: 'free' },
    avatar: { type: String },
  },
  { timestamps: true }
)

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

UserSchema.methods.comparePassword = async function (plain: string): Promise<boolean> {
  return bcrypt.compare(plain, this.password)
}

UserSchema.methods.canCreateInvitation = function (currentCount: number): boolean {
  const limits: Record<UserPlan, number> = { free: 1, basic: 3, premium: -1 }
  const limit = limits[this.plan as UserPlan]
  if (limit === -1) return true
  return currentCount < limit
}

UserSchema.set('toJSON', {
  transform: (_, obj) => { delete obj.password; return obj }
})

const User = mongoose.model<IUser>('User', UserSchema)
export { User }
export default User