const Fetch = require("node-fetch")

module.exports = async function(URL, Headers) {
    const Response = await Fetch(
        URL,
        {
            headers: Headers
        }
    )
    const Json = await Response.json()
    return Json
}