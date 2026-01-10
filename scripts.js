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
  !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '3457191164418833');
  fbq("trackCustom", "ClickBotãoWhatsApp");
  console.log("Evento ClickBotãoWhatsApp rastreado no Facebook Pixel");
}

//track envio de formulário de contato
function trackFormSubmit() {
  !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '3457191164418833');
  fbq("trackCustom", "EnvioFormContato");
  console.log("Formulário de contato enviado - evento rastreado no Facebook Pixel");
}

function trackVejaMaisCard1() {
  !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '3457191164418833');
  fbq("trackCustom", "VejaMaisCard1");
  console.log("Evento VejaMaisCard1 rastreado no Facebook Pixel");
}

function trackVejaMaisCard2() {
  !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '3457191164418833');
  fbq("trackCustom", "VejaMaisCard2");
  console.log("Evento VejaMaisCard2 rastreado no Facebook Pixel");
}

function trackVejaMaisCard3() {
  !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '3457191164418833');
  fbq("trackCustom", "VejaMaisCard3");
  console.log("Evento VejaMaisCard3 rastreado no Facebook Pixel");
}

function trackBotaoVejaMaisAqui() {
  !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '3457191164418833');
  fbq("trackCustom", "ClickBotaoVejaMaisAqui");
  console.log("Evento ClickBotaoVejaMaisAqui rastreado no Facebook Pixel");
}

function trackClickAgendeJa() {
  !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '3457191164418833');
  fbq("trackCustom", "ClickAgendeJa");
  console.log("Evento ClickAgendeJa rastreado no Facebook Pixel");
}
