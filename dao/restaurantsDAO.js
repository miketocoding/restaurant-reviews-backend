// dao - data access object
// create variable to use to store reference to db
let restaurants

export default class RestaurantsDAO {
  // injectdb method. How we initially connect
  // call this method as soon as server starts
  // get reference to restaurants db
  static async injectDB(conn) {
    // if filled, then return
    if (restaurants) {
      return
    }
    // if not fill it with a refernce to that db
    // environmental variable - RESTREVIEWS_NS
    // collection - 'restaurants'
    try {
      // specifically getting restaurants and not neighborhoods from sample data
      // console.log("I have injectDB")
      // console.log({restaurants})
      restaurants = await conn.db(process.env.RESTREVIEWS_NS).collection("restaurants")
      // console.log({restaurants})
      // if can't get it send error to console
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in restaurantsDAO: ${e}`
      )
    }
  }

  // call when we want to get list of all restaurants from db
  static async getRestaurants({
    // options made up for this method
    // filters to sort by
    filters = null,
    // defaults to page 0
    page = 0,
    // get 20 with default setting
    restaurantsPerPage = 20,
  } = {}) {
    let query
    // 3 different filters set up
    if (filters) {
      // search by name
      if('name' in filters) {
        // $text - mongodb text search
        // search text for anything with that name
        // need to set up in mongodb which will search for name not in db field.
        // which fields from db will be searched for specific string
        query = { $text: { $search: filters['name']}}
        // search by cuisine
      } else if ('cuisine' in filters) {
        // if cuisine from DB = cuisine passed in
        // search for specific cuisine
        // $eq - mongodb equals
        query = {'cuisine': { $eq: filters['cuisine']}}
        // search by zipcode
      } else if ('zipcode' in filters) {
        // address.zipcode - db field
        query = {'address.zipcode': { $eq: filters['zipcode']}}
      }
    }

    let cursor

    try {
      // find all restaurants from db that match query passed in
      // if blank query, will return all restaurants
      cursor = await restaurants
        .find(query)
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      // if error, return empty list and return 0
      return { restaurantsList: [], totalNumRestaurants: 0 }
    }

    // if no error, limit result to restaurantsPerPage(20)
    // to get page number - skip to get specific page of results
    const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage * page)


    try {
      // set restaurantsList to an array
      const restaurantsList = await displayCursor.toArray()
      const totalNumRestaurants = await restaurants.countDocuments(query)

      // return the array
      return { restaurantsList, totalNumRestaurants }
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`,
      )
      // if error return this
      return { restaurantsList: [], totalNumRestaurants: 0}
    }
  }
}