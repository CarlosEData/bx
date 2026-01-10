//Valiação de formulário de contato
function formValidate() {
  // ===== VALIDAÇÃO DO FORMULÁRIO =====
  const form = document.querySelector(".contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const nome = document.getElementById("nome").value.trim();
      const email = document.getElementById("email").value.trim();
      const telefone = document.getElementById("telefone").value.trim();
      const checkbox = document.getElementById("notificacoes").checked;

      if (!nome || !email || !telefone) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
      }

      if (!checkbox) {
        alert("Por favor, aceite receber notificações para continuar.");
        return;
      }
      trackFormSubmit();
      alert("Formulário enviado com sucesso! Entraremos em contato em breve.");

      form.reset();
    });
  }
}

//track Cliques no botão WhatsApp
function trackClickWhatsapp() {
  fbq("trackCustom", "ClickBotãoWhatsApp");
  console.log("Facebook Pixel iniciado e PageView rastreado");
}

//track envio de formulário de contato
function trackFormSubmit() {
  fbq("trackCustom", "EnvioFormContato");
  console.log(
    "Formulário de contato enviado - evento rastreado no Facebook Pixel"
  );
}

function trackVejaMaisCard1() {
  fbq("trackCustom", "VejaMaisCard1");
  console.log("Evento VejaMaisCard1 rastreado no Facebook Pixel");
}

function trackVejaMaisCard2() {
  fbq("trackCustom", "VejaMaisCard2");
  console.log("Evento VejaMaisCard2 rastreado no Facebook Pixel");
}

function trackVejaMaisCard3() {
  fbq("trackCustom", "VejaMaisCard3");
  console.log("Evento VejaMaisCard3 rastreado no Facebook Pixel");
}

function trackBotaoVejaMaisAqui() {
  fbq("trackCustom", "ClickBotaoVejaMaisAqui");
  console.log("Evento ClickBotaoVejaMaisAqui rastreado no Facebook Pixel");
}

function trackClickAgendeJa() {
  fbq("trackCustom", "ClickAgendeJa");
  console.log("Evento ClickAgendeJa rastreado no Facebook Pixel");
}
