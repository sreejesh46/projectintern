// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendEmailVerification,
  updateProfile, // ✅ Now properly imported
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// --- PASTE YOUR FIREBASE CONFIG HERE ---
const firebaseConfig = {
  apiKey: "AIzaSyCiUH60J7ivLgpY8wlMaFbE-RwRy_6px7I",
  authDomain: "basicloginpage-bd9dd.firebaseapp.com",
  projectId: "basicloginpage-bd9dd",
  storageBucket: "basicloginpage-bd9dd.firebasestorage.app",
  messagingSenderId: "656354951706",
  appId: "1:656354951706:web:f9914b554b932c46cdc7a3",
  measurementId: "G-93DNN877TJ",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// --- DOM Elements ---
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const logoutBtn = document.getElementById("logout-btn");
const msgBox = document.getElementById("message-box");

// Form-specific elements
const fullnameInput = document.getElementById("fullname");
const emailInput = document.getElementById("email"); // General email, used in signup
const passwordInput = document.getElementById("password"); // General password, used in signup
const confirmPasswordInput = document.getElementById("confirm-password");
const termsCheckbox = document.getElementById("terms");

// Buttons
const signupBtn = document.getElementById("signup-btn");
const loginBtn = document.getElementById("login-btn");

// UI Features
const strengthBar = document.querySelector(".strength-bar div");
const strengthText = document.querySelector(".strength-text");

// --- Helper Functions ---
const showError = (msg) => {
  if (msgBox) {
    msgBox.textContent = msg;
    msgBox.style.display = "block";
  }
};

const setupPasswordToggle = (formId) => {
  const form = document.getElementById(formId);
  if (!form) return;

  const passwordField = form.querySelector('input[type="password"]');
  const toggle = form.querySelector(".toggle-password");

  if (passwordField && toggle) {
    toggle.addEventListener("click", () => {
      const isPassword = passwordField.type === "password";
      passwordField.type = isPassword ? "text" : "password";

      // If it's the signup form, toggle both password fields
      if (formId === "signup-form") {
        if (confirmPasswordInput)
          confirmPasswordInput.type = isPassword ? "text" : "password";
      }
      toggle.classList.toggle("active");
    });
  }
};

// Password Strength Checker
if (passwordInput) {
  passwordInput.addEventListener("input", () => {
    const password = passwordInput.value;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^A-Za-z0-9]/)) strength++;

    strengthBar.style.width = strength * 25 + "%";
    switch (strength) {
      case 0:
      case 1:
        strengthBar.style.background = "red";
        strengthText.textContent = "Too weak";
        break;
      case 2:
        strengthBar.style.background = "orange";
        strengthText.textContent = "Could be stronger";
        break;
      case 3:
        strengthBar.style.background = "yellow";
        strengthText.textContent = "Good";
        break;
      case 4:
        strengthBar.style.background = "green";
        strengthText.textContent = "Strong";
        break;
    }
  });
}

// --- Initialize Password Toggles ---
setupPasswordToggle("login-form");
setupPasswordToggle("signup-form");

// 1. SIGN UP LOGIC
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Reset previous errors
    msgBox.style.display = "none";
    [fullnameInput, emailInput, passwordInput, confirmPasswordInput].forEach(
      (input) => input.classList.remove("invalid")
    );

    const fullname = fullnameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const terms = termsCheckbox.checked;

    // Validation
    if (!fullname || !email || !password || !confirmPassword) {
      showError("Please fill all fields.");
      [fullnameInput, emailInput, passwordInput, confirmPasswordInput].forEach(
        (input) => {
          if (!input.value) input.classList.add("invalid");
        }
      );
      return;
    }
    if (password !== confirmPassword) {
      showError("Passwords do not match.");
      passwordInput.classList.add("invalid");
      confirmPasswordInput.classList.add("invalid");
      return;
    }
    if (
      password.length < 8 ||
      !password.match(/[A-Z]/) ||
      !password.match(/[0-9]/) ||
      !password.match(/[^A-Za-z0-9]/)
    ) {
      showError(
        "Password is too weak. It must be at least 8 characters long and include an uppercase letter, a number, and a special character."
      );
      passwordInput.classList.add("invalid");
      return;
    }
    if (!terms) {
      showError("You must agree to the Terms & Conditions.");
      return;
    }

    // Loading state
    signupBtn.disabled = true;
    signupBtn.querySelector(".btn-text").style.display = "none";
    signupBtn.querySelector(".spinner").style.display = "inline-block";

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // FIX: Save the Full Name to the Firebase User Profile
      await updateProfile(user, {
        displayName: fullname, // Sets user.displayName for permanent, reliable retrieval
      });

      // CLEANUP: Store fullname in local storage (kept for the one-time welcome message below)
      localStorage.setItem("userFullname", fullname);

      // --- BONUS: n8n TRIGGER ---
      const webhookUrl =
        "https://sreejeshmohan13.app.n8n.cloud/webhook/e125d772-be23-4f91-a7b8-183d80524c34";

      // 🔑 FINAL FIX: Add a small, non-blocking delay (100ms)
      // This resolves issues where the fetch is silently blocked by hosting timing/firewalls.
      await new Promise((resolve) => setTimeout(resolve, 100));

      if (webhookUrl && !webhookUrl.includes("YOUR-N8N-INSTANCE")) {
        fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uid: user.uid,
            email: user.email,
            fullname: fullname,
            created: new Date().toISOString(),
          }),
        }).catch((err) => console.log("n8n trigger failed (ignoring):", err));
      }
      // --------------------------
      // --------------------------
      // --------------------------

      // Send email verification
      await sendEmailVerification(auth.currentUser);

      // Redirect with a welcome message
      localStorage.setItem(
        "welcomeMessage",
        `Welcome, ${fullname}! Please check your email to verify your account.`
      );
      window.location.href = "dashboard.html";
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        showError("Email already exists.");
        emailInput.classList.add("invalid");
      } else {
        showError(error.message.replace("Firebase: ", ""));
      }
    } finally {
      // Re-enable button
      signupBtn.disabled = false;
      signupBtn.querySelector(".btn-text").style.display = "inline-block";
      signupBtn.querySelector(".spinner").style.display = "none";
    }
  });
}

// 2. LOGIN LOGIC
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get inputs directly from the login form
    const emailInput = loginForm.email;
    const passwordInput = loginForm.password;

    // Reset previous errors
    msgBox.style.display = "none";
    emailInput.classList.remove("invalid");
    passwordInput.classList.remove("invalid");

    const email = emailInput.value;
    const password = passwordInput.value;

    // Validation
    if (!email || !password) {
      showError("Please fill all fields.");
      if (!email) emailInput.classList.add("invalid");
      if (!password) passwordInput.classList.add("invalid");
      return;
    }

    // Loading state
    if (loginBtn) {
      loginBtn.disabled = true;
      loginBtn.querySelector(".btn-text").style.display = "none";
      loginBtn.querySelector(".spinner").style.display = "inline-block";
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // CLEANUP: Removing all unreliable local storage name handling here.
      // The name will be correctly pulled from the Firebase user object in Section 3.

      window.location.href = "dashboard.html";
    } catch (error) {
      let errorMessage = "An unknown error occurred.";
      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "Invalid email format.";
          loginForm.email.classList.add("invalid");
          break;
        case "auth/user-not-found":
        case "auth/wrong-password":
          errorMessage = "Invalid email or password.";
          loginForm.email.classList.add("invalid");
          loginForm.password.classList.add("invalid");
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many login attempts. Please try again later.";
          break;
        default:
          errorMessage = error.message.replace("Firebase: ", "");
          break;
      }
      showError(errorMessage);
    } finally {
      // Re-enable button
      if (loginBtn) {
        loginBtn.disabled = false;
        loginBtn.querySelector(".btn-text").style.display = "inline-block";
        loginBtn.querySelector(".spinner").style.display = "none";
      }
    }
  });
}

// 3. DASHBOARD / AUTH STATE LOGIC
onAuthStateChanged(auth, (user) => {
  const isDashboard = window.location.pathname.includes("dashboard.html");
  const isAuthPage = !isDashboard; // simplistic check

  if (user && isAuthPage) {
    // If user is logged in but on login/signup page, send to dashboard
    window.location.href = "dashboard.html";
  } else if (!user && isDashboard) {
    // If user is NOT logged in but on dashboard, send to login
    window.location.href = "index.html";
  } else if (user && isDashboard) {
    // If on dashboard and user exists, show their email and name
    document.getElementById("user-email").textContent = user.email;

    // 🔑 FIX START 🔑
    // 1. Get the welcome message (only exists on initial signup redirect)
    const storedWelcomeMessage = localStorage.getItem("welcomeMessage");
    let displayFullName = user.displayName || user.email; // Default to server name or email

    // 2. If the welcome message exists, extract the name from it.
    // This reliably provides the name before Firebase finishes propagating the update.
    if (storedWelcomeMessage) {
      // Regex to extract the name between "Welcome, " and "!"
      const match = storedWelcomeMessage.match(/Welcome, (.*?)!/);
      if (match && match[1]) {
        displayFullName = match[1];
      }
    } // Display the determined full name

    document.getElementById("user-fullname").textContent = displayFullName; // Show welcome message
    // 🔑 FIX END 🔑

    const welcomeMessage = localStorage.getItem("welcomeMessage");
    if (welcomeMessage) {
      const msgBox = document.getElementById("message-box");
      msgBox.textContent = welcomeMessage;
      msgBox.style.display = "block";
      localStorage.removeItem("welcomeMessage");
    }
  }
});

// 4. LOGOUT LOGIC
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    signOut(auth).then(() => {
      window.location.href = "index.html";
    });
  });
}
// Inline Terms Toggle
const termsBox = document.getElementById("terms-text");
const termsToggle = document.querySelector(".toggle-terms");

if (termsToggle) {
  termsToggle.addEventListener("click", (e) => {
    e.preventDefault();
    termsBox.style.display =
      termsBox.style.display === "block" ? "none" : "block";
  });
}
