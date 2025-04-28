import mongoose from "mongoose";
const postSchema = mongoose.Schema(
    {
        userId: { type: String, required: true },
        desc: String,
        likes: [],
        image: String,
        location: { type: String, default: "SRM Nagar" },
        longi: { type: Number },
        lati: { type: Number },
        emergency: { type: Boolean, default: false }
    },
    {
        timestamps: true,
    }
)
const postModel = mongoose.model("allPosts", postSchema);
export default postModel