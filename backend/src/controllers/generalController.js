const { allowedRoutes } = require("../services/generalService");
const redirectController = async (req, res) => {
  const targetUrl = req.query.url;
  const allowed = await allowedRoutes(targetUrl);
  if (!allowed) {
    return res.redirect("https://ai.nds.studio");
  }
  return res.redirect(targetUrl);
};

module.exports = { redirectController };
