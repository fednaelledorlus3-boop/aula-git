const searchInput = document.getElementById('searchInput');
const themeToggle = document.getElementById('themeToggle');
const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('formSuccess');
const searchableSections = Array.from(document.querySelectorAll('.content-section, .hero, .contact-section, .sidebar'));
const allCards = Array.from(document.querySelectorAll('.section-card, .sidebar'));

const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const subjectInput = document.getElementById('subject');
const messageInput = document.getElementById('message');

function setError(fieldName, message) {
  const errorNode = document.querySelector(`[data-error-for="${fieldName}"]`);
  const inputNode = document.getElementById(fieldName);

  if (errorNode) {
    errorNode.textContent = message;
  }

  if (inputNode) {
    inputNode.setAttribute('aria-invalid', message ? 'true' : 'false');
  }
}

function clearErrors() {
  ['name', 'email', 'subject', 'message'].forEach((fieldName) => setError(fieldName, ''));
  successMessage.textContent = '';
}

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function clearHighlights() {
  document.querySelectorAll('mark').forEach((mark) => {
    const parent = mark.parentNode;
    if (parent) {
      parent.replaceChild(document.createTextNode(mark.textContent), mark);
      parent.normalize();
    }
  });
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Validação completa do formulário com feedback inline.
function validateForm(event) {
  event.preventDefault();
  clearErrors();

  const nameValue = nameInput.value.trim();
  const emailValue = emailInput.value.trim();
  const subjectValue = subjectInput.value.trim();
  const messageValue = messageInput.value.trim();
  let isValid = true;

  if (nameValue.length < 3) {
    setError('name', 'Informe um nome com pelo menos 3 caracteres.');
    isValid = false;
  }

  if (!validateEmail(emailValue)) {
    setError('email', 'Digite um e-mail válido.');
    isValid = false;
  }

  if (!subjectValue) {
    setError('subject', 'Escolha um assunto.');
    isValid = false;
  }

  if (messageValue.length < 15) {
    setError('message', 'A mensagem precisa ter pelo menos 15 caracteres.');
    isValid = false;
  }

  if (isValid) {
    successMessage.textContent = 'Mensagem enviada com sucesso! Os dados foram validados corretamente.';
    contactForm.reset();
  }
}

// Aplica filtro simples nos blocos principais da página.
function filterContent() {
  const term = searchInput.value.trim().toLowerCase();
  clearHighlights();

  allCards.forEach((card) => {
    card.classList.remove('is-hidden');
  });

  if (!term) {
    searchableSections.forEach((section) => {
      section.classList.remove('is-hidden');
    });
    return;
  }

  searchableSections.forEach((section) => {
    const text = section.textContent.toLowerCase();
    if (text.includes(term)) {
      section.classList.remove('is-hidden');
      section.querySelectorAll('mark').forEach((mark) => {
        const parent = mark.parentNode;
        if (parent) {
          parent.replaceChild(document.createTextNode(mark.textContent), mark);
          parent.normalize();
        }
      });
    } else {
      section.classList.add('is-hidden');
    }
  });
}

// Destaca um termo específico dentro do texto exibido.
function highlightSearch(term) {
  if (!term) return;

  searchableSections.forEach((section) => {
    const walker = document.createTreeWalker(section, NodeFilter.SHOW_TEXT, null);
    const textNodes = [];

    while (walker.nextNode()) {
      const currentNode = walker.currentNode;
      if (currentNode.nodeValue && currentNode.nodeValue.trim()) {
        textNodes.push(currentNode);
      }
    }

    textNodes.forEach((textNode) => {
      const parent = textNode.parentNode;
      if (!parent || parent.closest('script, style')) {
        return;
      }

      const textContent = textNode.nodeValue;
  const regex = new RegExp(`(${escapeRegExp(term)})`, 'gi');

      if (regex.test(textContent)) {
        const fragment = document.createDocumentFragment();
        let lastIndex = 0;
        textContent.replace(regex, (match, _group, offset) => {
          if (offset > lastIndex) {
            fragment.appendChild(document.createTextNode(textContent.slice(lastIndex, offset)));
          }

          const highlight = document.createElement('mark');
          highlight.textContent = match;
          fragment.appendChild(highlight);
          lastIndex = offset + match.length;
          return match;
        });

        if (lastIndex < textContent.length) {
          fragment.appendChild(document.createTextNode(textContent.slice(lastIndex)));
        }

        parent.replaceChild(fragment, textNode);
      }
    });
  });
}

// Alterna entre os temas claro e escuro.
function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  themeToggle.textContent = isDark ? 'Modo Claro' : 'Modo Escuro';
}

function createDynamicBanner() {
  const banner = document.createElement('div');
  banner.className = 'mini-article';
  banner.innerHTML = '<strong>Mensagem dinâmica:</strong> Este bloco foi criado com JavaScript para demonstrar manipulação de DOM sem frameworks.';

  const hero = document.querySelector('.hero-copy');
  if (hero) {
    hero.appendChild(banner);
  }
}

function makeCardInteractive() {
  const cards = document.querySelectorAll('.section-card');

  cards.forEach((card) => {
    card.addEventListener('click', () => {
      cards.forEach((item) => item.style.borderColor = 'var(--border)');
      card.style.borderColor = 'var(--accent)';
      card.style.transform = 'translateY(-2px)';

      window.setTimeout(() => {
        card.style.transform = 'translateY(0)';
      }, 180);
    });
  });
}

searchInput.addEventListener('input', () => {
  filterContent();
  highlightSearch(searchInput.value.trim().toLowerCase());
});

themeToggle.addEventListener('click', toggleTheme);
contactForm.addEventListener('submit', validateForm);

createDynamicBanner();
makeCardInteractive();

// Estado inicial para manter o formulário e o filtro previsíveis.
clearErrors();