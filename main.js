
// Web Component for a single lottery ticket
class LottoTicket extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['numbers'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'numbers') {
      this.render();
    }
  }

  render() {
    const numbers = JSON.parse(this.getAttribute('numbers') || '[]');
    const styles = `
      :host {
        display: block;
        margin-bottom: 1rem;
      }
      .ticket-container {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 1rem;
        border: 1px solid #ddd;
        border-radius: 8px;
        background-color: #f9f9f9;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      .lotto-ball {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: #f0f0f0;
        color: #333;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
        font-size: 1.2rem;
        margin: 0 5px;
        box-shadow: inset 0 -2px 4px rgba(0,0,0,0.2);
      }
    `;

    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      <div class="ticket-container">
        ${numbers.map(num => `<div class="lotto-ball">${num}</div>`).join('')}
      </div>
    `;
  }
}

customElements.define('lotto-ticket', LottoTicket);

// --- Main Application Logic ---

const generatorBtn = document.getElementById('generator-btn');
const ticketsContainer = document.getElementById('lotto-tickets-container');
const darkModeToggle = document.getElementById('dark-mode-toggle');

// --- Dark Mode Logic ---

// Check for saved dark mode preference
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
if (localStorage.getItem('darkMode') === 'enabled' || (localStorage.getItem('darkMode') === null && prefersDark.matches)) {
    document.body.classList.add('dark-mode');
    darkModeToggle.textContent = 'Light Mode';
}


darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    let isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');

    // Update button text
    darkModeToggle.textContent = isDarkMode ? 'Light Mode' : 'Dark Mode';
});


// --- Lotto Generator Logic ---

// Function to generate a set of 6 unique numbers
function generateLottoNumbers() {
    const numbers = new Set();
    while (numbers.size < 6) {
        const randomNumber = Math.floor(Math.random() * 45) + 1;
        numbers.add(randomNumber);
    }
    return Array.from(numbers).sort((a, b) => a - b);
}

// Event listener for the button
generatorBtn.addEventListener('click', () => {
    // Clear previous tickets
    ticketsContainer.innerHTML = '';

    // Generate 5 new games
    for (let i = 0; i < 5; i++) {
        const newNumbers = generateLottoNumbers();
        const lottoTicket = document.createElement('lotto-ticket');
        lottoTicket.setAttribute('numbers', JSON.stringify(newNumbers));
        ticketsContainer.appendChild(lottoTicket);
    }
});
