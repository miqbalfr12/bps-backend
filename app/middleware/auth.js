const config = require("../../config");
const jwt = require("jsonwebtoken");

const {User} = require("../../models");

const isLoginUser = async (req, res, next) => {
 try {
  const token = req.headers.authorization
   ? req.headers.authorization.replace("Bearer ", "")
   : null;

  const data = jwt.verify(token, config.jwtKey);

  console.log(data);
  const exp = data.iat + 60 * 60 * 12;
  const currentTime = Math.floor(Date.now() / 1000);
  const timeLeft = exp - currentTime;
  console.log({iat: data.iat, exp, currentTime, timeLeft});

  if (timeLeft < 0) {
   return res.status(401).json({
    error: "Token expired",
   });
  }

  const user = await User.findOne({
   where: {
    user_id: data.user.user_id,
   },
  });

  if (user) {
   user.last_activity = new Date();
   await user.save();

   req.user = user;
   req.token = token;
   next();
  } else {
   throw new Error();
  }
 } catch (error) {
  return res.status(401).json({
   error: "Not authorized to access this resources",
  });
 }
};

module.exports = {
 isLoginUser,
};
