import RestaurantsDAO from '../dao/restaurantsDAO.js'

export default class RestaurantsController {
  // method - apigetrestaurants
  static async apiGetRestaurants(req, res, next) {
    // req.query comes after question mark
    // query string - restaurantsPerPage. if exists convert to number else 20
    const restaurantsPerPage = req.query.restaurantsPerPage ? parseInt(req.query.restaurantsPerPage, 10) : 20
    // if we pass in page number with URL, convert to int. if not page number 0
    const page = req.query.page ? parseInt(req.query.page, 10) : 0

    // filter starts as empty object
    let filters = {}
    // unless we see query string
    if (req.query.cuisine) {
      filters.cuisine = req.query.cuisine
    } else if (req.query.zipcode) {
      filters.zipcode = req.query.zipcode
    } else if (req.query.name) {
      filters.name = req.query.name
    }

    // now call getRestaurants and give list and total num
    const { restaurantsList, totalNumRestaurants } = await RestaurantsDAO.getRestaurants({
      filters,
      page,
      restaurantsPerPage
    })

    // what we respond with
    let response = {
      restaurants: restaurantsList,
      page: page,
      filters: filters,
      entries_per_page: restaurantsPerPage,
      total_results: totalNumRestaurants,
    }
    // send a json response with all this information
    res.json(response)
  }
}