const jwt = require('jsonwebtoken');

// JWTu30c8u30fcu30afu30f3u3092u751fu6210u3059u308bu95a2u6570
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// u30ecu30b9u30ddu30f3u30b9u306bu30c8u30fcu30afu30f3u3092u542bu3081u308bu95a2u6570
const sendTokenResponse = (user, statusCode, res) => {
  // u30c8u30fcu30afu30f3u3092u751fu6210
  const token = generateToken(user._id);

  // Cookieu306eu8a2du5b9au30aau30d7u30b7u30e7u30f3
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true // u30afu30e9u30a4u30a2u30f3u30c8u30b5u30a4u30c9u306eJavaScriptu304bu3089u30a2u30afu30bbu30b9u3067u304du306au3044u3088u3046u306bu3059u308b
  };

  // u672cu756au74b0u5883u3067u306fHTTPSu306eu307fu3067Cookieu3092u9001u4fe1
  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
  }

  // u30afu30c3u30adu30fcu306bu30c8u30fcu30afu30f3u3092u8a2du5b9a
  res.cookie('jwt', token, cookieOptions);

  // u30ecu30b9u30ddu30f3u30b9u304bu3089u30d1u30b9u30efu30fcu30c9u3092u9664u5916
  user.password = undefined;

  // u30ecu30b9u30ddu30f3u30b9u3092u8fd4u3059
  res.status(statusCode).json({
    success: true,
    token,
    data: {
      user
    }
  });
};

module.exports = {
  generateToken,
  sendTokenResponse
};
