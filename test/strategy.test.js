/* global describe, it, expect, before */
/* jshint expr: true */

var chai = require('chai')
  , PunwaveStrategy = require('../lib/strategy');


describe('Strategy', function() {
    
  describe('constructed', function() {
    var strategy = new PunwaveStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      },
      function() {});
    
    it('should be named punwave', function() {
      expect(strategy.name).to.equal('punwave');
    });
  })
  
  describe('constructed with undefined options', function() {
    it('should throw', function() {
      expect(function() {
        var strategy = new PunwaveStrategy(undefined, function(){});
      }).to.throw(Error);
    });
  })

  describe('authorization request with display parameter', function() {
    var strategy = new PunwaveStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      }, function() {});
    
    
    var url;

    before(function(done) {
      chai.passport.use(strategy)
        .redirect(function(u) {
          url = u;
          done();
        })
        .req(function(req) {
        })
        .authenticate();
    });

    it('should be redirected', function() {
      expect(url).to.equal('https://api.punwave.com/oauth/authorize?response_type=code&client_id=ABC123');
    });
  });
  
  describe('failure caused by user denying request', function() {
    var strategy = new PunwaveStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      }, function() {});
    
    
    var info;
  
    before(function(done) {
      chai.passport.use(strategy)
        .fail(function(i) {
          info = i;
          done();
        })
        .req(function(req) {
          req.query = {};
          req.query.error = 'access_denied';
          req.query.error_code = '200';
          req.query.error_description  = 'Permissions error';
          req.query.error_reason = 'user_denied';
        })
        .authenticate();
    });
  
    it('should fail with info', function() {
      expect(info).to.not.be.undefined;
      expect(info.message).to.equal('Permissions error');
    });
  });
  
  describe('error caused by invalid code sent to token endpoint', function() {
    var strategy = new PunwaveStrategy({
        clientID: 'ABC123',
        clientSecret: 'secret'
      }, function() {});
      
    strategy._oauth2.getOAuthAccessToken = function(code, options, callback) {
      return callback({ error: 'invalid_grant', error_description: 'Invalid authorization code' });
    };
  
  
    var err;

    before(function(done) {
      chai.passport.use(strategy)
        .error(function(e) {
          err = e;
          done();
        })
        .req(function(req) {
          req.query = {};
          req.query.code = 'SplxlOBeZQQYbYS6WxSbIA+ALT1';
        })
        .authenticate();
    });

    it('should error', function() {
      expect(err.constructor.name).to.equal('InternalOAuthError');
    });
  }); // error caused by invalid code sent to token endpoint
  
});