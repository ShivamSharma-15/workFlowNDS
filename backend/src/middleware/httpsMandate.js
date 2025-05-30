function enforceHttps(req, res, next) {
  if (req.secure) {
    return next();
  }
  return res.status(403).json({ error: "HTTPS Required" });
}

module.exports = { enforceHttps };
