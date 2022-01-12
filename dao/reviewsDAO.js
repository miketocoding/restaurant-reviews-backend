import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

let reviews

export default class ReviewsDAO {
  static async injectDB(conn) {
    // console.log('before if reviews')
    // if reviews exist then return
    if (reviews) {
      // console.log('yes reviews')
      return
    }
    try {
      // console.log('no reviews, lets add one')
      // if not access db and the reviews collection.
      // mongodb - if it doesn't exist, it will be create a document
      reviews = await conn.db(process.env.RESTREVIEWS_NS).collection("reviews")
    } catch (e) {
      console.error(`Unable to establish collection handles in userDAO: ${e}`)
    }
  }

  // add a review
  static async addReview(restaurantId, user, review, date) {
    try {
      const reviewDoc = { name: user.name,
          user_id: user._id,
          date: date,
          text: review,
          restaurant_id: ObjectId(restaurantId), }

      // insert the review
      // console.log({reviews})
      return await reviews.insertOne(reviewDoc)
    } catch (e) {
      console.error(`Unable to post review: ${e}`)
      return { error: e }
    }
  }

  // update the review
  static async updateReview(reviewId, userId, text, date) {
    try {
      // looking for a review that has the right reviewid and userid
      const updateResponse = await reviews.updateOne(
        { user_id: userId, _id: ObjectId(reviewId)},
        { $set: { text: text, date: date  } },
      )

      return updateResponse
    } catch (e) {
      console.error(`Unable to update review: ${e}`)
      return { error: e }
    }
  }

  // delete review
  static async deleteReview(reviewId, userId) {

    try {
      // look for user that has the right reviewid and userid
      const deleteResponse = await reviews.deleteOne({
        _id: ObjectId(reviewId),
        user_id: userId,
      })

      return deleteResponse
    } catch (e) {
      console.error(`Unable to delete review: ${e}`)
      return { error: e }
    }
  }
}