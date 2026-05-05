import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema ({
    email : {
        type: String,
        required: true,
        unique: true,
    },
})

userSchema.plugin(passportLocalMongoose.default || passportLocalMongoose);

export default mongoose.model("user", userSchema);