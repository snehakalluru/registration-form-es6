function User(name, email, password, confirmPassword, gender) {
  this.name = name.trim();
  this.email = email.trim();
  this.password = password;
  this.confirmPassword = confirmPassword;
  this.gender = gender;
}

function RegistrationValidator() {
  this.users = JSON.parse(localStorage.getItem("prototypeUsers")) || [];
}

RegistrationValidator.prototype.validateName = function (name) {
  if (!name) {
    return "Name is required.";
  }

  if (name.length < 3) {
    return "Name must contain at least 3 characters.";
  }

  if (!/^[A-Za-z ]+$/.test(name)) {
    return "Name can contain only letters and spaces.";
  }

  return "";
};

RegistrationValidator.prototype.validateEmail = function (email) {
  if (!email) {
    return "Email is required.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return "Enter a valid email address.";
  }

  var alreadyExists = this.users.some(function (user) {
    return user.email.toLowerCase() === email.toLowerCase();
  });

  if (alreadyExists) {
    return "This email is already registered.";
  }

  return "";
};

RegistrationValidator.prototype.validatePassword = function (password) {
  if (!password) {
    return "Password is required.";
  }

  if (password.length < 8) {
    return "Password must contain at least 8 characters.";
  }

  if (!/[A-Z]/.test(password)) {
    return "Password must include an uppercase letter.";
  }

  if (!/[a-z]/.test(password)) {
    return "Password must include a lowercase letter.";
  }

  if (!/[0-9]/.test(password)) {
    return "Password must include a number.";
  }

  if (!/[!@#$%^&*]/.test(password)) {
    return "Password must include a special character.";
  }

  return "";
};

RegistrationValidator.prototype.validateConfirmPassword = function (password, confirmPassword) {
  if (!confirmPassword) {
    return "Please confirm your password.";
  }

  if (password !== confirmPassword) {
    return "Passwords do not match.";
  }

  return "";
};

RegistrationValidator.prototype.validateGender = function (gender) {
  return gender ? "" : "Select a gender option.";
};

RegistrationValidator.prototype.validate = function (user) {
  var errors = {
    name: this.validateName(user.name),
    email: this.validateEmail(user.email),
    password: this.validatePassword(user.password),
    confirmPassword: this.validateConfirmPassword(user.password, user.confirmPassword),
    gender: this.validateGender(user.gender),
  };

  return {
    isValid: !Object.keys(errors).some(function (key) {
      return errors[key];
    }),
    errors: errors,
  };
};

function RegistrationDisplay() {}

RegistrationDisplay.prototype.escapeHtml = function (value) {
  var container = document.createElement("div");
  container.textContent = value;
  return container.innerHTML;
};

RegistrationDisplay.prototype.setFieldStatus = function (fieldId, error) {
  var input = document.getElementById(fieldId);
  var errorBox = document.getElementById(fieldId + "Error");

  if (!input || !errorBox) {
    return;
  }

  input.classList.toggle("is-invalid", Boolean(error));
  input.classList.toggle("is-valid", !error && input.value.trim() !== "");
  errorBox.textContent = error;
};

RegistrationDisplay.prototype.showErrors = function (errors) {
  this.setFieldStatus("name", errors.name);
  this.setFieldStatus("email", errors.email);
  this.setFieldStatus("password", errors.password);
  this.setFieldStatus("confirmPassword", errors.confirmPassword);
  document.getElementById("genderError").textContent = errors.gender;
};

RegistrationDisplay.prototype.clearErrors = function () {
  var fieldIds = ["name", "email", "password", "confirmPassword"];

  fieldIds.forEach(function (fieldId) {
    var input = document.getElementById(fieldId);
    var errorBox = document.getElementById(fieldId + "Error");

    input.classList.remove("is-invalid", "is-valid");
    errorBox.textContent = "";
  });

  document.getElementById("genderError").textContent = "";
};

RegistrationDisplay.prototype.showMessage = function (type, message) {
  var messageBox = document.getElementById("showmessage");
  messageBox.innerHTML =
    '<div class="alert alert-' +
    type +
    ' alert-dismissible fade show" role="alert">' +
    message +
    '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' +
    "</div>";
};

RegistrationDisplay.prototype.renderUsers = function (users, searchTerm) {
  var tableBody = document.getElementById("tableBody");
  var emptyState = document.getElementById("emptyState");
  var normalizedSearch = (searchTerm || "").toLowerCase();
  var filteredUsers = users.filter(function (user) {
    return (
      user.name.toLowerCase().includes(normalizedSearch) ||
      user.email.toLowerCase().includes(normalizedSearch) ||
      user.gender.toLowerCase().includes(normalizedSearch)
    );
  });

  tableBody.innerHTML = filteredUsers
    .map(function (user) {
      return (
        "<tr>" +
        "<td>" +
        this.escapeHtml(user.name) +
        "</td>" +
        "<td>" +
        this.escapeHtml(user.email) +
        "</td>" +
        "<td>" +
        this.escapeHtml(user.gender) +
        "</td>" +
        '<td><button class="btn btn-outline-danger btn-sm" data-email="' +
        this.escapeHtml(user.email) +
        '">Delete</button></td>' +
        "</tr>"
      );
    }, this)
    .join("");

  emptyState.classList.toggle("d-none", filteredUsers.length > 0);
};

RegistrationDisplay.prototype.clearForm = function () {
  document.getElementById("registerform").reset();
  this.clearErrors();
};

function RegistrationApp() {
  this.form = document.getElementById("registerform");
  this.searchForm = document.getElementById("searchForm");
  this.searchInput = document.getElementById("searchInput");
  this.tableBody = document.getElementById("tableBody");
  this.validator = new RegistrationValidator();
  this.display = new RegistrationDisplay();
}

RegistrationApp.prototype.getSelectedGender = function () {
  var selectedGender = document.querySelector('input[name="gender"]:checked');
  return selectedGender ? selectedGender.value : "";
};

RegistrationApp.prototype.getFormData = function () {
  return new User(
    document.getElementById("name").value,
    document.getElementById("email").value,
    document.getElementById("password").value,
    document.getElementById("confirmPassword").value,
    this.getSelectedGender()
  );
};

RegistrationApp.prototype.saveUsers = function () {
  localStorage.setItem("prototypeUsers", JSON.stringify(this.validator.users));
};

RegistrationApp.prototype.addUser = function (user) {
  this.validator.users.push({
    name: user.name,
    email: user.email,
    gender: user.gender,
  });
  this.saveUsers();
};

RegistrationApp.prototype.deleteUser = function (email) {
  this.validator.users = this.validator.users.filter(function (user) {
    return user.email !== email;
  });
  this.saveUsers();
  this.display.renderUsers(this.validator.users, this.searchInput.value);
};

RegistrationApp.prototype.bindEvents = function () {
  var app = this;

  this.form.addEventListener("submit", function (event) {
    event.preventDefault();

    var user = app.getFormData();
    var result = app.validator.validate(user);

    app.display.showErrors(result.errors);

    if (!result.isValid) {
      app.display.showMessage("danger", "Please correct the highlighted fields.");
      return;
    }

    app.addUser(user);
    app.display.clearForm();
    app.display.renderUsers(app.validator.users, "");
    app.searchInput.value = "";
    app.display.showMessage("success", "Registration successful.");
  });

  this.searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    app.display.renderUsers(app.validator.users, app.searchInput.value);
  });

  this.searchInput.addEventListener("input", function () {
    app.display.renderUsers(app.validator.users, app.searchInput.value);
  });

  this.tableBody.addEventListener("click", function (event) {
    if (event.target.matches("[data-email]")) {
      app.deleteUser(event.target.dataset.email);
    }
  });
};

RegistrationApp.prototype.init = function () {
  this.bindEvents();
  this.display.renderUsers(this.validator.users, "");
};

document.addEventListener("DOMContentLoaded", function () {
  var app = new RegistrationApp();
  app.init();
});
