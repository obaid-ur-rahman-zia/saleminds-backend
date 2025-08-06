const crypto = require('crypto');
const config = require('config');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
function generateTransactionId() {
  return crypto.randomBytes(16).toString('hex'); // 16 bytes = 32 hex characters
}

const generateRandom = () =>  {

    const randomString = uuidv4().replace(/-/g, '').toUpperCase();;
    
    console.log(randomString);
    

    return randomString;
};

function verifyRefreshToken(token) {
  const secret = config.get("v1.JWT_SECRET");

  try {
    const decoded = jwt.verify(token, secret);
    return { success: true, data: decoded };
  } catch (error) {
    return { success: false, error: error.message };
  }
}


module.exports = {
    generateTransactionId,
    generateRandom,
    verifyRefreshToken
}