const API_URL = "http://localhost:2015";

document.getElementById("signupForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("newUsername").value;
  const password = document.getElementById("newPassword").value;
  const role = document.getElementById("role").value;

  const response = await fetch(`${API_URL}/user/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password, role }),
  });

  const data = await response.json();
  alert(data.message);
  if (data.success) {
    window.location.href = "login.html";
  }
});

document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();
  alert(data.message);
  if (data.success) {
    localStorage.setItem("token", data.token);
    if (data.role === "LIBRARIAN") {
      window.location.href = "librarian.html";
    } else {
      window.location.href = "member.html";
    }
  }
});

document.getElementById("logoutBtn")?.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "login.html";
});

document.getElementById("addBookBtn")?.addEventListener("click", async () => {
  const title = prompt("Enter book title:");
  const author = prompt("Enter book author:");
  const response = await fetch(`${API_URL}/books`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ title, author }),
  });

  const data = await response.json();
  alert(data.message);
});

document
  .getElementById("viewMembersBtn")
  ?.addEventListener("click", async () => {
    const response = await fetch(`${API_URL}/members`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await response.json();
    alert(JSON.stringify(data.members, null, 2));
  });

document
  .getElementById("viewHistoryBtn")
  ?.addEventListener("click", async () => {
    const response = await fetch(`${API_URL}/history`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await response.json();
    alert(JSON.stringify(data.history, null, 2));
  });

document.getElementById("viewBooksBtn")?.addEventListener("click", async () => {
  const response = await fetch(`${API_URL}/books`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const data = await response.json();
  alert(JSON.stringify(data.books, null, 2));
});

document
  .getElementById("borrowBookBtn")
  ?.addEventListener("click", async () => {
    const bookId = prompt("Enter the ID of the book you want to borrow:");
    const response = await fetch(`${API_URL}/borrow/${bookId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await response.json();
    alert(data.message);
  });

document
  .getElementById("returnBookBtn")
  ?.addEventListener("click", async () => {
    const bookId = prompt("Enter the ID of the book you want to return:");
    const response = await fetch(`${API_URL}/return/${bookId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  });
