let turn = "player-1";
let vencedor = "none";
let stopClick = false;

document.querySelector("#player-1").style.marginLeft = "-9.8vmin";
document.querySelector("#player-1").style.marginTop = "0vmin";
document.querySelector("#player-2").style.marginLeft = "-9.8vmin";
document.querySelector("#player-2").style.marginTop = "0vmin";

class CobrasEscadas {
  constructor() {
    this.pos = [
      //Escadas
      [9.8, 0],
      [58.8, 0],
      [68.6, 0],
      [49, -9.8],
      [0, -19.6],
      [68.6, -19.6],
      [39.2, -29.4],
      [88.2, -49],
      [88.2, -68.6],
      [19.6, -68.6],
      [58.8, -78.4],
      //Cobras
      [39.2, -9.8],
      [49, -39.2],
      [78.4, -39.2],
      [9.8, -58.8],
      [29.4, -58.8],
      [58.8, -68.6],
      [78.4, -78.4],
      [78.4, -88.2],
      [49, -88.2],
      [9.8, -88.2],
    ];
    this.destino = [
      //Escadas
      [19.6, -29.4],
      [58.8, -9.8],
      [88.2, -29.4],
      [49, -19.6],
      [9.8, -39.2],
      [29.4, -78.4],
      [29.4, -39.2],
      [58.8, -58.8],
      [88.2, -88.2],
      [19.6, -88.2],
      [58.8, -88.2],
      //Cobras
      [49, 0],
      [39.2, -19.6],
      [88.2, -9.8],
      [9.8, -9.8],
      [0, -49],
      [68.6, -49],
      [68.6, -68.6],
      [68.6, -78.4],
      [49, -68.6],
      [0, -68.6],
    ];

    this.createBoard();
  }

  createBoard() {
    let boxes = document.querySelectorAll(".box");
    boxes.forEach((box, i) => {
      if (
        String(i).length == 1 ||
        (String(i).length == 2 && Number(String(i)[0])) % 2 == 0
      ) {
        let number = 100 - i;
        box.innerHTML = number;

        box.style.backgroundColor = number % 2 == 0 ? "#bdecb6" : "#7fffd4";
      } else {
        let number = String(
          Number(`${9 - Number(String(i)[0])}${String(i)[1]}`) + 1
        );
        box.innerHTML = number;

        box.style.backgroundColor = number % 2 == 0 ? "#bdecb6" : "#ffcbdb";
      }
    });
  }

  jogar() {
    return new Promise(async (resolve) => {
      let dados = [
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
      ];
      let values = [
        [0, -360],
        [-180, -360],
        [-180, 270],
        [0, -90],
        [270, 180],
        [90, 90],
      ];
      new Audio("./resources/sfx/dice-roll.mp3").play();

      let dadosClass = document.querySelectorAll(".dados");

      dadosClass.forEach((dado) => {
        dado.style.transform = "rotateX(360deg) rotateY(360deg)";
      });

      await new Promise((resolve) => setTimeout(resolve, 750));
      dadosClass.forEach((dado, i = 0) => {
        dado.style.transform = `rotateX(${
          values[dados[i] - 1][0]
        }deg) rotateY(${values[dados[i] - 1][1]}deg)`;
        i++;
      });
      await new Promise((resolve) => setTimeout(resolve, 750));
      dados.igual = dados[0] === dados[1];
      resolve(dados);
    });
  }

  playerMove(direction) {
    return new Promise(async (resolve) => {
      if (direction == "up") {
        document.querySelector(`#${turn}`).style.marginTop =
          String(this.marginTop() - 9.8) + "vmin";
      } else if (direction == "right") {
        document.querySelector(`#${turn}`).style.marginLeft =
          String(this.marginLeft() + 9.8) + "vmin";
      } else if (direction == "left") {
        document.querySelector(`#${turn}`).style.marginLeft =
          String(this.marginLeft() - 9.8) + "vmin";
      }
      new Audio("./resources/sfx/move.mp3").play();
      await new Promise((resolve) => setTimeout(resolve, 400));
      resolve();
    });
  }

  run(valorDados, closeToWin) {
    return new Promise(async (resolve) => {
      let oneDirection = false;
      for (let i = 0; i < valorDados; i++) {
        if (this.marginLeft() == 0 && this.marginTop() == -88.2 && closeToWin) {
          oneDirection = true;
        }
        let direction = oneDirection ? "right" : this.getDirection();
        await this.playerMove(direction);
      }
      this.checkCobrasEscadasPos();
      resolve();
    });
  }

  checkVencedor() {
    if (this.marginTop() == -88.2 && this.marginLeft() == 0) {
      let player;
      switch (turn) {
        case "player-1":
          player = "Player 1";
          break;
        case "player-2":
          player = "Player 2";
          break;
      }
      document.querySelector("#p_turn").innerHTML = `${player} ganhou!`;
      return turn;
    }
    return "none";
  }

  checkMove(valorDados) {
    if (
      this.marginTop() == -88.2 &&
      this.marginLeft() + Number((valorDados * -9.8).toFixed(1)) < 0
    ) {
      return true;
    }
    return false;
  }

  checkCobrasEscadasPos() {
    return new Promise(async (resolve, reject) => {
      for (let i = 0; i < this.destino.length; i++) {
        if (
          this.marginLeft() == this.pos[i][0] &&
          this.marginTop() == this.pos[i][1]
        ) {
          if (this.marginTop() > this.destino[i][1]) {
            Swal.fire({
              title: "Uhuull!",
              text: "Você parou em uma escada e subiu até o topo!",
              imageUrl: "./resources/img/ladder.png",
              imageWidth: 100,
              imageHeight: 150,
              confirmButtonText: "Ok!",
            });
          } else {
            Swal.fire({
              title: "Pooooxaa!",
              text: "Você parou em uma cobra e desceu até a cauda!",
              imageUrl: "./resources/img/snake.png",
              imageWidth: 150,
              imageHeight: 150,
              confirmButtonText: "Ok!",
            });
          }

          document.querySelector(
            `#${turn}`
          ).style.marginLeft = `${this.destino[i][0]}vmin`;
          document.querySelector(
            `#${turn}`
          ).style.marginTop = `${this.destino[i][1]}vmin`;
          await new Promise((resolve) => setTimeout(resolve, 400));
          break;
        }
      }
      resolve();
    });
  }

  changeTurn() {
    let players = document.querySelectorAll(".player-avatar");
    switch (turn) {
      case "player-2":
        document.querySelector("#p_turn").innerHTML = "Vez do Player 1";
        players.forEach((value) => {
          value.classList.toggle("active");
        });
        turn = "player-1";
        break;
      case "player-1":
        document.querySelector("#p_turn").innerHTML = "Vez do Player 2";
        turn = "player-2";
        players.forEach((value) => {
          value.classList.toggle("active");
        });
        break;
    }
  }

  getDirection() {
    let direction;
    if (
      (this.marginLeft() == 88.2 &&
        ((this.marginTop() * 10) % (-19.6 * 10)) / 10 == 0) ||
      (this.marginLeft() == 0 &&
        ((this.marginTop() * 10) % (-19.6 * 10)) / 10 != 0)
    ) {
      direction = "up";
    } else if (((this.marginTop() * 10) % (-19.6 * 10)) / 10 == 0) {
      direction = "right";
    } else {
      direction = "left";
    }
    return direction;
  }

  marginLeft() {
    return Number(
      document.querySelector(`#${turn}`).style.marginLeft.split("v")[0]
    );
  }

  marginTop() {
    return Number(
      document.querySelector(`#${turn}`).style.marginTop.split("v")[0]
    );
  }
}
var jogo = new CobrasEscadas();

document.getElementById("jogarDados").addEventListener("click", async () => {
  if (!stopClick) {
    stopClick = true;
    let dados = await jogo.jogar();
    dados.reduce((a, b) => a + b, 0);
    let valorDados = dados.reduce((a, b) => a + b, 0);
    let closeToWin = jogo.checkMove(valorDados);
    await new Promise((resolve) => setTimeout(resolve, 400));
    await jogo.run(valorDados, closeToWin);
    await new Promise((resolve) => setTimeout(resolve, 400));
    vencedor = jogo.checkVencedor();
    if (vencedor == "none") {
      if (!dados.igual) {
        jogo.changeTurn();
      }
      stopClick = false;
    } else {
    }
  }
  if (vencedor != "none") {
    Swal.fire({
      title: "O jogo acabou!",
      imageUrl: "./resources/img/gameover.png",
      imageWidth: 150,
      imageHeight: 150,
      confirmButtonText: "Ok!",
    });
  }
});

document.getElementById("info").addEventListener("click", () => {
  Swal.fire({
    icon: 'info',
    title: "Regras do Jogo",
    html: `
      1. Existem dois jogadores e ambos começam fora do tabuleiro.<br/> <br/> 
      2. O jogador 1 começa e alterna sua vez com o jogador 2.<br/> <br/> 
      3. Um jogador deve jogar dois dados e somar sua posição atual ao valor da
      soma dos dados sempre em ordem crescente, do 1 até o 100.<br/> <br/> 
      ○ Exemplo: Caso um jogador esteja na casa 7 e o somatório dos dados
      dá 6, ele deve ir até a casa 13;<br/> <br/> 
      4. Caso o valor de ambos os dados seja igual, o jogador atual ganha uma nova
      jogada.<br/> <br/> 
      ○ Exemplo, se o jogador 1 tira 5 no dado 1 e 5 no dado 2 estando na
      casa 7, ele deve se dirigir à casa 17 e jogar novamente.<br/> <br/> 
      5. Caso um jogador pare em uma casa que é a base de uma escada, ele
      obrigatoriamente deve subir até a casa em que está o topo da escada.<br/> <br/> 
      6. Caso um jogador pare em uma casa em que está localizada a cabeça de
      uma cobra, ele vai obrigatoriamente deve descer até o casa onde está a
      ponta da cauda da cobra.<br/> <br/> 
      7. Um jogador deve cair exatamente na última casa (100) para vencer o jogo.
      O primeiro jogador a fazer isso, vence. Mas se o somatório dos dados com a
      casa atual for maior que 100, o jogador deve se movimentar para trás até a
      contagem terminar, como se ele tivesse batido em uma parede e retornasse.<br/> <br/> 
      ○ Exemplo, se um jogador está na casa 98 e o somatório dos dados dá
      5, o jogador deve se mover até a casa 100 (dois movimentos), e fazer
      o retorno, caminhando para 99, 98 e 97 (três, quatro e cinco
      movimentos.)<br/> <br/> 
      8. Se um jogador tirar dados iguais e chegar exatamente na casa 100 sem
      movimentos restantes, então o jogador vence o jogo e não precisa jogar
      novamente.<br/> <br/> 
      ○ Exemplo, se um jogador está na casa 98 e o somatório dos dados dá
      2 (1+1), ele ganha a segunda jogada. Mas como o primeiro
      movimento o faz ficar na casa 100, ele vence o jogo e não precisa
      jogar novamente.
      `,
    confirmButtonText: "Ok!",
  });
});
