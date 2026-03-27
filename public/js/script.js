const pswdBtn = document.querySelector("#pswdBtn");

pswdBtn.addEventListener("click", () => {
    const pswInput = document.getElementById("password");

    const type = pswInput.getAttribute("type");

    if(type == "password") {
        pswInput.setAttribute("type", "text");
        pswdBtn.innerHTML = "Hide Password";
    } else {
        pswInput.setAttribute("type", "password");
        pswdBtn.innerHTML = "Show Password";
    }
})