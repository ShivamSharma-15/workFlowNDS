const { allowedRoutesModel } = require("../model/generalModel");
async function allowedRoutes(targetUrl) {
  const isAllowed = await allowedRoutesModel();

  if (!isAllowed) return false;

  // Check if targetUrl matches any website_url in the result
  return isAllowed.some((row) => row.website_url === targetUrl);
}
module.exports = { allowedRoutes };
