import expressFileupload from 'express-fileupload'
import express from 'express'
import dotnev from 'dotenv'

import profile from './modules/profile/profile.index.js' 
import folderConfigs from './config/fs.config.js'
import auth from './modules/auth/auth.index.js' 
import news from './modules/news/news.index.js'

folderConfigs(process.cwd(), "/uploads/")
folderConfigs(process.cwd(), "/uploads/news")
folderConfigs(process.cwd(), "/uploads/users")
dotnev.config()

const app = express()

app.use(expressFileupload())
app.use(express.json())
app.use(auth)
app.use(profile)
app.use(news)

app.get(['/home', '/'], (req, res) => res.json({ message: "home" }));

app.listen(process.env.PORT, console.log(process.env.PORT)) 