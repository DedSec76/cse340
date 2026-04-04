const form = document.querySelector("#updateForm")
    form.addEventListener("change", () => {
        const updateBtn = document.querySelector(".btn_account")
        updateBtn.removeAttribute("disabled")
    })