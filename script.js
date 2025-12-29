// 1. INITIALIZE GLOBAL ENGINES
gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis();
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// Declare addLog globally so revealDesc can use it
let addLog; 

window.addEventListener('DOMContentLoaded', () => {
    // 2. SELECT ELEMENTS
    const logContainer = document.querySelector("#typed-logs");
    const terminalBody = document.querySelector(".terminal-body");
    const statNumbers = document.querySelectorAll(".number");

    // 3. DEFINE LOGIC
    addLog = (message) => {
        if (logContainer) {
            const p = document.createElement("p");
            p.innerHTML = `<span style="color: var(--accent-color)">></span> ${message}`;
            p.style.marginBottom = "8px";
            logContainer.appendChild(p);
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    };

    // 4. THE INTRO TIMELINE (Fires Immediately)
    const introTL = gsap.timeline();
    introTL
        .to(".personal-text", { opacity: 1, y: -10, duration: 1.5, stagger: 0.8, ease: "power2.out" })
        .to(".personal-text", { opacity: 0, duration: 1, delay: 1.5 })
        .to("#intro-overlay", { opacity: 0, duration: 1.5, display: "none" })
        // After intro, allow numbers and pipeline to trigger
        .call(() => addLog("SYSTEM_BOOT... ONLINE"))
        .call(() => addLog("WAITING_FOR_USER_SCROLL..."));

    // 5. THE NUMBERS ENGINE
    statNumbers.forEach((num) => {
        const targetValue = num.getAttribute("data-target");
        gsap.to(num, {
            innerText: targetValue, 
            duration: 4, 
            snap: { innerText: 1 }, 
            scrollTrigger: {
                trigger: num,
                start: "top 85%",
                toggleActions: "play none none none"
            }
        });
    });

    // 6. THE PIPELINE TIMELINE
    const pipelineTL = gsap.timeline({
        scrollTrigger: {
            trigger: ".pipeline-container",
            start: "top 70%",
            toggleActions: "play none none none"
        }
    });
  // Add a check for mobile screens
    const isMobile = window.innerWidth <= 768;

   pipelineTL
    .to("#line-1 .pulse", { 
        [isMobile ? "top" : "left"]: "100%", // Move 'top' if mobile, 'left' if desktop
        duration: 0.8, 
        ease: "none" 
    })
    // ... repeat for line-2 ...

    pipelineTL
        .call(() => addLog("INITIALIZING DATA_FLOW..."))
        .from("#node-local", { opacity: 0, scale: 0.5, duration: 0.5, ease: "back.out(1.7)" })
        .call(() => addLog("LOCAL_SOURCE: DETECTED (180 LINES)"))
        .to("#line-1 .pulse", { left: "100%", duration: 0.8, ease: "none" })
        .from("#node-cloudinary", { opacity: 0, scale: 0.5, duration: 0.5, ease: "back.out(1.7)" })
        .call(() => addLog("CDN_HANDSHAKE: CLOUDINARY_ACTIVE"))
        .to("#line-2 .pulse", { left: "100%", duration: 0.8, ease: "none" })
        .from("#node-github", { opacity: 0, scale: 0.5, duration: 0.5, ease: "back.out(1.7)" })
        .call(() => addLog("SERVER_SYNC: GITHUB_PAGES_LIVE"));
});

// 7. INTERACTION ENGINE (Must stay outside DOMContentLoaded for HTML onclick to work)
function revealDesc(element) {
    const wrapper = element.querySelector('.desc-wrapper');
    const isOpen = wrapper.style.height !== "0px" && wrapper.style.height !== "";

    gsap.to(".desc-wrapper", { height: 0, duration: 0.3, ease: "power2.inOut" });

    if (!isOpen) {
        gsap.to(wrapper, { height: "auto", duration: 0.5, ease: "back.out(1.7)" });
        // Use the global addLog
        if (typeof addLog === "function") {
            addLog(`INSPECTING: ${element.querySelector('h3, p').innerText}`);
        }
    }
}

// PART 3: THE FINAL NARRATIVE FADE (FAIL-SAFE VERSION)
window.addEventListener('load', () => { // Using 'load' ensures images/videos are ready
    
    // 1. First, we hide them via JS (if JS is disabled/broken, they stay visible)
    gsap.set(".fade-in-text", { opacity: 0, y: 30 });

    // 2. Then we trigger the reveal
    gsap.to(".fade-in-text", {
        opacity: 1,
        y: 0,
        duration: 10,
        stagger: 0.3,
        ease: "power2.out",
        scrollTrigger: {
            trigger: "#final-narrative",
            start: "top 85%", // Fires as soon as the box touches the bottom of the screen
            toggleActions: "play none none none",
            // This is critical for Lenis:
            invalidateOnRefresh: true 
        }
    });
});

// 1. PORTAL ANIMATIONS
function openPortal() {
    const portal = document.querySelector("#code-portal");
    const content = document.querySelector(".portal-content");
    
    portal.style.display = "flex";
    gsap.to(portal, { opacity: 1, duration: 0.5 });
    gsap.to(content, { scale: 1, opacity: 1, duration: 0.8, ease: "expo.out" });
    
    addLog("PORTAL_OPEN: DECLASSIFYING_SOURCE_CODE...");
}

function closePortal() {
    const portal = document.querySelector("#code-portal");
    const content = document.querySelector(".portal-content");
    
    gsap.to(content, { scale: 0.8, opacity: 0, duration: 0.5 });
    gsap.to(portal, { opacity: 0, duration: 0.5, onComplete: () => {
        portal.style.display = "none";
    }});
}

// 2. THE FINAL NARRATIVE FIX (FOR THE EMPTY BOX)
// We add a 'Force Check' to ensure the text appears
gsap.to(".fade-in-text", {
    opacity: 1,
    y: 0,
    stagger: 0.3,
    scrollTrigger: {
        trigger: "#final-narrative",
        start: "top 25%",
        // This ensures the animation plays even if the scroll is fast
        onEnter: () => {
            gsap.to(".fade-in-text", { opacity: 1, y: 0, stagger: 0.2 });
            console.log("Narrative Revealed");
        }
    }

});





