import ReviewsDAO from '../dao/reviewsDAO.js'

export default class ReviewsController {
  // post review method
  static async apiPostReview(req, res, next) {
    try{
      // get info from body of request
      const restaurantId = req.body.restaurant_id
      const review = req.body.text
      const userInfo = {
        name: req.body.name,
        _id: req.body.user_id
      }
      const date = new Date()

      // changed ReviewResponse --> reviewResponse
      const reviewResponse = await ReviewsDAO.addReview(
        restaurantId,
        userInfo,
        review,
        date,
      )
      res.json({ status: 'success' })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  // update
  static async apiUpdateReview(req, res, next) {
    try {
      const reviewId = req.body.review_id
      const text = req.body.text
      const date = new Date()

      // get user id to make sure users match for update
      const reviewResponse = await ReviewsDAO.updateReview(
        reviewId,
        req.body.user_id,
        text,
        date,
      )

      var { error } = reviewResponse
      if (error) {
        res.status(400).json({ error })
      }

      if (reviewResponse.modifiedCount === 0) {
        throw new Error(
          'Unable to update review - user may not be original poster',
        )
      }

      res.json({ status: 'success' })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  // delete review
  // simple authentication - normally delete doesn't contain a body
  static async apiDeleteReview(req, res, next) {
    try{
      // query param
      const reviewId = req.query.id
      // get user id in body. Non standard to get things from body
      const userId = req.body.user_id
      console.log(reviewId)
      const reviewResponse = await ReviewsDAO.deleteReview(
        reviewId,
        userId,
      )
      res.json({ status: 'success' })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }
}