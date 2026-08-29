const starterPlayers = [
  { name: "Obed", id: "EF-001" },
  { name: "David", id: "EF-002" },
  { name: "Mike", id: "EF-003" }
];

let players =
  JSON.parse(localStorage.getItem("ef_players")) ||
  starterPlayers;

const $ = (id) => document.getElementById(id);

function savePlayers() {
  localStorage.setItem(
    "ef_players",
    JSON.stringify(players)
  );
}

function renderPlayers() {

  $("count").textContent = players.length;
  $("heroCount").textContent = players.length;

  if (players.length >= 8) {
    $("status").textContent =
      "Room full — tournament ready!";
  } else {
    $("status").textContent =
      "Waiting for players...";
  }

  let html = "";

  players.forEach((player) => {

    html += `
      <div class="player">

        <div class="avatar">
          ${player.name.charAt(0).toUpperCase()}
        </div>

        <div>
          <div class="name">
            ${escapeHtml(player.name)}
          </div>

          <div class="id">
            ${escapeHtml(player.id || "ID not added")}
          </div>
        </div>

      </div>
    `;
  });

  for (
    let i = players.length;
    i < 8;
    i++
  ) {

    html += `
      <div class="player waiting">

        <div class="avatar">
          +
        </div>

        <div>
          <div class="name">
            Waiting...
          </div>

          <div class="id">
            Open slot
          </div>
        </div>

      </div>
    `;
  }

  $("players").innerHTML = html;

  renderBracket();
}


function renderBracket() {

  if (players.length < 8) {

    $("bracket").innerHTML = "";

    $("startMessage").style.display =
      "block";

    return;
  }

  $("startMessage").style.display =
    "none";

  const p = [...players].slice(0, 8);

  const quarterFinals = [

    [p[0], p[1]],

    [p[2], p[3]],

    [p[4], p[5]],

    [p[6], p[7]]

  ];

  function match(player1, player2) {

    return `
      <div class="match">

        <div>
          ${escapeHtml(player1.name)}
          <span>—</span>
        </div>

        <div>
          ${escapeHtml(player2.name)}
          <span>—</span>
        </div>

      </div>
    `;
  }

  $("bracket").innerHTML = `

    <div class="rounds">

      <div class="round">

        <h3>
          QUARTER-FINALS
        </h3>

        ${quarterFinals
          .map(pair =>
            match(pair[0], pair[1])
          )
          .join("")}

      </div>


      <div class="round">

        <h3>
          SEMI-FINALS
        </h3>

        ${match(
          { name: "QF Winner 1" },
          { name: "QF Winner 2" }
        )}

        ${match(
          { name: "QF Winner 3" },
          { name: "QF Winner 4" }
        )}

      </div>


      <div class="round">

        <h3>
          FINAL
        </h3>

        ${match(
          { name: "SF Winner 1" },
          { name: "SF Winner 2" }
        )}

      </div>

    </div>
  `;
}


$("joinBtn").addEventListener(
  "click",
  () => {

    const name =
      $("playerName").value.trim();

    const id =
      $("playerId").value.trim();

    if (!name) {

      alert(
        "Please enter your eFootball name."
      );

      return;
    }

    if (players.length >= 8) {

      alert(
        "This tournament room is full."
      );

      return;
    }

    const alreadyJoined =
      players.some(
        player =>
          player.name.toLowerCase() ===
          name.toLowerCase()
      );

    if (alreadyJoined) {

      alert(
        "That player name is already in the room."
      );

      return;
    }

    players.push({
      name: name,
      id: id
    });

    savePlayers();

    $("playerName").value = "";
    $("playerId").value = "";

    renderPlayers();

    $("lobby").scrollIntoView({
      behavior: "smooth"
    });

  }
);


$("joinHero").addEventListener(
  "click",
  () => {

    $("lobby").scrollIntoView({
      behavior: "smooth"
    });

  }
);


$("resetBtn").addEventListener(
  "click",
  () => {

    players =
      starterPlayers.map(
        player => ({ ...player })
      );

    savePlayers();

    renderPlayers();

  }
);


$("howBtn").addEventListener(
  "click",
  () => {

    $("howModal")
      .classList
      .remove("hidden");

  }
);


$("closeModal").addEventListener(
  "click",
  () => {

    $("howModal")
      .classList
      .add("hidden");

  }
);


$("howModal").addEventListener(
  "click",
  (event) => {

    if (
      event.target ===
      $("howModal")
    ) {

      $("howModal")
        .classList
        .add("hidden");

    }

  }
);


function escapeHtml(text) {

  return String(text).replace(
    /[&<>"']/g,
    function (character) {

      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      }[character];

    }
  );

}


renderPlayers();
// Test connection
console.log("eFootball Arena is working!");
