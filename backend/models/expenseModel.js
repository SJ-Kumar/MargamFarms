import mongoose from "mongoose";
const expenseSchema = mongoose.Schema(
    {
        name: {
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

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;