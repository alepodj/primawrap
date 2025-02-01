import { IUserInput } from '@/types'
import { Document, Model, model, models, Schema } from 'mongoose'

export interface IUser extends Document, IUserInput {
  _id: string
  createdAt: Date
  updatedAt: Date
  verificationToken?: string
  verificationTokenExpiry?: Date
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    role: { type: String, required: true, default: 'User' },
    password: { type: String },
    image: { type: String },
    emailVerified: { type: Boolean, default: false },
    verificationToken: { type: String, index: { sparse: true } },
    verificationTokenExpiry: { type: Date },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// Ensure verification token is properly cleared
userSchema.pre('save', function (next) {
  if (this.emailVerified === true) {
    this.verificationToken = undefined
    this.verificationTokenExpiry = undefined
  }
  next()
})

const User = (models.User as Model<IUser>) || model<IUser>('User', userSchema)

export default User
