// Seeded random number generator
function seededRandom(seed) {
    const mask = 0xffffffff;
    let m_w = (123456789 + seed) & mask;
    let m_z = (987654321 - seed) & mask;
    return () => {
        m_z = (36969 * (m_z & 65535) + (m_z >>> 16)) & mask;
        m_w = (18000 * (m_w & 65535) + (m_w >>> 16)) & mask;
        return (((m_z << 16) + (m_w & 65535)) >>> 0) / 4294967296;
    };
}

let messages = [], quotes = [], currentMessageIndex = -1, virtualScrollPosition = 0, dailyQuote = "";

async function loadContent() {
    const res = await fetch("https://gist.githubusercontent.com/v81d/5a26402ec848588bad10fc6401298577/raw/v81d.github.io.json");
    const data = await res.json();
    messages = data.messages;
    quotes = data.quotes;

    const today = new Date();
    const seed = parseInt(`${today.getUTCFullYear()}${(today.getUTCMonth() + 1).toString().padStart(2, "0")}${today.getUTCDate().toString().padStart(2, "0")}`);
    dailyQuote = quotes[Math.floor(seededRandom(seed)() * quotes.length)];
    displayText(dailyQuote);

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", e => lastTouchY = e.touches[0].clientY, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
}

function updateScroll(deltaY) {
    virtualScrollPosition = Math.max(0, virtualScrollPosition + deltaY);
    const screenBreakpoint = window.innerHeight * 8;

    if (virtualScrollPosition < screenBreakpoint) {
        if (currentMessageIndex !== -1) {
            currentMessageIndex = -1;
            displayText(dailyQuote);
        }
        return;
    }

    const newIndex = Math.floor((virtualScrollPosition - screenBreakpoint) / screenBreakpoint);
    if (newIndex >= messages.length) {
        virtualScrollPosition = screenBreakpoint * (messages.length - 1) + screenBreakpoint;
        return;
    }

    if (newIndex !== currentMessageIndex) {
        currentMessageIndex = newIndex;
        displayText(messages[newIndex]);
    }
}

function handleWheel(e) {
    e.preventDefault();
    updateScroll(e.deltaY);
}

let lastTouchY = 0;
function handleTouchMove(e) {
    if (!e.target.closest('a')) e.preventDefault();
    const deltaY = (lastTouchY - e.touches[0].clientY) * 2;
    lastTouchY = e.touches[0].clientY;
    updateScroll(deltaY);
}

function displayText(text) {
    const el = document.getElementById("quote");
    el.style.opacity = "0";
    setTimeout(() => {
        el.innerHTML = text.replace(/\[lf\]/g, "<br>");
        requestAnimationFrame(() => el.style.opacity = "1");
    }, 500);
}

loadContent();

let currentX = 0, currentY = 0, targetX = 0, targetY = 0;
let circleX = 0, circleY = 0, circleTargetX = 0, circleTargetY = 0;

function initCursorPosition(e) {
    const posX = e.clientX ?? window.innerWidth / 2;
    const posY = e.clientY ?? window.innerHeight / 2;
    const { cursorDot, cursorCircle, cursorGlow } = window.cursorElements;

    cursorDot.style.left = `${posX - 3}px`;
    cursorDot.style.top = `${posY - 3}px`;
    circleX = circleTargetX = posX - 20;
    circleY = circleTargetY = posY - 20;
    currentX = targetX = posX - 150;
    currentY = targetY = posY - 150;

    cursorCircle.style.left = `${circleX}px`;
    cursorCircle.style.top = `${circleY}px`;
    cursorGlow.style.left = `${currentX}px`;
    cursorGlow.style.top = `${currentY}px`;
}

const isTouchDevice = () => window.matchMedia('(hover: none) and (pointer: coarse)').matches;

function setupCursor() {
    document.querySelector('.cursor-container')?.remove();
    if (isTouchDevice()) return;

    const container = document.createElement("div");
    container.className = 'cursor-container';
    container.innerHTML = `<div class="cursor-dot"></div><div class="cursor-circle"></div><div class="cursor-glow"></div>`;
    document.body.appendChild(container);

    const cursorDot = document.querySelector(".cursor-dot");
    const cursorCircle = document.querySelector(".cursor-circle");
    const cursorGlow = document.querySelector(".cursor-glow");

    window.cursorElements = { cursorDot, cursorCircle, cursorGlow };

    initCursorPosition({ clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 });
    setTimeout(showCursor, 300);

    document.addEventListener("mouseenter", initCursorPosition);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", hideCursor);
    document.addEventListener("mouseenter", showCursor);
    document.addEventListener("mousedown", () => scaleCursor(0.8));
    document.addEventListener("mouseup", () => scaleCursor(1));

    updatePositions();
}

document.addEventListener("DOMContentLoaded", () => {
    setupCursor();
    window.matchMedia('(hover: none) and (pointer: coarse)').addEventListener('change', setupCursor);
    createParticles();

    const mathButton = document.querySelector(".math-button");
    const spotlight = document.createElement("div");
    spotlight.className = "spotlight";
    mathButton.appendChild(spotlight);

    if (!isTouchDevice()) {
        mathButton.addEventListener("mousemove", e => {
            const rect = mathButton.getBoundingClientRect();
            spotlight.style.left = `${e.clientX - rect.left}px`;
            spotlight.style.top = `${e.clientY - rect.top}px`;
            spotlight.style.opacity = "1";
        });
        mathButton.addEventListener("mouseleave", () => spotlight.style.opacity = "0");
    }
});

function handleMouseMove(e) {
    const { cursorDot } = window.cursorElements;
    cursorDot.style.left = `${e.clientX - 3}px`;
    cursorDot.style.top = `${e.clientY - 3}px`;
    circleTargetX = e.clientX - 20;
    circleTargetY = e.clientY - 20;
    targetX = e.clientX - 150;
    targetY = e.clientY - 150;
}

function scaleCursor(scale) {
    const { cursorDot, cursorCircle } = window.cursorElements;
    cursorDot.style.transform = cursorCircle.style.transform = `scale(${scale})`;
}

const lerp = (a, b, t) => a + (b - a) * t;

function updatePositions() {
    const { cursorCircle, cursorGlow } = window.cursorElements;
    circleX = lerp(circleX, circleTargetX, 0.2);
    circleY = lerp(circleY, circleTargetY, 0.2);
    currentX = lerp(currentX, targetX, 0.01);
    currentY = lerp(currentY, targetY, 0.01);

    cursorCircle.style.left = `${circleX}px`;
    cursorCircle.style.top = `${circleY}px`;
    cursorGlow.style.left = `${currentX}px`;
    cursorGlow.style.top = `${currentY}px`;

    requestAnimationFrame(updatePositions);
}

function toggleCursor(visible) {
    const method = visible ? "add" : "remove";
    const { cursorDot, cursorCircle, cursorGlow } = window.cursorElements;
    cursorDot.classList[method]("cursor-visible");
    cursorCircle.classList[method]("cursor-visible");
    cursorGlow.classList[method]("cursor-visible");
}
const showCursor = () => toggleCursor(true);
const hideCursor = () => toggleCursor(false);

window.addEventListener("focus", showCursor);
window.addEventListener("blur", hideCursor);
document.addEventListener("contextmenu", e => e.preventDefault());

function rand(min = -150, max = 150) {
    return Math.random() * (max - min) + min;
}

function createParticles() {
    const container = document.getElementById("particles");
    for (let i = 0; i < 16; i++) {
        const p = document.createElement("div");
        p.className = "particle";
        const size = Math.random() * 2 + 2;
        Object.assign(p.style, {
            width: `${size}px`,
            height: `${size}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * -30}s, ${Math.random() * -3}s`
        });
        ["X1", "Y1", "X2", "Y2", "X3", "Y3"].forEach(axis =>
            p.style.setProperty(`--move${axis}`, `${rand()}px`)
        );
        container.appendChild(p);
    }
}
