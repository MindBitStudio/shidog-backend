// Espera a que el DOM (Document Object Model) de la página esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
    console.log("La web de SHIDOG está lista.");
});

document.addEventListener("DOMContentLoaded", function () {
    // Cargar el Navbar
    fetch("navbar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("navbar-container").innerHTML = data;
        });

    // Cargar el Footer
    fetch("footer.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("footer-container").innerHTML = data;
        });
});


document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("mousemove", function (e) {
        createTrail(e.clientX, e.clientY + window.scrollY); // Ajuste con scroll
    });

    function createTrail(x, y) {
        const trail = document.createElement("div");
        trail.classList.add("trail");
        document.body.appendChild(trail);

        // Posiciona la partícula en la ubicación correcta con el scroll compensado
        trail.style.left = `${x}px`;
        trail.style.top = `${y}px`;

        // Elimina la partícula después de que termine la animación
        setTimeout(() => {
            trail.remove();
        }, 500);
    }
});


// Función para abrir un modal específico
function abrirModal(idModal) {
    document.getElementById(idModal).style.display = "flex";
}

// Función para cerrar un modal
function cerrarModal(idModal) {
    document.getElementById(idModal).style.display = "none";
}

// Cerrar modal si el usuario hace clic fuera del contenido
window.onclick = function(event) {
    const modales = document.querySelectorAll(".modal");
    modales.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
};

