# Hexnote - A Simple Firebase Authentication Demo

This project is a simple demonstration of user authentication using Firebase. It includes a sign-up page, a login page, and a dashboard page.

## Features

*   **Sign-up:** Users can create an account with their full name, email, and password.
*   **Login:** Registered users can log in with their email and password.
*   **Dashboard:** A protected page that only logged-in users can see. It displays the user's name and email.
*   **Password Strength Meter:** Provides real-time feedback on password strength during sign-up.
*   **Password Visibility Toggle:** Allows users to show or hide their password on both login and sign-up forms.
*   **Form Validation:** Provides clear error messages for common issues like empty fields, mismatched passwords, and weak passwords.
*   **Loading States:** Buttons show a spinner during processing to provide feedback to the user.
*   **Email Verification:** Sends a verification email to the user after they sign up.
*   **Redirects:** Automatically redirects users to the dashboard after login/signup and back to the login page if they try to access the dashboard while not authenticated.

## How to Use

1.  **Clone the repository.**
2.  **Set up Firebase:**
    *   Create a new project on the [Firebase Console](https://console.firebase.google.com/).
    *   In your project, go to **Authentication** and enable the **Email/Password** sign-in method.
    *   Go to your project settings and copy your Firebase project configuration.
3.  **Configure the project:**
    *   Open the `js/app.js` file.
    *   Find the `firebaseConfig` object.
    *   Replace the placeholder values with your actual Firebase project configuration.
4.  **Run the project:**
    *   Open the `index.html` file in your web browser. You can do this by simply double-clicking the file.

## File Structure

*   `index.html`: The login page.
*   `signup.html`: The sign-up page.
*   `dashboard.html`: The user dashboard, which is only accessible after logging in.
*   `css/style.css`: Contains all the styles for the application.
*   `js/app.js`: Contains all the JavaScript logic, including Firebase integration, form validation, and UI interactions.

## n8n Integration (Optional)

The sign-up logic includes an optional webhook trigger for [n8n](https://n8n.io/). If you want to use this, you'll need to:

1.  Create a new webhook workflow in your n8n instance.
2.  Copy the webhook URL.
3.  In `js/app.js`, find the `webhookUrl` constant inside the `signupForm` event listener and replace the placeholder with your actual n8n webhook URL.

This will send a POST request to your n8n workflow with the new user's `uid`, `email`, `fullname`, and creation `timestamp` every time a new user signs up.
