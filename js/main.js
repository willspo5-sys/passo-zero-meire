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
const WHATSAPP_GROUP_LINK = "https://chat.whatsapp.com/SEU_LINK_AQUI";


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
    
    // Coleta todos os dados do formulário de forma dinâmica
    const data = {
      origem: window.location.href,
      data_registro: new Date().toISOString(),
    };
    
    for (let [key, value] of formData.entries()) {
      // Se já existe a chave (múltiplos checkboxes), transforma em array
      if (data[key]) {
        if (!Array.isArray(data[key])) {
          data[key] = [data[key]];
        }
        data[key].push(value);
      } else {
        data[key] = value;
      }
    }

    // Feedback visual (Loading)
    btn.disabled = true;
    btn.textContent = "Processando...";
    btn.style.opacity = "0.7";

    try {
      // 1. Enviar para o Webhook (se configurado)
      if (WEBHOOK_URL) {
        await fetch(WEBHOOK_URL, {
          method: "POST",
          mode: "no-cors", // Necessário para evitar erros de CORS com Google Apps Script
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      } else {
        console.log("Lead Capturado (Simulação):", data);
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }

      // 2. Redirecionar para a Página de Obrigado
      const redirectUrl = new URL('obrigado.html', window.location.href);
      redirectUrl.searchParams.set('group', WHATSAPP_GROUP_LINK);
      window.location.href = redirectUrl.toString();
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
  initVipForm();
});
