import mongoose from "mongoose";
const oilcakeSchema = mongoose.Schema(
    {
        //sold to whom
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

const OilCake = mongoose.model('Oilcake', oilcakeSchema);

export default OilCake;