const jwt = require("jsonwebtoken");

// response Function to return json
module.exports.resFunc = (status, message) => {
  return { sucess: status, message: message };
};
module.exports.generateToken = (_id, username, email) => {
  const payLoad = {
    _id: _id,
    username: username,
    email: email,
  };
  return jwt.sign(payLoad, process.env.SECRET);
};
module.exports.authenticate = (req, res, next) => {
  try {
    if (!req.headers.authorization) throw new Error("NOT AUTHENTICATED");
    const token = req.headers.authorization;
    var decoded = jwt.verify(token, process.env.SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.json({ sucess: false, message: error.message });
  }
};
