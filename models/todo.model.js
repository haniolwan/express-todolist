const mongoose = require('mongoose');

const Todo = mongoose.model(
    "todo",
    mongoose.Schema(
        {
            title: String,
            body: String,
            color: String,
            category: Array,
            user: String
        },
    )
);


module.exports = {
    Todo
}