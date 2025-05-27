const { getValidationForLeadEntry } = require("../model/leadShowModel");
async function checkMetaLeadsValidity(clientId, secretcode) {
  const validatedData = await getValidationForLeadEntry(clientId, secretcode);
  if (!validatedData) {
    return null;
  } else return validatedData;
}
module.exports = { checkMetaLeadsValidity };
