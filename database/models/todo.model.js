const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const Todo = mongoose.model(
    "todo",
    mongoose.Schema(
        {
            title: String,
            priority: String,
            time: String,
            date: String,
            category: Array,
            motivation: String,
            color: String,
            user_id: String,
            state: { type: String, default: 'open' }
        },
        { versionKey: false }
    ).plugin(mongoosePaginate)
);


module.exports = {
    Todo
}