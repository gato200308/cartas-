// CONFIGURACIÓN
// FECHA OBJETIVO: 25 de Diciembre del año actual (o siguiente) a las 00:00:00
// NOTA: Para pruebas, puedes cambiar esta fecha a una anterior.
const targetDate = new Date("December 24, 2025 00:00:00").getTime();

// CONSTRASEÑAS
// NOTA IMPORTANTE PARA EL USUARIO:
// Aquí puedes cambiar las contraseñas para cada carta.
// Simplemente cambia el texto dentro de las comillas "".
const PASSWORDS = {
    papa: "0810",
    madrastra: "molina24",
    mama: "1808",
    pareja: "0525"
};

// CONTENIDO DE LAS CARTAS
// El contenido ahora está en el archivo index.html (al final),
// para que sea más fácil escribir textos largos.

// --- LÓGICA DEL SISTEMA (NO TOCAR ABAJO A MENOS QUE SEPAS LO QUE HACES) ---

let isUnlocked = false;
let currentCardId = null;

// Elementos del DOM
const countdownContainer = document.getElementById('cards-container'); // Contenedor de cartas para añadir clase 'locked'
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const waitMsg = document.getElementById('wait-message');

function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    // Cálculos de tiempo
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Mostrar en pantalla
    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');

    // Comprobar si ya llegamos
    if (distance < 0) {
        // TIEMPO CUMPLIDO
        isUnlocked = true;
        document.getElementById('countdown-container').innerHTML = "<h2>🎄 ¡Es Navidad! 🎄</h2><p>Las cartas están desbloqueadas. Introduce tu contraseña para leerlas.</p>";
        countdownContainer.classList.remove('locked');

        // Actualizar textos de estado en las cartas
        document.querySelectorAll('.status-dependency').forEach(el => {
            el.textContent = "🔓 Desbloqueado - Click para abrir";
            el.style.color = "var(--christmas-green)";
        });
    } else {
        isUnlocked = false;
        countdownContainer.classList.add('locked');
    }
}

// Actualizar cada segundo
setInterval(updateCountdown, 1000);
updateCountdown(); // Ejecutar inmediatamente al carga

// MODAL Y APERTURA DE CARTAS
const modal = document.getElementById('modal');
const passwordSection = document.getElementById('password-section');
const letterContentDiv = document.getElementById('letter-content');
const letterTitle = document.getElementById('letter-title');
const letterBody = document.getElementById('letter-body');
const errorMsg = document.getElementById('error-msg');
const passwordInput = document.getElementById('password-input');

function openCard(cardId) {
    if (!isUnlocked) {
        alert("¡Aún no es Navidad! Espera al 25 de Diciembre.");
        return;
    }

    currentCardId = cardId;
    modal.classList.remove('hidden');

    // Resetear modal
    passwordSection.classList.remove('hidden');
    letterContentDiv.classList.add('hidden');
    passwordInput.value = "";
    errorMsg.classList.add('hidden');
}

function closeModal() {
    modal.classList.add('hidden');
    currentCardId = null;
}

function checkPassword() {
    const input = passwordInput.value;
    const correctPassword = PASSWORDS[currentCardId];

    if (input === correctPassword) {
        // Contraseña Correcta
        showLetter();
    } else {
        // Incorrecta
        errorMsg.classList.remove('hidden');
        // Efecto visual de error (vibración simple en CSS podría agregarse, o solo mensaje)
    }
}

function showLetter() {
    passwordSection.classList.add('hidden');
    letterContentDiv.classList.remove('hidden');

    let titleText = "";
    if (currentCardId === 'papa') titleText = "Para Papá";
    if (currentCardId === 'madrastra') titleText = "Para Madrastra";
    if (currentCardId === 'mama') titleText = "Para Mamá";
    if (currentCardId === 'pareja') titleText = "Para Mi Pareja";

    letterTitle.textContent = titleText;

    // Recuperar contenido del HTML oculto
    const contentId = 'content-' + currentCardId;
    const contentElement = document.getElementById(contentId);

    if (contentElement) {
        letterBody.innerHTML = contentElement.innerHTML;
    } else {
        letterBody.innerHTML = "<p>Error: No se encontró el contenido de la carta. Revisa el archivo index.html.</p>";
    }
}

// Cerrar modal si se hace clic fuera
window.onclick = function (event) {
    if (event.target == modal) {
        closeModal();
    }
}
