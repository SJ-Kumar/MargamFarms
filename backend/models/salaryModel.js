import mongoose from "mongoose";
const salarySchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
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
            required: false,
        }
    },
    {
        timestamps: true,
    }
);

const Salary = mongoose.model('Salary', salarySchema);

export default Salary;