document.addEventListener("DOMContentLoaded", () => {
  const name = document.getElementById("nameForm");
  const number = document.getElementById("numberForm");
  const email = document.getElementById("emailForm");
  const fbPageId = document.getElementById("fbIdForm");
  const brandImage = document.getElementById("brandImageForm");
  const subEmail = document.getElementById("subEmail");
  const subWA = document.getElementById("subWhatsapp");
  const recEmail = document.getElementById("emailSubEmail");
  const ccEmail = document.getElementById("ccSubEmail");
  const sendEmailToLead = document.getElementById("EmailCheckBox");
  const waSubbedNumber = document.getElementById("waSubNumber");
  const sendWaToLead = document.getElementById("WhatsappCheckBox");
  const brandName = document.getElementById("brandName");
  const webisteURL = document.getElementById("websiteUrl");
  const form = document.getElementById("onboardForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const numberF = isValidNumber(number.value);
    const nameF = isValidName(name.value);
    const emailF = isValidEmail(email.value);
    const fbPageIdF = isValidfbPageId(fbPageId.value);
    const brandImageF = isValidBrandImage(brandImage)
      ? brandImage.files[0]
      : null;
    const brandNameF = isValidName(brandName.value);
    const websiteURLF = webisteURL.value;
    if (
      numberF === null ||
      nameF === null ||
      emailF === null ||
      fbPageIdF === null ||
      brandImageF === null ||
      brandNameF === null ||
      websiteURLF === null
    ) {
      return alert("Incorrect form data");
    }
    let subEmailF;
    let recEmailF;
    let ccEmailF;
    let sendEmailToLeadF;
    if (subEmail.checked) {
      subEmailF = true;
      if (recEmail.value) {
        recEmailF = isValidEmail(recEmail.value);
        if (ccEmail.value !== "") {
          const a = ccEmail.value;
          const b = a.split(" ").join("").split(",");
          ccEmailF = checkCc(b);
        } else {
          ccEmailF = null;
        }
      } else {
        subEmailF = false;
        recEmailF = null;
        ccEmailF = null;
      }
      sendEmailToLeadF = sendEmailToLead.checked ? true : false;
    } else {
      subEmailF = false;
      recEmailF = null;
      ccEmailF = null;
      sendEmailToLeadF = false;
    }
    let subWAF;
    let waSubbedNumberF;
    let sendWaToLeadF;
    if (subWA.checked) {
      subWAF = true;
      if (waSubbedNumber.value !== "") {
        const a = waSubbedNumber.value;
        const b = a.split(" ").join("").split(",");
        waSubbedNumberF = checkWa(b);
      } else {
        waSubbedNumberF = null;
      }
      sendWaToLeadF = sendWaToLead.checked ? true : false;
    } else {
      subWAF = false;
      waSubbedNumberF = null;
      sendWaToLeadF = false;
    }
    const body = JSON.stringify({
      nameF,
      numberF,
      emailF,
      fbPageIdF,
      subEmailF,
      subWAF,
      recEmailF,
      ccEmailF,
      sendEmailToLeadF,
      waSubbedNumberF,
      sendWaToLeadF,
      brandNameF,
      websiteURLF,
    });
    const formData = new FormData();

    formData.append("image", brandImageF);

    const bodyFields = JSON.parse(body);
    for (const key in bodyFields) {
      formData.append(key, bodyFields[key]);
    }

    fetch("/apps/leadsmart/onboarding", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Success");
      })
      .catch((error) => {
        alert("Failure");
        console.error("Upload failed:", error);
      });
  });
});

// Helper functions

function isValidNumber(number) {
  const digitsOnly = number.replace(/\D/g, "");
  const trimmedDigits = digitsOnly.trim();
  const tenDigitRegex = /^\d{10}$/;
  if (tenDigitRegex.test(trimmedDigits)) {
    return trimmedDigits;
  } else {
    return null;
  }
}
function isValidURL(input) {
  if (typeof input !== "string") return null;

  const trimmed = input.trim();

  try {
    const url = new URL(trimmed);
    if (url.protocol !== "https:") return null;
    if (url.search || url.hash) return null;
    if (!url.pathname || url.pathname === "/") return null;

    let sanitized = `${url.origin}${url.pathname.replace(/\/$/, "")}`;

    return sanitized;
  } catch {
    return null;
  }
}

function isValidEmail(email) {
  const trimmedInput = email.trim();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (emailRegex.test(trimmedInput)) {
    if (trimmedInput.length < 50) return trimmedInput;
    else return null;
  } else {
    return null;
  }
}
function isValidName(name) {
  const trimmedInput = name.trim();
  if (trimmedInput === "") {
    return null;
  }
  const cleanedName = trimmedInput.replace(/[^a-zA-Z\s-']/g, "");
  const normalizedName = cleanedName.replace(/\s+/g, " ").trim();
  console.log(normalizedName);
  if (normalizedName.length > 0 && normalizedName.length < 100) {
    return normalizedName;
  } else {
    return null;
  }
}
function isValidfbPageId(fbId) {
  const trimmedInput = fbId.trim();
  if (trimmedInput === "") {
    return null;
  }
  if (trimmedInput.length >= 50) {
    return null;
  }
  const alphanumericNoSpacesRegex = /^[a-zA-Z0-9]+$/;
  if (alphanumericNoSpacesRegex.test(trimmedInput)) {
    return trimmedInput;
  } else {
    return null;
  }
}
function isValidBrandImage(fileInput) {
  if (!fileInput instanceof HTMLInputElement || fileInput.type !== "file") {
    return false;
  }
  const file = fileInput.files[0];
  if (!file) {
    return false;
  }
  const MAX_FILE_SIZE_BYTES = 200 * 1024;
  const allowedTypes = ["image/png", "image/jpeg"];
  if (!allowedTypes.includes(file.type)) {
    return false;
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const fileSizeKB = (file.size / 1024).toFixed(2);
    return false;
  }
  return true;
}
function checkCc(b) {
  let output = [];
  for (let i = 0; i < b.length; i++) {
    let emails = isValidEmail(b[i]);
    if (emails === null) {
      return null;
    }
    output.push(emails);
  }
  return output.join(",");
}
function checkWa(b) {
  let output = [];
  let twelveDigitRegex = /^\d{12}$/;
  for (let i = 0; i < b.length; i++) {
    let digitsOnly = b[i].replace(/\D/g, "");
    let trimmedDigits = digitsOnly.trim();
    if (twelveDigitRegex.test(trimmedDigits)) {
      output.push(trimmedDigits);
    } else {
      return null;
    }
  }
  return output.join(",");
}
