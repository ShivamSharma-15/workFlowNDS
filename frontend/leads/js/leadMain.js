async function getLeadData() {
  function toTitleCase(str) {
    return str
      .replace(/_/g, " ")
      .replace(/\s+/g, " ")
      .replace(/\s*[\(\)\?]/g, "") // remove extra symbols like () and ?
      .trim()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  // Helper: Convert ISO time to human-readable IST format
  function toIST(isoString) {
    const date = new Date(isoString); // date correctly holds the UTC timestamp from the ISO string
    return date.toLocaleString("en-IN", {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: "Asia/Kolkata", // This is the key! It tells JavaScript to format the date for IST.
    });
  }

  // Main transformation function
  function keyMapData(data) {
    const keyMap = {};

    data.field_data.forEach((field) => {
      const key = toTitleCase(field.name);
      const value = field.values.join(", ").trim();
      keyMap[key] = toTitleCase(value);
    });

    // Add human-readable Created Time in IST
    keyMap["Created Time"] = toIST(data.created_time);

    return keyMap;
  }

  function renderDetailsList(mappedData) {
    const container = document.getElementById("detailsTableId");
    if (!container) {
      console.error("Container with id 'detailsTableId' not found.");
      return;
    }

    const ul = document.createElement("ul");

    for (const [key, value] of Object.entries(mappedData)) {
      const li = document.createElement("li");

      const p = document.createElement("p");
      p.textContent = key + ":";

      const span = document.createElement("span");
      span.textContent = value;

      li.appendChild(p);
      li.appendChild(span);
      ul.appendChild(li);
    }

    // Clear existing content and insert new list
    container.innerHTML = "";
    container.appendChild(ul);
  }

  // Extract clientId and secretcode from URL
  const pathParts = window.location.pathname.split("/");
  const clientId = pathParts[4];
  const urlParams = new URLSearchParams(window.location.search);
  const secretCode = urlParams.get("secretcode");

  if (!clientId || !secretCode) {
    console.error("Missing clientId or secretcode in URL.");
    return;
  }

  const endpoint = `/apps/leadsmart/leads-view/${clientId}/lead?secretcode=${encodeURIComponent(
    secretCode
  )}`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const responseData = await response.json();

    // Call keyMapData on successful response
    const mappedData = keyMapData(responseData);
    renderDetailsList(mappedData);
    console.log("Mapped Data:", mappedData);

    // You can now use mappedData wherever needed
  } catch (err) {
    console.error("Failed to fetch data:", err);
  }
}
document.addEventListener("DOMContentLoaded", () => {
  (async () => {
    await getLeadData();
  })();
});
