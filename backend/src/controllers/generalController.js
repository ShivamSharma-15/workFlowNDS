const { allowedRoutes } = require("../services/generalService");
const redirectController = async (req, res) => {
  const targetUrl = req.query.url;
  const allowed = await allowedRoutes(targetUrl);
  if (!allowed) {
    res.redirect("https://ai.nds.studio");
  }
  res.redirect(targetUrl);
};

module.exports = { redirectController };
