class Abberated extends HTMLElement {
  connectedCallback() {
    const text = this.textContent.trim();
    this.innerHTML = '';

    this.amplitude = parseFloat(this.getAttribute('amplitude')) || 25;
    this.frequency = parseFloat(this.getAttribute('frequency')) || 0.15;
    this.speed = parseFloat(this.getAttribute('speed')) || 0.05;

    this.spans = Array.from(text).map((char, index) => {
      const span = document.createElement('span');
      span.textContent = char;
      this.appendChild(span);
      return { element: span, index };
    });

    this.phase = 0;
    this.animate = this.animate.bind(this);
    this.animationId = requestAnimationFrame(this.animate);
  }

  animate() {
    this.phase += this.speed;

    this.spans.forEach(({ element, index }) => {
      const y = Math.sin(this.phase + index * this.frequency) * this.amplitude;
      
      element.style.transform = `translateY(${y}px)`;
    });

    this.animationId = requestAnimationFrame(this.animate);
  }

  disconnectedCallback() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}

customElements.define("abberated-text", Abberated);

class GarbledText extends HTMLElement {
  constructor() {
    super();

    this.isGarbling = false;
    this.animationId = null;

    this.lastGarble = 0;

    this.fps = 5;
    this.unicodeRanges = [
      [0x0100, 0x017F], // Latin Extended-A
      [0x0370, 0x03FF], // Greek and Coptic
      // [0x0400, 0x04FF], // Cyrillic
      // [0x30A0, 0x30FF], // Katakana
      // [0x2580, 0x259F], // Block Elements
      // [0x2800, 0x28FF]  // Braille Patterns
    ];

    this.animation = this.animation.bind(this);
  }

  connectedCallback() {
    this.garble();

    if (this.hasAttribute('fps')) {
      this.fps = parseInt(this.getAttribute('fps'), 10) || this.fps;
    }

    this.animationId = requestAnimationFrame(this.animation);
  }

  disconnectedCallback() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  animation(timestamp) {
    if ((timestamp - this.lastGarble) > (1.0 / this.fps) * 1000.0) {
      this.garble();
      this.lastGarble = timestamp;
    }

    this.animationId = requestAnimationFrame(this.animation);
  }

  garble() {
    this.textContent = Array.from(this.textContent, char => {
      if (char === ' ') return ' ';

      return this.getRandomUnicodeChar();
    }).join('');
  }

  getRandomUnicodeChar() {
    const selectedRange = this.unicodeRanges[Math.floor(Math.random() * this.unicodeRanges.length)];
    const [min, max] = selectedRange;
    const randomCodePoint = Math.floor(Math.random() * (max - min + 1)) + min;
    return String.fromCharCode(randomCodePoint);
  }
}

customElements.define('garbled-text', GarbledText);

class Shake extends HTMLElement {
  connectedCallback() {
    const text = this.textContent.trim();

    this.phaseY = Math.random() * 100.0;
    this.phaseX = Math.random() * 100.0;
    this.animate = this.animate.bind(this);
    this.animationId = requestAnimationFrame(this.animate);

    this.amplitude = parseFloat(this.getAttribute('amplitude')) || 1.0;
  }

  animate() {
    this.phaseY += 0.2;
    this.phaseX += 0.175;

    let y = Math.sin(this.phaseY + 1.0);

    let expSin = Math.sin(this.phaseY + 0.5) * this.amplitude;

    if (y > 0) {
      y = 2.0 ** expSin;
    } 

    if (y < 0) {
      y = -(2.0 ** expSin);
    }


    let x = Math.cos(this.phaseX);

    expSin = Math.cos(this.phaseX) * this.amplitude;

    if (x > 0) {
      x = 2.5 ** expSin;
    } 

    if (x < 0) {
      x = -(2.5 ** expSin);
    }

    this.style.transform = `translateY(${y}px)`;
    this.style.transform += `translateX(${x}px)`;

    this.animationId = requestAnimationFrame(this.animate);
  }

  disconnectedCallback() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}

customElements.define("shake-text", Shake);
