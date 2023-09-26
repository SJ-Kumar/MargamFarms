import mongoose from "mongoose";
const transportSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        qty: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        cost: {
            type: Number,
            required: true,
            default: 0,
        },
        description: {
            type: String,
            required: false,
        }
    },
    {
        timestamps: true,
    }
);

const Transport = mongoose.model('Transport', transportSchema);

export default Transport;