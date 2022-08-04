// Este codigo es para que funcione la lógica del selector de países del input Phone
const phoneInputField = document.querySelector("#phone");
const phoneInput = window.intlTelInput(phoneInputField, {
    preferredCountries: ["ar"],
    utilsScript:
        "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
});

const userForm = document.querySelector('#userForm')

userForm.addEventListener('submit', (e) => {
    if (phoneInput.isValidNumber()) {
        // Esto lo hago para que el código de país sea parte del tel
        phoneInputField.value = phoneInput.getNumber()
    } else {
        e.preventDefault()
    }
})

const alertinfo = document.querySelector(".phone-ok");
const alerterror = document.querySelector(".phone-error");

// phoneInputField.addEventListener('', verifyPhone);

function verifyPhone() {

    const phoneNumber = phoneInput.getNumber();

    alertinfo.style.display = "none";
    alerterror.style.display = "none";

    // OPTION 2 - intl-tel-input validity check
    // Pros: No additional API call
    // Cons: Requires plugin updates for updates on phone number validity
    if (phoneInput.isValidNumber()) {
      alertinfo.style.display = "";
      alertinfo.innerHTML = `Correct Phone number in E.164 format: <strong>${phoneNumber}</strong>`
    } else {
      alerterror.style.display = "";
      alerterror.innerHTML = `Invalid phone number.`
    }
}


