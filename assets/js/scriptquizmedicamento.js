var ul = document.getElementById('ul');
var nextButton = document.getElementById('btnNext');
var quizbox = document.getElementById('questionBox');
var messageBox = document.getElementById('messageBox');
var opt1 = document.getElementById('opt1');
var opt2 = document.getElementById('opt2');
var opt3 = document.getElementById('opt3');
var opt4 = document.getElementById('opt4');
var scoreCard = document.getElementById('scoreCard');

var app = {
  questions: [
    {
      q: '¿Qué figura histórica se considera representativa del inicio de la yatroquímica, corriente que usaba productos químicos para elaborar sustancias curativas?',
      options: ['Avicena', 'Paracelso', 'Hipócrates', 'Galeno'],
      answer: 1
    },
    {
      q: '¿Cuál de los siguientes objetos estaba asociado a la preparación del medicamento conocido como Triaca Magna?',
      options: ['Alambique', 'Mortero', 'Víbora', 'Piedra bezoar'],
      answer: 2
    },
    {
      q: '¿Por qué sustituyeron los botes de porcelana a los albarelos en muchas boticas del siglo XIX?',
      options: ['Porque eran más porosos y ventilaban mejor el contenido.', 'Porque resultaban más baratos, menos porosos y fáciles de limpiar y etiquetar.', 'Porque permitían conservar solo líquidos destilados.', 'Porque su fabricación en cobre mejoraba la estabilidad térmica.'],
      answer: 1
    }
  ],
  index: 0,
  score: 0,
  attempts: 0,

  load: function () {
    if (this.index <= this.questions.length - 1) {
      var q = this.questions[this.index];
      quizbox.innerHTML = (this.index + 1) + ". " + q.q;
      opt1.innerHTML = q.options[0];
      opt2.innerHTML = q.options[1];
      opt3.innerHTML = q.options[2];
      opt4.innerHTML = q.options[3];
      nextButton.style.display = "none";
      messageBox.innerHTML = "";
      this.attempts = 0;
    } else {
      // Pantalla final
      quizbox.innerHTML = "🎉 Test completado";
      ul.style.display = "none";
      nextButton.style.display = "none";
      messageBox.innerHTML = "";

      const finalButtons = document.createElement("div");
      finalButtons.className = "final-buttons";
      finalButtons.innerHTML = `
        <button onclick="window.location.href='quizmedicamento.html'">🔁 Jugar de nuevo</button>
        <button onclick="window.location.href='itmedicamento.html'">➡️ Siguiente itinerario</button>
        <button onclick="window.location.href='intro.html'">🏠 Ir al inicio</button>
      `;
      quizbox.appendChild(finalButtons);    
      // Botón “Jugar de nuevo” recarga toda la página
document.getElementById('btnRestart').addEventListener('click', () => {
  window.location.reload();
});
    }
  },

  next: function () {
    this.index++;
    this.allowClick();
    this.load();
  },

  check: function (ele) {
    var chosenIndex = parseInt(ele.id.replace('opt', '')) - 1;
    var correct = this.questions[this.index].answer;

    if (chosenIndex === correct) {
      ele.className = "correct";
      this.score++;
      messageBox.innerHTML = "✅ ¡Correcto!";
      this.scoreCard();
      nextButton.style.display = "block";
      this.preventClick();
    } else {
      this.attempts++;
      ele.className = "wrong";

      if (this.attempts === 1) {
        messageBox.innerHTML = "❌ Fallaste. Vuelve a intentarlo.";
      } else {
        messageBox.innerHTML = `✅ La respuesta correcta era "<strong>${this.questions[this.index].options[correct]}</strong>".`;
        ul.children[correct].className = "correct";
        nextButton.style.display = "block";
        this.preventClick();
      }
    }
  },

  preventClick: function () {
    for (let i = 0; i < ul.children.length; i++) {
      ul.children[i].style.pointerEvents = "none";
    }
  },

  allowClick: function () {
    for (let i = 0; i < ul.children.length; i++) {
      ul.children[i].style.pointerEvents = "auto";
      ul.children[i].className = '';
    }
  },

  scoreCard: function () {
    scoreCard.innerHTML = this.score + "/" + this.questions.length;
  },

  restart: function () {
    this.index = 0;
    this.score = 0;
    ul.style.display = "block";
    this.load();
    this.scoreCard();
  }
};

window.onload = function () {
  app.load();
  app.scoreCard();
};

function button(ele) {
  app.check(ele);
}

function next() {
  app.next();
}
