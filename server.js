// configure an express server
// attach cors, express.json middleware, and routes

import express from "express"
import cors from "cors"
import restaurants from "./api/restaurants.route.js"

const app = express()

// apply our middleware, things express will use
app.use(cors())
// no need to use body parser
// Server can now accept json in body of request
app.use(express.json())

// specify initial url
// routes will all be in restaurants file
app.use('/api/v1/restaurants', restaurants)
// if anyone goes to route not in route file, return something
app.use('*', (req, res) => res.status(404).json({ error: 'not found'}))

// export app as a module
// later import module in file that accesses database
export default app