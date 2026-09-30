import { Schema, model } from "mongoose";
import { StoryModel, TStory } from "./story.interface";

const storySchema = new Schema<TStory>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
        userImage: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: String,
            required: true,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
        expiresAt: {
            type: Date,
            required: true,
            index: { expires: 0 } // This will automatically delete documents when current time reaches expiresAt
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
        },
    }
);

export const Story = model<TStory, StoryModel>("Story", storySchema);