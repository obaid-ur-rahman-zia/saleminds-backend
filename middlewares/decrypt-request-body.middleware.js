const { decrypt } = require('../utils/encryption'); // custom decryption logic

module.exports = (req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    try {
      if (req.body && typeof req.body === 'object' && req.body.data) {
        const decrypted = decrypt(req.body.data);
        req.body = JSON.parse(decrypted);
      }
    } catch (err) {
      console.error('Failed to decrypt request body:', err);
      return res.status(400).json({ message: 'Invalid data' });
    }
  }
  next();
};
