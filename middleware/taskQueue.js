const axios = require('axios');
const { Queue, Worker } = require('bullmq')
const Redis = require('redis');
const moment = require('moment')
const { Todo } = require('../database/models/todo.model');
const { User } = require('../database/models/user.model');

const redisConfiguration = {
    connection: {
        host: "localhost",
        port: 6379,
    }
}

const redisClient = Redis.createClient();

redisClient.connect().then(() => {
    console.log("Redis client connected")
}).catch(console.log)


const getDbTodos = async () => {
    const [year, month, day] = [new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()];
    await Todo.find({
        date: (year + "-" + month + "-" + day),
        notification: true,
        isNotified: false,
        state: "open"
    }).then(async (result) => {
        console.log(result)
        result.map(async (task) => {
            const { notifyToken } = await User.findOne({ _id: task.user_id });
            const newTodos = [...JSON.parse(await redisClient.get('todos')),
            {
                id: task._id,
                title: task.title,
                time: task.time,
                date: task.date,
                userToken: notifyToken,
            }]
            await redisClient.set('todos', JSON.stringify(newTodos));
        })
    }).catch(console.log)
}

const taskQueue = async () => {
    getDbTodos()
    const myQueue = new Queue('todosSchedule', redisConfiguration);
    const todos = JSON.parse(await redisClient.get('todos'));
    await myQueue.add('alert', todos, { repeat: false });
    let worker = new Worker('todosSchedule', async (job) => {
        todos.map(async (task, index) => {
            let now = moment(new Date()); //todays date
            let end = moment(new Date(task.date + " " + task.time))
            let diff = end.diff(now, 'minutes');
            if (diff <= 5) {
                const response = await axios.post('https://fcm.googleapis.com/fcm/send', {
                    notification:
                    {
                        title: `Your task ${task.title} is due in 5 minutes`,
                    },
                    to: task.userToken
                }, {
                    headers: {
                        'Authorization': `key=${process.env.SERVER_KEY}`
                    }
                })
                if (response.status === 200) {
                    todos.splice(index, 1)
                    await Todo.updateOne({
                        _id: task.id
                    }, {
                        notification: false,
                        isNotified: true,
                    });
                }
            }
        })
    }, redisConfiguration);
    worker.on('completed', async job => {
        // console.log("Todo sent to user")
    });
    worker.on('progress', job => {
        console.info('job is in progress!');
    });
    worker.on('failed', (job, err) => {
        console.error('job has error!');
    });
    await redisClient.set('todos', JSON.stringify(todos))
    setTimeout(() => {
        taskQueue()
    }, 60000 * 5)
}
taskQueue()

module.exports = {
    redisClient
}
