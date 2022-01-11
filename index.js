// connect to DB and start the server
import app from './server.js'
import mongodb from 'mongodb'
import dotenv from 'dotenv'
// now configure dotenv
dotenv.config()
// get access to mongo client
const MongoClient = mongodb.MongoClient

// to access and environment variable
const port = process.env.PORT || 8000

// access the db
MongoClient.connect(
  // once connect to DB need to pass in information
  // our env variables - restreviews_db_uri
  process.env.RESTREVIEWS_DB_URI,
  {
    // pass in options for accessing the db
    // only 50 people can access at one time
    // pool size is not supported at parse options
    // poolSize: 50,
    // after 2500ms request will timeout
    wtimeoutMS: 2500,
    // This is causing error with starting server
    // useNewUrlParse: true 
  }
  )
  .catch(err => {
    console.error(err.stack)
    process.exit(1)
  })
  .then(async client => {
    // how we start app server after db connected
    app.listen(port, () => {
      console.log(`listening on port ${port}`)
    })
  })