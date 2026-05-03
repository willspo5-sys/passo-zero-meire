/**
 * Vídeo de conversão (YouTube)
 * ---------------------------------
 * Quando o vídeo estiver publicado, defina o ID abaixo.
 * O ID é a parte final da URL: youtube.com/watch?v=ESTE_ID
 */

/**
 * Automação de WhatsApp e Grupo VIP
 * ---------------------------------
 * Configure os links abaixo para ativar a automação.
 */
const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbyUFMrUNTG8LqR1Qz78lkfdRDrv9l1WjdR_onxbuuzHCELHwopuQJDvawdZMkRxxedlMQ/exec";
const WHATSAPP_GROUP_LINK = "https://chat.whatsapp.com/BtAbBjjIfAI4YzpMGAEpo6";


function initScrollReveal() {
  const reveals = document.querySelectorAll(".reveal");
  const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  reveals.forEach((el) => observer.observe(el));
}

document.addEventListener("DOMContentLoaded", () => {
  initScrollReveal();
});
