const rawBody = (req, res, next) => {
  req.rawBody = "";
  req.on("data", function(chunk) {
    req.rawBody += chunk;
  });
  next();
};

module.exports = rawBody;
