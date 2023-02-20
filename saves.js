const savedGamesList = document.getElementById("savedGamesList");
const savedGames = JSON.parse(localStorage.getItem("savedGames")) || [];

savedGamesList.innerHTML = savedGames
    .map(gameName => {
        return `<li class="game-name">${gameName.name} - ${gameName.gameName}</li>`;
      })
      .join("");


function clearSavedGames() {
        localStorage.removeItem("savedGames");
        window.location.reload();
    }
    
let clearButton = document.getElementById("clear");
    clearButton.addEventListener("click", clearSavedGames);