const cors = require('cors')
const express = require('express')
const app = express()
import { Request, Response } from "express"
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const env = require("dotenv").config()
app.use(cookieParser())
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))
mongoose.connect('mongodb://127.0.0.1:27017/todo')
interface IUser {
    id?: string
    name?: string,
    password?: string,
    email?: string
}
const schema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    id: {type: String, required: true}
})
const model = mongoose.model('dcs', schema)
let currentUser : IUser | null

app.post('/sign-up', async (req: Request, res: Response) => {
    try{
    const {name, password, email, id} = req.body
    const emailExists = await model.findOne({email})
    const nameExists = await model.findOne({name})
    if(emailExists || nameExists){
        return res.status(404).json({error: 'User exists. Try a different one.'})
    }
    const user = new model({
        name,
        password: await bcrypt.hash(password, 15),
        email,
        id
    })
    await user.save()
    return res.status(201).send({success: true, message: 'Account created succesfully'})
    }catch(error){
        return res.status(500).json({error: 'Something went wrong'})
    }
}) 

app.post('/log-in/:id', async (req: Request, res: Response) => {
    try{
        const {email, password} = req.body
        const userExists: IUser = await model.findOne({email})
        const passwordIsEqual = await bcrypt.compare(password, userExists.password)

        const token = jwt.sign({id: userExists.id, email: userExists.email}, process.env.JWT_TOKEN, {expiresIn: '1h'})

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            maxAge: 60 * 60 * 1000,
            sameSite: 'lax'
        })
        setTimeout(() => {
            currentUser == null
        }, 10 * 10 * 6000);
        
        if(userExists && passwordIsEqual && email === userExists.email){
            currentUser = userExists
            console.log(`Succesfully logged into ${userExists.name}!`)
            return res.status(200).send({currentUser, token})
        }
    }catch(error){
        return res.status(500).json({error: 'Something went wrong'})
    }
})
app.get('/verify-token', async (req: Request, res: Response) => {
    const token = req.cookies.token
    if(!token) return res.status(401).json({error: "My man theres no token here"})

    try{
        const decoded = jwt.verify(token, 'blablabla')
        return res.status(200).json({success: true, user: decoded})
    }catch(error){
        return res.status(401).json({ error: "Invalid token" })
    }
})
app.get('/dashboard', async (req: Request, res: Response) => {
    res.json(currentUser)
})
app.post('/sign-out', async (req: Request, res: Response) => {
    const token = req.cookies.token
    try{
        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: 'lax'
        })
        currentUser = null
        return res.status(201).send({token, currentUser})
    }catch(error){
        res.status(404).json({error})
    }
})
app.delete('/delete-account', async (req: Request, res: Response) => {
    try{
        const email = req.body.email
        const selectedUser = await model.deleteOne({email})
        return res.status(200).send(selectedUser)
    }catch(error){
        console.log(error)
        return res.status(500).json({error: 'Something went wrong'})
    }
})

app.listen(process.env.PORT, (error: Error) => {
    if(error) throw new Error()
    console.log(`listening to ${process.env.PORT}`)
})

