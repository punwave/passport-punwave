/**
 * Parse profile.
 *
 * @param {object|string} json
 * @return {object}
 * @access public
 */
exports.parse = function (json) {
  if (typeof json === 'string') {
    json = JSON.parse(json)
  }

  var profile = {}
  profile.id = json.id
  profile.username = json.username
  profile.displayName = json.name
  profile.name = {
    firstName: json.firstName,
    lastName: json.lastName
  }

  if (json.email) {
    profile.emails = [{ value: json.email }]
  }

  return profile
}
