import express from 'express'
// create controller route file will use
import RestaurantsCtrl from './restaurants.controller.js'
import ReviewsCtrl from './reviews.controller.js'

// get access to express router, this is a route file
const router = express.Router()

// demo route
// router.route('/').get((req, res) => res.send('hello world'))
// get whats in this
// restaurantsctrl - file
// apiGetRestaurants - method
router.route('/').get(RestaurantsCtrl.apiGetRestaurants)

router
  .route('/review')
  .post(ReviewsCtrl.apiPostReview)
  .put(ReviewsCtrl.apiUpdateReview)
  .delete(ReviewsCtrl.apiDeleteReview)

export default router