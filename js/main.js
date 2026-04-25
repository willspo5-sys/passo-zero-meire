/**
 * Vídeo de conversão (YouTube)
 * ---------------------------------
 * Quando o vídeo estiver publicado, defina o ID abaixo.
 * O ID é a parte final da URL: youtube.com/watch?v=ESTE_ID
 */
const YOUTUBE_CONVERSION_VIDEO_ID = "";

/**
 * Automação de WhatsApp e Grupo VIP
 * ---------------------------------
 * Configure os links abaixo para ativar a automação.
 */
const WEBHOOK_URL = ""; // Link do Make, Zapier ou API de WhatsApp
const WHATSAPP_GROUP_LINK = "https://chat.whatsapp.com/SEU_LINK_AQUI";

function initConversionVideo() {
  const shell = document.querySelector("[data-conversion-video]");
  if (!shell) return;

  const placeholder = shell.querySelector(".video-placeholder");
  const id = YOUTUBE_CONVERSION_VIDEO_ID.trim();

  if (id && placeholder) {
    placeholder.remove();
    const iframe = document.createElement("iframe");
    iframe.setAttribute(
      "src",
      `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`
    );
    iframe.setAttribute("title", "Vídeo do curso");
    iframe.setAttribute("allowfullscreen", "");
    iframe.setAttribute(
      "allow",
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    );
    shell.appendChild(iframe);
  }
}

function initVipForm() {
  const modal = document.getElementById("vip-modal");
  const form = document.getElementById("vip-form");
  if (!modal || !form) return;

  const phoneInput = form.querySelector("#whatsapp");
  const closeBtn = modal.querySelector(".modal-close");

  const openModal = () => {
    modal.classList.add("active");
    document.body.style.overflow = "hidden"; // Prevent scroll
  };

  const closeModal = () => {
    modal.classList.remove("active");
    document.body.style.overflow = ""; // Restore scroll
  };

  // Escutar todos os botões que levam ao VIP
  document.querySelectorAll('a[href="#grupo-vip"]').forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openModal();
    });
  });

  // Fechar modal
  closeBtn?.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) closeModal();
  });

  // Mascará simples para o telefone (ex: (00) 00000-0000)
  if (phoneInput) {
    phoneInput.addEventListener("input", (e) => {
      let x = e.target.value.replace(/\D/g, "").match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
      e.target.value = !x[2] ? x[1] : "(" + x[1] + ") " + x[2] + (x[3] ? "-" + x[3] : "");
    });
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const originalBtnText = btn.textContent;
    const formData = new FormData(form);
    const data = {
      nome: formData.get("nome"),
      whatsapp: formData.get("whatsapp"),
      origem: window.location.href,
      data: new Date().toISOString(),
    };

    // Feedback visual (Loading)
    btn.disabled = true;
    btn.textContent = "Processando...";
    btn.style.opacity = "0.7";

    try {
      // 1. Enviar para o Webhook (se configurado)
      if (WEBHOOK_URL) {
        await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      } else {
        console.log("Simulação: Lead capturado localmente", data);
        // Pequeno delay para simular processamento se não houver URL
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      // 2. Redirecionar para o Grupo VIP
      window.location.href = WHATSAPP_GROUP_LINK;
    } catch (error) {
      console.error("Erro na automação:", error);
      alert("Houve um erro ao processar sua inscrição. Tente novamente.");
      btn.disabled = false;
      btn.textContent = originalBtnText;
      btn.style.opacity = "1";
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initConversionVideo();
  initVipForm();
});
