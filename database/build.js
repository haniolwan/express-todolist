const { default: mongoose } = require("mongoose");
const { Todo } = require("./models/todo.model");
const { User } = require("./models/user.model");
const todosData = require('./fakeData/todos.json');
const usersData = require('./fakeData/users.json');


const buildFakeData = async () => {
    try {
        await Promise.all([
            await Todo.deleteMany({}),
            await User.deleteMany({})
        ])

        await Promise.all([
            await Todo.insertMany(todosData.todos),
            await User.insertMany(usersData.users)
        ])

        await setTimeout(() => {
            mongoose.connection.close();
        }, 15000)

        console.log("Fake Data Built")
    }
    catch (error) {
        console.log(error)
    }
}

if (process.env.NODE_ENV === 'dev') {
    return buildFakeData();
}

module.exports = {
    buildFakeData
}