const API_BASE = "http://localhost:5000/api"; // Change as needed

// Handle Signup
async function signup(event) {
  event.preventDefault();
  const username = document.getElementById("signup-username").value;
  const password = document.getElementById("signup-password").value;
  const role = document.getElementById("signup-role").value; // MEMBER or LIBRARIAN

  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, role }),
  });

  const data = await res.json();
  if (res.ok) {
    alert("Signup successful! Please login.");
    window.location.href = "login.html";
  } else {
    alert(data.message);
  }
}

// Handle Login
async function login(event) {
  event.preventDefault();
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();
  if (res.ok) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
    alert("Login successful!");
    window.location.href =
      data.role === "LIBRARIAN" ? "librarian.html" : "member.html";
  } else {
    alert(data.message);
  }
}

// Logout
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.href = "login.html";
}

// Fetch Books (Librarian & Member)
async function fetchBooks() {
  const res = await fetch(`${API_BASE}/books`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const books = await res.json();
  let booksList = document.getElementById("books-list");
  booksList.innerHTML = "";

  books.forEach((book) => {
    booksList.innerHTML += `
            <tr>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.status}</td>
                ${
                  localStorage.getItem("role") === "LIBRARIAN"
                    ? `
                    <td>
                        <button onclick="editBook('${book._id}')">Edit</button>
                        <button onclick="deleteBook('${book._id}')">Delete</button>
                    </td>`
                    : ""
                }
            </tr>
        `;
  });
}

// Add a Book (Librarian)
async function addBook(event) {
  event.preventDefault();
  const title = document.getElementById("book-title").value;
  const author = document.getElementById("book-author").value;

  const res = await fetch(`${API_BASE}/books`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ title, author }),
  });

  if (res.ok) {
    alert("Book added successfully!");
    fetchBooks();
  } else {
    alert("Failed to add book.");
  }
}

// Delete a Book (Librarian)
async function deleteBook(bookId) {
  const res = await fetch(`${API_BASE}/books/${bookId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  if (res.ok) {
    alert("Book deleted!");
    fetchBooks();
  } else {
    alert("Failed to delete book.");
  }
}

// Borrow a Book (Member)
async function borrowBook(bookId) {
  const res = await fetch(`${API_BASE}/books/borrow/${bookId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  if (res.ok) {
    alert("Book borrowed successfully!");
    fetchBooks();
  } else {
    alert("Failed to borrow book.");
  }
}

// Return a Book (Member)
async function returnBook(bookId) {
  const res = await fetch(`${API_BASE}/books/return/${bookId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  if (res.ok) {
    alert("Book returned successfully!");
    fetchBooks();
  } else {
    alert("Failed to return book.");
  }
}

// Delete Account (Member)
async function deleteAccount() {
  const res = await fetch(`${API_BASE}/users/me`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  if (res.ok) {
    alert("Account deleted!");
    logout();
  } else {
    alert("Failed to delete account.");
  }
}

// Fetch Member's Borrowing History
async function fetchHistory() {
  const res = await fetch(`${API_BASE}/history`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const history = await res.json();
  let historyList = document.getElementById("history-list");
  historyList.innerHTML = "";

  history.forEach((record) => {
    historyList.innerHTML += `
            <tr>
                <td>${record.bookTitle}</td>
                <td>${record.borrowDate}</td>
                <td>${record.returnDate || "Not Returned"}</td>
            </tr>
        `;
  });
}
