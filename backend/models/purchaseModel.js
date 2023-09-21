import mongoose from "mongoose";
const purchaseSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        //From whom
        brand: {
            type: String,
            required: true,
        },
        //For what
        category: {
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
        }
    },
    {
        timestamps: true,
    }
);

const Purchase = mongoose.model('Purchase', purchaseSchema);

export default Purchase;