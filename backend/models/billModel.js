import mongoose from "mongoose";
const billSchema = mongoose.Schema(
    {
        from_date: {
            type: Date,
            required: true,
        },
        to_date: {
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
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

const Bill = mongoose.model('Bill', billSchema);

export default Bill;