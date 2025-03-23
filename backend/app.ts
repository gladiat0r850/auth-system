const cors = require('cors')
const express = require('express')
const app = express()
const {Server, Socket} = require('socket.io')
import { Request, Response } from "express"
const mongoose = require('mongoose')
const crypto = require('crypto')
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:3000'
}))
const schema = new mongoose.Schema({
    content: {type: String, required: true},
    id: {type: String, required: true},
    robux: {type: Number, required: true}
})
mongoose.connect('mongodb://127.0.0.1:27017/todo')
const model = mongoose.model('dc', schema)

const listener = app.listen(5000, (error: Error) => {
    if(error) throw new Error()
    console.log(`listening to 5000`)
})

const io = new Server(listener, () => {
    cors: {
        origin: 'http://localhost:3000';
        methods: ['GET', 'POST', 'DELETE']
    }
})

app.get('/', async (req: Request, res: Response) => {
   const document = await model.find()
   console.log(document)
   res.json(document)
})
app.post('/', async (req: Request, res: Response) => {
    const {content} = req.body
    const user = new model({content, id: crypto.randomUUID(), robux: 0})
    await user.save()
    console.log(await model.find())
    return res.status(201).json(user)
})
app.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedItem = await model.deleteOne({ id });
        if (deletedItem.deletedCount === 1) {
            return res.status(200).json(deletedItem);
        } else {
            return res.status(404).json({ message: "Item not found" });
        }
    } catch (error) {
        console.error("Error deleting item:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
app.post('/:id', async (req: Request, res: Response) => {
    try{
        const {name} = req.body
        const User = await model.findOne({name})
        console.log(User)
        if(!User){
            res.status(404).json({error: 'User is undefined'})
        }
        res.status(200).json(User)
    }catch(error){
        console.error(error)
    }
})
app.patch('/:id', async (req: Request, res: Response) => {
    try{
        const {id} = req.params
        const User = await model.findOne({id})
        if(User){
            User.robux = User.robux + 1
            await User.save()
            res.status(200).send(User)
        }
    }catch(error){
        console.error(error)
    }
})

io.on('connect', (socket: typeof Socket) => {
    console.log(`User connected: ${socket.id}`)
    socket.on('sendMessage', (message: string) => {
        io.emit("receive", message)
    })
})