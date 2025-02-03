import { IUserInput } from '@/types'
import { Document, Model, model, models, Schema } from 'mongoose'

export interface IAddress {
  _id: string
  fullName: string
  street: string
  city: string
  province: string
  postalCode: string
  country: string
  phone: string
  isDefault: boolean
}

export interface IUser extends Document, IUserInput {
  _id: string
  createdAt: Date
  updatedAt: Date
  verificationToken?: string
  verificationTokenExpiry?: Date
  resetToken?: string
  resetTokenExpiry?: Date
  addresses: IAddress[]
}

const addressSchema = new Schema<IAddress>({
  fullName: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  province: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  phone: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
})

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    role: { type: String, required: true, default: 'User' },
    password: { type: String },
    image: { type: String },
    phone: { type: String },
    emailVerified: { type: Boolean, default: false },
    verificationToken: { type: String, index: { sparse: true } },
    verificationTokenExpiry: { type: Date },
    resetToken: { type: String, index: { sparse: true } },
    resetTokenExpiry: { type: Date },
    addresses: [addressSchema],
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
