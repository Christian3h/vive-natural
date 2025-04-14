export function initSlider() {

    const sliderContainer = document.querySelectorAll('.slider-container');
    if (!sliderContainer.length) return;
  
    sliderContainer.forEach((slider) => {
      const slides = slider.querySelectorAll('.slide');
      const sliderInterno = slider.querySelector('.slider');
      const buttons = slider.querySelector('.buttons');
      let currentIndex = 0;
  
      // Ocultar botones si solo hay una imagen
      if (slides.length <= 1) {
        if (buttons) buttons.style.display = 'none';
        return;
      }
  
      // Mostrar slide actual con transición vertical
      const showSlide = (index) => {
        sliderInterno.style.transform = `translateY(-${index * 100}%)`;
      };
  
      showSlide(currentIndex); // Mostrar la primera imagen al cargar
  
      slider.addEventListener('click', (e) => {
        if (e.target.id === 'btn-next') {
          currentIndex = (currentIndex + 1) % slides.length;
          showSlide(currentIndex);
        }
  
        if (e.target.id === 'btn-prev') {
          console.log('click');
          currentIndex = (currentIndex - 1 + slides.length) % slides.length;
          showSlide(currentIndex);
        }
      });
    });
  }
  