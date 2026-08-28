import { Schema, model, Document } from 'mongoose';

export interface IOtp extends Document {
  email: string;
  otpHash: string;
  createdAt: Date;
}

const otpSchema = new Schema<IOtp>({
  email: { type: String, required: true },
  otpHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 } // 5-minute TTL index
});

export const Otp = model<IOtp>('Otp', otpSchema);
