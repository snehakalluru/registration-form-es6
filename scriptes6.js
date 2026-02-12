class Gsk {
    constructor(name, email, aadhar, type) {
        this.name = name
        this.email = email
        this.aadhar = aadhar
        this.type = type
    }
}

class Display {
    add(gsk) {
        let tableBody;
        tableBody = document.getElementById("tableBody");
        let uilist = `<tr>
    <td>${gsk.name}</td>
    <td>${gsk.email}</td>
    <td>${gsk.aadhar}</td>
    <td>${gsk.type}</td>
    <td><button class="btn btn-danger btn-sm delete">Delete</button></td>

    </tr>
    `
        tableBody.innerHTML += uilist;

        // Attach delete event
        this.attachDeleteEvents();

    }

    attachDeleteEvents() {
        let deleteButtons = document.querySelectorAll(".delete");
        deleteButtons.forEach((btn, index) => {
            btn.onclick = () => {
                this.deleteUser(index);
            };
        });
    }

    deleteUser(index) {
        // Remove from localStorage
        let users = JSON.parse(localStorage.getItem("users")) || [];
        users.splice(index, 1);
        localStorage.setItem("users", JSON.stringify(users));

        // Refresh table
        document.getElementById("tableBody").innerHTML = "";
        users.forEach(user => this.add(user));
    }


    clear() {
        let gskForm = document.getElementById('registerform');
        gskForm.reset();

    }

    validate(gsk) {
        if (gsk.name.length < 2 || gsk.email.length < 5 || String(gsk.aadhar).length < 12) {
            return false
        }
        else {
            return true
        }
    }

    show(type, displayMessage) {
        let message = document.getElementById("showmessage");
        message.innerHTML = `<div class="alert alert-${type}" role="alert">
  ${displayMessage}
</div>`;
        setTimeout(function () {
            message.innerHTML = '';
        }, 3000)

    }

}




let gskForm = document.getElementById('registerform');
gskForm.addEventListener('submit', gskFormRegister)
function gskFormRegister(e) {
    e.preventDefault();
    console.log("form is getting registered");
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let aadhar = document.getElementById('aadhar').value;
    let male = document.getElementById('inlinemale');
    let female = document.getElementById('inlinefemale');

    console.log(name, email, aadhar, male.checked, female.checked);
    let type;
    if (male.checked) {
        type = male.value
    }
    else {
        type = female.value
    }

    let data = new Gsk(name, email, aadhar, type);
    console.log(data)
    let display = new Display();

    if (display.validate(data)) {
        display.add(data);
        display.clear();
        display.show('success', "Registration is successful")

        // Save to localStorage
        let users = JSON.parse(localStorage.getItem("users")) || [];
        users.push(data);
        localStorage.setItem("users", JSON.stringify(users));

    }
    else {
        display.show('danger', "Registration is failed pls fill out the form again..")
    }
}

// Load saved users on page refresh
window.addEventListener("DOMContentLoaded", () => {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let display = new Display();
    users.forEach(user => display.add(user));
});




//search functionality

let searchForm = document.querySelector('form[role="search"]');
searchForm.addEventListener('submit', function (e) {
    e.preventDefault();
    let searchInput = searchForm.querySelector('input[type="search"]').value.toLowerCase();
    let tableRows = document.querySelectorAll("#tableBody tr")
    tableRows.forEach(row => {
        let rowtext = row.innerText.toLowerCase();
        if (rowtext.includes(searchInput)) {
            row.style.display = '';

        }
        else {
            row.style.display = 'none';
        }
    })

})


