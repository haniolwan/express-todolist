const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const Todo = mongoose.model(
    "todo",
    mongoose.Schema(
        {
            title: String,
            body: String,
            color: String,
            category: Array,
            user_id: String
        },
        { versionKey: false }
    ).plugin(mongoosePaginate)
);


module.exports = {
    Todo
}