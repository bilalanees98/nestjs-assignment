import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { isEmail } from 'validator';
import * as mongoose from 'mongoose';
export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, validate: isEmail })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }])
  following: User[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }])
  followers: User[];
}

export const UserSchema = SchemaFactory.createForClass(User);
