function Gsk(name, email, aadhar, type) {
    this.name = name
    this.email = email
    this.aadhar = aadhar
    this.type = type
}
//Display constructor
function Display(){}

// add the method to validate the prototype
Display.prototype.validate = function (gsk) {

    if (gsk.name.length < 2 || gsk.email.length < 5 || String(gsk.aadhar).length < 12) {
        return false
    }
    else {
        return true
    }
}
//clearform
Display.prototype.clear = function () {
    let gskForm = document.getElementById('registerform');
    gskForm.reset();

}

Display.prototype.add = function (gsk) {
    let tableBody = document.getElementById("tableBody");
    let uilist = `<tr>
    <td>${gsk.name}</td>
    <td>${gsk.email}</td>
    <td>${gsk.aadhar}</td>
    <td>${gsk.type}</td>
    </tr>
    `
    tableBody.innerHTML += uilist;
}

Display.prototype.show=function(type, displayMessage){
    let message=document.getElementById("showmessage");
    message.innerHTML = `<div class="alert alert-${type}" role="alert">
  ${displayMessage}
</div>`
setTimeout(function(){
    message.innerHTML = '';
},3000)

}

//msin function
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
    }
    else {
        display.show('danger', "Registration is failed pls fill out the form again..")
    }
}
