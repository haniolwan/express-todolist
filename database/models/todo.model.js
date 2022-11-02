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
            state: { type: String, default: 'open' },
            notification: { type: Boolean, default: false },
            isNotified: { type: Boolean, default: false },
        },
        { timestamps: true },
        { versionKey: false }
    ).index({ title: 'text' })
        .plugin(mongoosePaginate)
);

// testing vim this normal writting now we need:wq



module.exports = {
    Todo
}