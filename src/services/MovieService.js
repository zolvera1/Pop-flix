var json = require('./API-data.json')
export default class MovieSerivce {
getMovies = () => {
return json ? json : {}
}
}