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

let messages = [];
let quotes = [];
let currentMessageIndex = -1;
let virtualScrollPosition = 0;
let dailyQuote = "";

async function loadContent() {
    const response = await fetch("//gist.githubusercontent.com/v81d/5a26402ec848588bad10fc6401298577/raw/v81d.github.io.json");
    const data = await response.json();
    messages = data.messages;
    quotes = data.quotes;

    const today = new Date();
    const dateSeed = parseInt(
        `${today.getUTCFullYear()}${(today.getUTCMonth() + 1).toString().padStart(2, "0")}${today.getUTCDate().toString().padStart(2, "0")}`
    );
    const random = seededRandom(dateSeed);
    const quoteIndex = Math.floor(random() * quotes.length);
    dailyQuote = quotes[quoteIndex];
    displayText(dailyQuote);

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
}

function handleWheel(event) {
    event.preventDefault();

    virtualScrollPosition += event.deltaY;
    virtualScrollPosition = Math.max(0, virtualScrollPosition);

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

let lastTouchY = 0;

function handleTouchStart(event) {
    lastTouchY = event.touches[0].clientY;
}

function handleTouchMove(event) {
    if (!event.target.closest('a')) {
        event.preventDefault();
    }
    const touchY = event.touches[0].clientY;
    const deltaY = (lastTouchY - touchY) * 2;
    lastTouchY = touchY;

    virtualScrollPosition += deltaY;
    virtualScrollPosition = Math.max(0, virtualScrollPosition);

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

function displayText(text) {
    const quoteElement = document.getElementById("quote");
    quoteElement.style.opacity = "0";

    setTimeout(() => {
        const formattedText = text.replace(/\[lf\]/g, "<br>");
        quoteElement.innerHTML = `${formattedText}`;
        requestAnimationFrame(() => {
            quoteElement.style.opacity = "1";
        });
    }, 500);
}

loadContent();

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

    const { cursorDot, cursorCircle, cursorGlow } = window.cursorElements;

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
    return window.matchMedia('(hover: none) and (pointer: coarse)').matches;
}

function setupCursor() {
    const existingCursor = document.querySelector('.cursor-container');
    if (existingCursor) {
        existingCursor.remove();
    }

    if (!isTouchDevice()) {
        const cursorContainer = document.createElement("div");
        cursorContainer.className = 'cursor-container';
        cursorContainer.innerHTML = `
            <div class="cursor-dot"></div>
            <div class="cursor-circle"></div>
            <div class="cursor-glow"></div>
        `;
        document.body.appendChild(cursorContainer);

        const cursorDot = document.querySelector(".cursor-dot");
        const cursorCircle = document.querySelector(".cursor-circle");
        const cursorGlow = document.querySelector(".cursor-glow");

        window.cursorElements = { cursorDot, cursorCircle, cursorGlow };

        initCursorPosition({
            clientX: window.innerWidth / 2,
            clientY: window.innerHeight / 2
        });
        setTimeout(showCursor, 300);

        document.addEventListener("mouseenter", initCursorPosition);
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseleave", hideCursor);
        document.addEventListener("mouseenter", showCursor);
        document.addEventListener("mousedown", handleMouseDown);
        document.addEventListener("mouseup", handleMouseUp);

        updatePositions();
    }
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
        mathButton.addEventListener("mousemove", (e) => {
            const rect = mathButton.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            spotlight.style.left = x + "px";
            spotlight.style.top = y + "px";
            spotlight.style.opacity = "1";
        });

        mathButton.addEventListener("mouseleave", () => {
            spotlight.style.opacity = "0";
        });
    }
});

function handleMouseMove(e) {
    const { cursorDot, cursorCircle, cursorGlow } = window.cursorElements;
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
    const { cursorDot, cursorCircle } = window.cursorElements;
    cursorDot.style.transform = "scale(0.8)";
    cursorCircle.style.transform = "scale(0.8)";
}

function handleMouseUp() {
    const { cursorDot, cursorCircle } = window.cursorElements;
    cursorDot.style.transform = "scale(1)";
    cursorCircle.style.transform = "scale(1)";
}

function lerp(start, end, factor) {
    return start + (end - start) * factor;
}

function updatePositions() {
    const { cursorCircle, cursorGlow } = window.cursorElements;
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

function showCursor() {
    const { cursorDot, cursorCircle, cursorGlow } = window.cursorElements;
    cursorDot.classList.add("cursor-visible");
    cursorCircle.classList.add("cursor-visible");
    cursorGlow.classList.add("cursor-visible");
}

function hideCursor() {
    const { cursorDot, cursorCircle, cursorGlow } = window.cursorElements;
    cursorDot.classList.remove("cursor-visible");
    cursorCircle.classList.remove("cursor-visible");
    cursorGlow.classList.remove("cursor-visible");
}

window.addEventListener("focus", showCursor);
window.addEventListener("blur", hideCursor);

document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
});

function createParticles() {
    const container = document.getElementById("particles");
    const particleCount = 16;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("div");
        particle.className = "particle";

        const size = Math.random() * 2 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;

        particle.style.setProperty("--moveX1", `${Math.random() * 300 - 150}px`);
        particle.style.setProperty("--moveY1", `${Math.random() * 300 - 150}px`);
        particle.style.setProperty("--moveX2", `${Math.random() * 300 - 150}px`);
        particle.style.setProperty("--moveY2", `${Math.random() * 300 - 150}px`);
        particle.style.setProperty("--moveX3", `${Math.random() * 300 - 150}px`);
        particle.style.setProperty("--moveY3", `${Math.random() * 300 - 150}px`);

        particle.style.animationDelay = `${Math.random() * -30}s, ${Math.random() * -3}s`;

        container.appendChild(particle);
    }
}