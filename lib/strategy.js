var OAuth2Strategy = require('passport-oauth2')
var util = require('util')
var uri = require('url')
var Profile = require('./profile')
var InternalOAuthError = require('passport-oauth2').InternalOAuthError

/**
 * `Strategy` constructor.
 *
 * The Punwave authentication strategy authenticates requests by delegating to
 * Punwave using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `cb`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your Punwave application's App ID
 *   - `clientSecret`  your Punwave application's App Secret
 *   - `callbackURL`   URL to which Punwave will redirect the user after granting authorization
 *
 * Examples:
 *
 *     passport.use(new PunwaveStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/punwave/callback'
 *       },
 *       function(accessToken, refreshToken, profile, cb) {
 *         User.findOrCreate(..., function (err, user) {
 *           cb(err, user)
 *         })
 *       }
 *     ))
 *
 * @constructor
 * @param {object} options
 * @param {function} verify
 * @access public
 */
function Strategy (options, verify) {
  options = options || {}
  options.authorizationURL = options.authorizationURL || 'https://api.punwave.com/oauth2/authorize'
  options.tokenURL = options.tokenURL || 'https://api.punwave.com/oauth2/token'
  options.scopeSeparator = options.scopeSeparator || ','

  OAuth2Strategy.call(this, options, verify)
  this.name = 'punwave'
  this._profileURL = options.profileURL || 'https://api.punwave.com/oauth2/users/me'
  this._profileFields = options.profileFields || null
  this._clientSecret = options.clientSecret
}

// Inherit from `OAuth2Strategy`.
util.inherits(Strategy, OAuth2Strategy)

/**
 * Authenticate request by delegating to Punwave using OAuth 2.0.
 *
 * @param {http.IncomingMessage} req
 * @param {object} options
 * @access protected
 */
Strategy.prototype.authenticate = function (req, options) {
  OAuth2Strategy.prototype.authenticate.call(this, req, options)
}

/**
 * Retrieve user profile from Punwave.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `punwave`
 *   - `id`               the user's Punwave ID
 *   - `username`         the user's Punwave username
 *   - `displayName`      the user's full name
 *   - `name.lastname  `  the user's last name
 *   - `name.firstName`   the user's first name
 *   - `emails`           the proxied or contact email address granted by the user
 *
 * @param {string} accessToken
 * @param {function} done
 * @access protected
 */
Strategy.prototype.userProfile = function (accessToken, done) {
  var url = uri.parse(this._profileURL)
  url = uri.format(url)

  this._oauth2.get(url, accessToken, function (err, body, res) {
    var json

    if (err) {
      if (err.data) {
        try {
          json = JSON.parse(err.data)
        } catch (_) {}
      }

      return done(new InternalOAuthError('Failed to fetch user profile', err))
    }

    try {
      json = JSON.parse(body)
    } catch (ex) {
      return done(new Error('Failed to parse user profile'))
    }

    var profile = Profile.parse(json)
    profile.provider = 'punwave'
    profile._raw = body
    profile._json = json

    done(null, profile)
  })
}

/**
 * Parse error response from Punwave OAuth 2.0 token endpoint.
 *
 * @param {string} body
 * @param {number} status
 * @return {Error}
 * @access protected
 */
Strategy.prototype.parseErrorResponse = function (body, status) {
  return OAuth2Strategy.prototype.parseErrorResponse.call(this, body, status)
}

// Expose constructor.
module.exports = Strategy
