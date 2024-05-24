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

// {
//   "data": {
//     "id": 1,
//     "email": "george.bluth@reqres.in",
//     "first_name": "George",
//     "last_name": "Bluth",
//     "avatar": "https://reqres.in/img/faces/1-image.jpg"
//   },
//   "support": {
//     "url": "https://reqres.in/#support-heading",
//     "text": "To keep ReqRes free, contributions towards server costs are appreciated!"
//   }
// }