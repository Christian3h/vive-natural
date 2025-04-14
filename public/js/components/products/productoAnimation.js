let index = 0;
const images = document.querySelectorAll('.imagen');

export function animacionProducto() {    
    setInterval(() => {
        index = (index + 1) % images.length; // Cambia la imagen cada 3 segundos
        images.forEach((image, i) => {
            image.style.transform = `translateX(-${index * 100}%)`;
        });
    }, 3000);
}
