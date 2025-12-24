// Select the form
const form = document.querySelector("form");

// JSON Server API URL
const API_URL = "http://localhost:5000/users";

form.addEventListener("submit", async (e) => {
  e.preventDefault(); // prevent form from submitting

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Please fill all fields!");
    return;
  }

  try {
    // Fetch all users from JSON Server
    const res = await fetch(API_URL);
    const users = await res.json();

    // Find user with matching email and password
    const user = users.find(
      u => u.email === email && u.password === password
    );

    if (user) {
      // ✅ SAVE LOGGED-IN USER (no password)
      localStorage.setItem(
        "loggedUser",
        JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email
        })
      );

      alert(`Welcome back, ${user.name}! Redirecting...`);

      // Redirect to your app
      window.location.href = "../task_manager/task_manager.html";
    } else {
      alert("Invalid email or password!");
    }

  } catch (err) {
    console.error("Error logging in:", err);
    alert("Something went wrong. Please try again later.");
  }
});

