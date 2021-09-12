const jwt = require('express-jwt');
const jwksClient = require('jwks-rsa');
const config = require('../config/dev');

//* 참고
// https://auth0.com/docs/quickstart/backend/nodejs/01-authorization

//* Authentication middleware
// req authorization headers안에있는 액세스토큰 체크하는 미들웨어
// access token Auth0 JSON web key set 체크.
// 체크하면서 req.user 객체가 생긴다.
exports.checkJwt = jwt({
  secret: jwksClient.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 10,
    jwksUri: 'https://junpil.jp.auth0.com/.well-known/jwks.json' // 키제공
  }),
  audience: 'https://junpil.jp.auth0.com/api/v2/',
  issuer: 'https://junpil.jp.auth0.com/',
  algorithms: ['RS256']
});

exports.checkRole = (role) => (req, res, next) => {
  const user = req.user;
  if (user && user[config.AUTH0_NAMESPACE + '/roles'].includes(role)) {
    next();
  } else {
    return res.status(401).send('You are not authorized to access this resource');
  }
}