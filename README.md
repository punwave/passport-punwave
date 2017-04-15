# passport-punwave

[![Build](https://img.shields.io/travis/punwave/passport-punwave.svg)](https://travis-ci.org/punwave/passport-punwave)
[![Coverage](https://img.shields.io/coveralls/punwave/passport-punwave.svg)](https://coveralls.io/r/punwave/passport-punwave)
[![Quality](https://img.shields.io/codeclimate/github/punwave/passport-punwave.svg?label=quality)](https://codeclimate.com/github/punwave/passport-punwave)
[![Dependencies](https://img.shields.io/david/punwave/passport-punwave.svg)](https://david-dm.org/punwave/passport-punwave)


[Passport](http://passportjs.org/) strategy for authenticating with Punwave using the OAuth 2.0 API.

This module lets you authenticate using Punwave in your Node.js applications.
By plugging into Passport, Punwave authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

    $ npm install passport-punwave

## Usage

#### Configure Strategy

The Punwave authentication strategy authenticates users using a Punwave
account and OAuth 2.0 tokens.  The app ID and secret obtained when creating an
application are supplied as options when creating the strategy.  The strategy
also requires a `verify` callback, which receives the access token and optional
refresh token, as well as `profile` which contains the authenticated user's
Punwave profile.  The `verify` callback must call `cb` providing a user to
complete authentication.

```js
passport.use(new PunwaveStrategy({
    clientID: PUNWAVE_APP_ID,
    clientSecret: PUNWAVE_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/punwave/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ punwaveId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));
```

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'punwave'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```js
app.get('/auth/punwave',
  passport.authenticate('punwave'));

app.get('/auth/punwave/callback',
  passport.authenticate('punwave', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
```

## License

MIT
