// Select the form
const form = document.querySelector("form");

// URL of your JSON Server
const API_URL = "http://localhost:5000/users";

form.addEventListener("submit", async (e) => {
    e.preventDefault(); // prevent default form submission

    // Get values from inputs
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // Basic validation
    if (!name || !email || !password) {
        alert("Please fill all fields!");
        return;
    }

    try {
        // Check if user already exists
        const checkRes = await fetch(`${API_URL}?email=${encodeURIComponent(email)}`);
        const existingUsers = await checkRes.json();

        if (existingUsers.length > 0) {
            alert("User with this email already exists!");
            return;
        }

        // Register new user
        const res = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();
        console.log("User registered:", data);

        // alert("Registration successful! Redirecting to your task manager...");
        
        // Redirect to task manager
        window.location.href = "../confirmation/index.html";

    } catch (err) {
        console.error("Error registering user:", err);
        alert("Something went wrong. Please try again later.");
    }
});
