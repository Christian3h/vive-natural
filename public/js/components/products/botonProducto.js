
export function botonProductoCom() {
    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("ver-mas")) {
            const id = event.target.getAttribute("data-id");
            window.location.href = `/producto/${id}`;

        }
    });
}
 
