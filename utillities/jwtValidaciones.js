let jwt = require('jsonwebtoken');
const config = require('./config');

let checkToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
  if (token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }

  if (token) {
    jwt.verify(token, config.llave, (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: 'El Token no es valido',
          redirect: true
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.json({
      success: false,
      message: 'No se incluyo el Token de Acceso',
      redirect: true
    });
  }
};

module.exports = {
  checkToken: checkToken
}