import { Prop, Schema, SchemaFactory}  from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class User extends Document {
    @Prop({type: String, required: true, unique: true})
    email: string;

    @Prop({type: String, required: true})
    first_name: string;

    @Prop({type: String, required: true})
    last_name: string;

    @Prop({type: String})
    avatar: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
