const formStep1 = document.getElementById("registrationForm");
const formStep2 = document.getElementById("securityForm");
const confirmation = document.getElementById("confirmationScreen");

const username = document.getElementById("username");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const terms = document.getElementById("terms");
const captcha = document.getElementById("captcha");
const successMessage = document.getElementById("successMessage");
const darkToggle = document.getElementById("darkModeToggle");
const strengthMeter = document.getElementById("strengthMeter");

formStep2.addEventListener("submit", function (e) {
  e.preventDefault();
  validateStep2();

  const errors = formStep2.querySelectorAll("input.error");
  const allValid =
    errors.length === 0 && terms.checked && captcha.value.trim() === "5";

  if (allValid) {
    formStep2.classList.remove("active");
    confirmation.classList.add("active");
    showModal();

    // Wait for modal to appear, then show toast
    setTimeout(() => {
      showToast("Registration complete!");
    }, 300); // You can increase to 500 if needed
  }
});

function showModal() {
  const modal = document.getElementById("modalOverlay");
  modal.style.display = "flex";

  // Auto-close modal after 3 seconds
  setTimeout(() => {
    modal.style.display = "none";
  }, 3000);
}

document.getElementById("closeModalBtn").addEventListener("click", () => {
  document.getElementById("modalOverlay").style.display = "none";
});

// 🔁 Navigation
document.getElementById("nextBtn").addEventListener("click", () => {
  if (validateStep1()) {
    formStep1.classList.remove("active");
    formStep2.classList.add("active");
  }
});

document.getElementById("backBtn").addEventListener("click", () => {
  formStep2.classList.remove("active");
  formStep1.classList.add("active");
});

document.getElementById("resetBtn").addEventListener("click", () => {
  formStep1.reset();
  formStep2.reset();
  successMessage.style.display = "none";
  strengthMeter.value = 0;
  clearValidationStyles();
});

document.getElementById("darkModeToggle").addEventListener("change", () => {
  document.body.classList.toggle("dark");
});

// Password strength meter
password.addEventListener("input", () => {
  const val = password.value;
  let score = 0;
  if (val.length >= 6) score += 25;
  if (/[A-Z]/.test(val)) score += 25;
  if (/[0-9]/.test(val)) score += 25;
  if (/[@$!%*?&]/.test(val)) score += 25;
  strengthMeter.value = score;
});

function showError(input, msg) {
  const group = input.parentElement;
  const small = group.querySelector("small");
  small.innerText = msg;
  small.style.visibility = "visible";
  input.classList.add("error");
  input.classList.remove("success");
}

function showSuccess(input) {
  const group = input.parentElement;
  const small = group.querySelector("small");
  small.style.visibility = "hidden";
  input.classList.add("success");
  input.classList.remove("error");
}

function validateStep1() {
  let valid = true;
  if (username.value.trim().length < 3) {
    showError(username, "Minimum 3 characters");
    valid = false;
  } else showSuccess(username);

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    showError(email, "Invalid email format");
    valid = false;
  } else showSuccess(email);

  if (!/^[0-9]{10,15}$/.test(phone.value.trim())) {
    showError(phone, "Enter 10–15 digits");
    valid = false;
  } else showSuccess(phone);

  return valid;
}

function validateStep2() {
  if (password.value.length < 6) {
    showError(password, "Min 6 characters");
  } else showSuccess(password);

  if (confirmPassword.value !== password.value) {
    showError(confirmPassword, "Passwords must match");
  } else showSuccess(confirmPassword);

  if (!terms.checked) {
    showError(terms, "You must accept terms");
  }

  if (captcha.value.trim() !== "5") {
    showError(captcha, "Incorrect captcha answer");
  } else showSuccess(captcha);
}

function clearValidationStyles() {
  document.querySelectorAll("input").forEach((input) => {
    input.classList.remove("error", "success");
    const small = input.parentElement.querySelector("small");
    if (small) small.style.visibility = "hidden";
  });
}

function showStep(current, next) {
  current.classList.remove("active");
  current.classList.add("fade-out");

  setTimeout(() => {
    current.classList.remove("fade-out");
    next.classList.add("active");
  }, 300); // Wait for fade-out animation
}

function updateProgress(step) {
  document.getElementById("progressBar").style.width =
    step === 1 ? "50%" : "100%";
}

document.getElementById("nextBtn").addEventListener("click", () => {
  if (validateStep1()) {
    showStep(formStep1, formStep2);
    updateProgress(2);
  }
});

document.getElementById("backBtn").addEventListener("click", () => {
  showStep(formStep2, formStep1);
  updateProgress(1);
});

updateProgress(1); // initial

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

if (allValid) {
  formStep2.classList.remove("active");
  confirmation.classList.add("active");
  showModal();

  setTimeout(() => {
    showToast("Registration complete!");

    // Reset forms and styles after toast appears
    formStep1.reset();
    formStep2.reset();
    clearValidationStyles();
    strengthMeter.value = 0;
    updateProgress(1); // Reset progress bar
    showStep(confirmation, formStep1); // Go back to step 1
  }, 500); // Slight delay to let modal animate
}

document.addEventListener("DOMContentLoaded", () => {
  showToast("Page loaded successfully!");
});
