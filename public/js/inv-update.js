const updateForms = document.querySelectorAll("form")
const form = document.querySelector("#updateForm")
    
updateForms.forEach(frm => {
    frm.addEventListener("change", () => {
        const btn = frm.querySelector(".btn_account")
        if(!btn) return
        
        btn.removeAttribute("disabled")
    })
})

if(form) {
    form.addEventListener("change", () => {
        const updateBtn = form.querySelector(".btn_account")
        updateBtn.removeAttribute("disabled")
    })
}