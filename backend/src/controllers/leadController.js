require("dotenv").config();
const { checkMetaLeadsValidity } = require("../services/leadShowService");
const showMetaLeadsData = async (req, res) => {
  const { clientId } = req.params;
  const { secretcode } = req.query;

  const isValid = await checkMetaLeadsValidity(clientId, secretcode);
  if (isValid) {
    res.json(isValid);
  } else return res.status(403).json({ error: "Unauthorized" });
};

module.exports = { showMetaLeadsData };
