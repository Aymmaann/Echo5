import mongoose from "mongoose";

const postSchema = mongoose.Schema(
    {
        userId: { type: String, required: true },
        desc: String,
        likes: [],
        image: String,
        location: { type: String, default: "SRM Nagar" }
    },
    {
        timestamps: true,
    }
)

const postModel = mongoose.model("allPosts", postSchema);

export default postModel