class User {
  constructor(name, email, password, confirmPassword, gender) {
    this.name = name.trim();
    this.email = email.trim();
    this.password = password;
    this.confirmPassword = confirmPassword;
    this.gender = gender;
  }
}

class RegistrationValidator {
  constructor() {
    this.users = JSON.parse(localStorage.getItem("es6Users")) || [];
  }

  validateName(name) {
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
  }

  validateEmail(email) {
    if (!email) {
      return "Email is required.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return "Enter a valid email address.";
    }

    const alreadyExists = this.users.some(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );

    if (alreadyExists) {
      return "This email is already registered.";
    }

    return "";
  }

  validatePassword(password) {
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
  }

  validateConfirmPassword(password, confirmPassword) {
    if (!confirmPassword) {
      return "Please confirm your password.";
    }

    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }

    return "";
  }

  validateGender(gender) {
    return gender ? "" : "Select a gender option.";
  }

  validate(user) {
    const errors = {
      name: this.validateName(user.name),
      email: this.validateEmail(user.email),
      password: this.validatePassword(user.password),
      confirmPassword: this.validateConfirmPassword(user.password, user.confirmPassword),
      gender: this.validateGender(user.gender),
    };

    return {
      isValid: !Object.values(errors).some(Boolean),
      errors,
    };
  }
}

class RegistrationDisplay {
  escapeHtml(value) {
    const container = document.createElement("div");
    container.textContent = value;
    return container.innerHTML;
  }

  setFieldStatus(fieldId, error) {
    const input = document.getElementById(fieldId);
    const errorBox = document.getElementById(`${fieldId}Error`);

    if (!input || !errorBox) {
      return;
    }

    input.classList.toggle("is-invalid", Boolean(error));
    input.classList.toggle("is-valid", !error && input.value.trim() !== "");
    errorBox.textContent = error;
  }

  showErrors(errors) {
    this.setFieldStatus("name", errors.name);
    this.setFieldStatus("email", errors.email);
    this.setFieldStatus("password", errors.password);
    this.setFieldStatus("confirmPassword", errors.confirmPassword);
    document.getElementById("genderError").textContent = errors.gender;
  }

  clearErrors() {
    ["name", "email", "password", "confirmPassword"].forEach((fieldId) => {
      const input = document.getElementById(fieldId);
      const errorBox = document.getElementById(`${fieldId}Error`);

      input.classList.remove("is-invalid", "is-valid");
      errorBox.textContent = "";
    });

    document.getElementById("genderError").textContent = "";
  }

  showMessage(type, message) {
    const messageBox = document.getElementById("showmessage");
    messageBox.innerHTML = `
      <div class="alert alert-${type} alert-dismissible fade show" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;
  }

  renderUsers(users, searchTerm = "") {
    const tableBody = document.getElementById("tableBody");
    const emptyState = document.getElementById("emptyState");
    const normalizedSearch = searchTerm.toLowerCase();
    const filteredUsers = users.filter(({ name, email, gender }) =>
      [name, email, gender].some((value) => value.toLowerCase().includes(normalizedSearch))
    );

    tableBody.innerHTML = filteredUsers
      .map(
        ({ name, email, gender }) => `
          <tr>
            <td>${this.escapeHtml(name)}</td>
            <td>${this.escapeHtml(email)}</td>
            <td>${this.escapeHtml(gender)}</td>
            <td>
              <button class="btn btn-outline-danger btn-sm" data-email="${this.escapeHtml(email)}">
                Delete
              </button>
            </td>
          </tr>
        `
      )
      .join("");

    emptyState.classList.toggle("d-none", filteredUsers.length > 0);
  }

  clearForm() {
    document.getElementById("registerform").reset();
    this.clearErrors();
  }
}

class RegistrationApp {
  constructor() {
    this.form = document.getElementById("registerform");
    this.searchForm = document.getElementById("searchForm");
    this.searchInput = document.getElementById("searchInput");
    this.tableBody = document.getElementById("tableBody");
    this.validator = new RegistrationValidator();
    this.display = new RegistrationDisplay();
  }

  getSelectedGender() {
    const selectedGender = document.querySelector('input[name="gender"]:checked');
    return selectedGender ? selectedGender.value : "";
  }

  getFormData() {
    return new User(
      document.getElementById("name").value,
      document.getElementById("email").value,
      document.getElementById("password").value,
      document.getElementById("confirmPassword").value,
      this.getSelectedGender()
    );
  }

  saveUsers() {
    localStorage.setItem("es6Users", JSON.stringify(this.validator.users));
  }

  addUser(user) {
    this.validator.users.push({
      name: user.name,
      email: user.email,
      gender: user.gender,
    });
    this.saveUsers();
  }

  deleteUser(email) {
    this.validator.users = this.validator.users.filter((user) => user.email !== email);
    this.saveUsers();
    this.display.renderUsers(this.validator.users, this.searchInput.value);
  }

  bindEvents() {
    this.form.addEventListener("submit", (event) => {
      event.preventDefault();

      const user = this.getFormData();
      const result = this.validator.validate(user);

      this.display.showErrors(result.errors);

      if (!result.isValid) {
        this.display.showMessage("danger", "Please correct the highlighted fields.");
        return;
      }

      this.addUser(user);
      this.display.clearForm();
      this.display.renderUsers(this.validator.users);
      this.searchInput.value = "";
      this.display.showMessage("success", "Registration successful.");
    });

    this.searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      this.display.renderUsers(this.validator.users, this.searchInput.value);
    });

    this.searchInput.addEventListener("input", () => {
      this.display.renderUsers(this.validator.users, this.searchInput.value);
    });

    this.tableBody.addEventListener("click", (event) => {
      if (event.target.matches("[data-email]")) {
        this.deleteUser(event.target.dataset.email);
      }
    });
  }

  init() {
    this.bindEvents();
    this.display.renderUsers(this.validator.users);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const app = new RegistrationApp();
  app.init();
});
