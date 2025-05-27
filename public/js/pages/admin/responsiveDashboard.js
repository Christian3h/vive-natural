
document.addEventListener('DOMContentLoaded', function(){
    const header = document.getElementById('header-main');
    const menu = document.getElementById('menu-nav');
    const boton = document.getElementById('menu-toggle');
    const menuR = document.querySelectorAll('.menu-responsive');
    let presionado = 0;
    boton.addEventListener( 'click', function(){
        menu.classList.toggle('menu-movil');
        if(presionado == 0){
            menu.classList.toggle('none');
        }
    })

})