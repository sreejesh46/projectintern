# Hexnote - A Simple Firebase Authentication Demo

This project is a simple demonstration of user authentication using Firebase. It includes a sign-up page, a login page, and a dashboard page.

---

## 🌐 Live Demo

- 🔗 Vercel Deployment: https://projectintern-chi.vercel.app/  
- 🔗 Firebase Hosting: https://basicloginpage-bd9dd.web.app/

---

## 🚀 Features

- **Sign-up:** Users can create an account with their full name, email, and password.  
- **Login:** Registered users can log in with their email and password.  
- **Dashboard:** A protected page that only logged-in users can see. It displays the user's name and email.  
- **Password Strength Meter:** Provides real-time feedback on password strength during sign-up.  
- **Password Visibility Toggle:** Allows users to show or hide their password on both login and sign-up forms.  
- **Form Validation:** Provides clear error messages for common issues like empty fields, mismatched passwords, and weak passwords.  
- **Loading States:** Buttons show a spinner during processing to provide feedback to the user.  
- **Email Verification:** Sends a verification email to the user after they sign up.  
- **Redirects:** Automatically redirects users to the dashboard after login/signup and back to the login page if they try to access the dashboard while not authenticated.

---

## 🛠️ How to Use

1. **Clone the repository**  
2. **Set up Firebase:**
   - Create a new project on the Firebase Console.
   - Go to **Authentication** and enable the **Email/Password** sign-in method.
   - Go to **Project Settings** and copy your Firebase configuration.
3. **Configure the project:**
   - Open the `js/app.js` file.
   - Find the `firebaseConfig` object.
   - Replace the placeholder values with your actual Firebase project configuration.
4. **Run the project:**
   - Open the `index.html` file in your web browser.

---

## 📁 File Structure

- `index.html` – Login page  
- `signup.html` – Sign-up page  
- `dashboard.html` – User dashboard (protected)  
- `css/style.css` – All styles for the application  
- `js/app.js` – Firebase integration, form validation, and UI logic  

---

## ⚠️ n8n Integration Status (Important)

> **Current Status: Not Working**

The sign-up logic includes an optional webhook trigger for **n8n automation**, but it is **currently not functioning due to configuration and execution issues**.

Although the integration logic exists in the code, the webhook automation is **disabled for now** and **not active in production**.

### Planned Fixes:
- Reconfigure webhook URL  
- Verify authentication & API permissions  
- Test execution logs  
- Restore automated workflow triggering  

✅ **All core features (Sign Up, Login, Dashboard, Firebase Authentication) are working properly.**  
⚠️ Only the **n8n automation part is under maintenance.**
