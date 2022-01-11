import express from 'express'

// get access to express router, this is a route file
const router = express.Router()

// demo route
router.route('/').get((req, res) => res.send('hello world'))

export default router