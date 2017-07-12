/**
 * Parse profile.
 *
 * @param {object|string} json
 * @return {object}
 * @access public
 */
exports.parse = function (json) {
  if (typeof json === 'string') json = JSON.parse(json)

  var profile = {}
  profile.id = json.id
  profile.username = json.username
  profile.displayName = json.name || json.profile.name,
  profile.name = {
    firstName: json.firstName || json.profile.firstName,
    lastName: json.lastName || json.profile.lastName
  }
  profile.email = json.email

  return profile
}
