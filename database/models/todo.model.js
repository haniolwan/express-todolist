const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const Todo = mongoose.model(
    "todo",
    mongoose.Schema(
        {
            title: String,
            priority: { type: String, default: '' },
            time: String,
            date: String,
            category: Array,
            motivation: String,
            color: String,
            user_id: String,
            state: { type: String, default: 'open' }
        },
        { timestamps: true },
        { versionKey: false }
    ).plugin(mongoosePaginate)
);


module.exports = {
    Todo
}