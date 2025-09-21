document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("login-form");

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Formun default davranışını bloklayırıq

    const formData = new FormData(form);
    const loginData = Object.fromEntries(formData.entries());

    loginFunc(loginData);
  });
});

function showMessage(message, type) {
  const messageBox = document.getElementById("message-box");
  messageBox.innerHTML = `<div class="alert alert-${type} mt-3">${message}</div>`;
  setTimeout(() => {
    messageBox.innerHTML = "";
  }, 3000);
}

function loginFunc(user) {
  console.log("Göndərilən istifadəçi məlumatı:", user); 

  fetch("http://195.26.245.5:9505/api/auth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Server cavabı:", data);

      if (data.status !== 403) {
        showMessage("Login successful! Redirecting...", "success");
        localStorage.setItem("activeUser", JSON.stringify(data.body));

        setTimeout(() => {
          window.location.href ="http://127.0.0.1:5500/Home/Home.html";
        }, 2000);
      } else {
        showMessage("Invalid username or password!", "danger");
      }
    })
    .catch((err) => {
      console.error("Server error:", err);
      showMessage("Server error. Please try again later.", "danger");
    });
}