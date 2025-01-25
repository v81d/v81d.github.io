// Seeded random number generator
function seededRandom(seed) {
    const mask = 0xffffffff;
    let m_w = (123456789 + seed) & mask;
    let m_z = (987654321 - seed) & mask;

    return function () {
        m_z = (36969 * (m_z & 65535) + (m_z >>> 16)) & mask;
        m_w = (18000 * (m_w & 65535) + (m_w >>> 16)) & mask;
        let result = ((m_z << 16) + (m_w & 65535)) >>> 0;
        result /= 4294967296;
        return result;
    }
}

async function displayDailyQuote() {
    const response = await fetch("https://gist.githubusercontent.com/v81d/6598b11e0dc2d8e52c97cc46b84c8955/raw/quotes.json");
    const data = await response.json();

    const today = new Date();
    const dateSeed = parseInt(
        `${today.getUTCFullYear()}${(today.getUTCMonth() + 1).toString().padStart(2, '0')}${today.getUTCDate().toString().padStart(2, '0')}`
    );

    const random = seededRandom(dateSeed);
    const quoteIndex = Math.floor(random() * data.quotes.length);

    document.getElementById("quote").textContent = `❝${data.quotes[quoteIndex]}❞`;
}

const cursorDot = document.querySelector('.cursor-dot');
const cursorCircle = document.querySelector('.cursor-circle');
const cursorGlow = document.querySelector('.cursor-glow');

let currentX = 0;
let currentY = 0;
let targetX = 0;
let targetY = 0;

let circleX = 0;
let circleY = 0;
let circleTargetX = 0;
let circleTargetY = 0;

function initCursorPosition(e) {
    const posX = e.clientX || window.innerWidth / 2;
    const posY = e.clientY || window.innerHeight / 2;

    cursorDot.style.left = `${posX - 3}px`;
    cursorDot.style.top = `${posY - 3}px`;

    circleX = circleTargetX = posX - 20;
    circleY = circleTargetY = posY - 20;
    cursorCircle.style.left = `${circleX}px`;
    cursorCircle.style.top = `${circleY}px`;

    currentX = targetX = posX - 150;
    currentY = targetY = posY - 150;
    cursorGlow.style.left = `${currentX}px`;
    cursorGlow.style.top = `${currentY}px`;
}

function isTouchDevice() {
    return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
}

document.addEventListener('DOMContentLoaded', () => {
    if (!isTouchDevice()) {
        initCursorPosition({
            clientX: window.innerWidth / 2,
            clientY: window.innerHeight / 2
        });
        setTimeout(showCursor, 300);
        
        document.addEventListener('mouseenter', initCursorPosition);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseleave', hideCursor);
        document.addEventListener('mouseenter', showCursor);
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mouseup', handleMouseUp);
    }
});

function handleMouseMove(e) {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX - 3}px`;
    cursorDot.style.top = `${posY - 3}px`;

    circleTargetX = posX - 20;
    circleTargetY = posY - 20;
    targetX = posX - 150;
    targetY = posY - 150;
}

function handleMouseDown() {
    cursorDot.style.transform = 'scale(0.8)';
    cursorCircle.style.transform = 'scale(0.8)';
}

function handleMouseUp() {
    cursorDot.style.transform = 'scale(1)';
    cursorCircle.style.transform = 'scale(1)';
}

function lerp(start, end, factor) {
    return start + (end - start) * factor;
}

function updatePositions() {
    circleX = lerp(circleX, circleTargetX, 0.2);
    circleY = lerp(circleY, circleTargetY, 0.2);
    cursorCircle.style.left = `${circleX}px`;
    cursorCircle.style.top = `${circleY}px`;

    currentX = lerp(currentX, targetX, 0.01);
    currentY = lerp(currentY, targetY, 0.01);
    cursorGlow.style.left = `${currentX}px`;
    cursorGlow.style.top = `${currentY}px`;

    requestAnimationFrame(updatePositions);
}

updatePositions();

function showCursor() {
    cursorDot.classList.add('cursor-visible');
    cursorCircle.classList.add('cursor-visible');
    cursorGlow.classList.add('cursor-visible');
}

function hideCursor() {
    cursorDot.classList.remove('cursor-visible');
    cursorCircle.classList.remove('cursor-visible');
    cursorGlow.classList.remove('cursor-visible');
}

window.addEventListener('focus', showCursor);
window.addEventListener('blur', hideCursor);

displayDailyQuote();

document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});