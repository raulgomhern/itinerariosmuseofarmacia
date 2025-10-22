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
      q: '¿Cuál de los siguientes requisitos debía cumplir un aspirante a boticario antes de 1834?',
      options: ['Ser mayor de 18 años y demostrar experiencia en medicina', 'Tener limpieza de sangre y haber sido aprendiz de boticario', 'Haber cursado estudios de química y botánica', 'Ser hijo de farmacéutico y haber nacido en Madrid'],
      answer: 1
    },
    {
      q: '¿En qué institución comenzaron a impartirse oficialmente clases para mancebos de botica en 1783?',
      options: ['En el Real Laboratorio de la Corte', 'En la Facultad de Medicina de Alcalá', 'En el Real Jardín Botánico de Madrid', 'En el Real Colegio de Boticarios de Sevilla'],
      answer: 2
    },
    {
      q: '¿Cuándo se incorporaron las mujeres a los estudios de Farmacia en Madrid?',
      options: ['1845', '1931', '1898', '1945'],
      answer: 2
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
        <button onclick="window.location.href='quizprofesional.html'">🔁 Jugar de nuevo</button>
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
