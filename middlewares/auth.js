// create verify token miidleware that takes token from cookie and checks
// if it is valid or not
const jwt = require("jsonwebtoken");

const verifyTokenMiddleware = (req, res, next) => {
  try {
    // console.log(req.cookies);
    // console.log('req.headers["authorization"]', req.headers["authorization"]);
    const token = req.headers["authorization"].split(" ")[1];
    // console.log('req.headers["authorization"].split(" ")', req.headers["authorization"].split(" "));
    // console.log("token", token);
    if (!token) return res.sendStatus(401);
    if (token === "") return res.status(401).send({ message: "Unauthorized 1" });
    const verified = jwt.verify(token, process.env.JWTPRIVATEKEY);
    req.user = verified;
    // console.log("verified");
    next();
  } catch (error) {
    console.log(error);
    res.status(401).send({ message: "Unauthorized" });
  }
};

module.exports = verifyTokenMiddleware;
