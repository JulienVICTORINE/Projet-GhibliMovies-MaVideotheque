// Je récupère tous les éléments
const main = document.querySelector("main");

// je récupère l'id des boutons : affiche dans l'ordre croissant ou décroissant (Tri alphabétique)
const btnAz = document.querySelector("#btnSortAz");
const btnZa = document.querySelector("#btnSortZa");

// je récupère l'id des boutons : affiche les films les plus ou moins notés (Tri par note)
const btnNoteAsc = document.querySelector("#btnNoteAsc");
const btnNoteDesc = document.querySelector("#btnNoteDesc");

// je récupère l'id du bouton range pour extraire une portion des films (Slider (range))
const inputMovieRange = document.querySelector("#inputMovieRange");
const displayMovieRange = document.querySelector("#displayMovieRange");

// je récupère l'id pour pouvoir filtrer et afficher le nom d'un film (Filtrage par nom)
const inputMovieName = document.querySelector("#inputMovieName");

// je récupère l'id pour trier les films du plus court au plus long (Tri par durée)
const btnDurationAsc = document.querySelector("#btnDurationAsc");
const btnDurationDesc = document.querySelector("#btnDurationDesc");

// Tri par année de sortie
const btnDateAsc = document.querySelector("#btnDateAsc");
const btnDateDesc = document.querySelector("#btnDateDesc");

var movies = [];
var sortMethod = "";
var numberOfMovies = 12;
var filter = "";

// Je créé ma fonction pour récupérer tous les films
const fetchMoviesData = async () => {
  try {
    const request = await fetch("https://ghibliapi.vercel.app/films");
    movies = await request.json();
    updateMain();
  } catch (error) {
    console.log(error);
  }
};

// Fonction pour récupérer et afficher tous les films
const updateMain = () => {
  main.innerHTML = ""; // je vide le main
  let filteredMovies = [...movies]; // je fais une copie pour permettre de filtrer, extraire et trier les films

  // Appliquer un filtre sur le bouton pour noter les films
  if (sortMethod === "noteAsc") {
    // On garde que les films les moins bien notés
    filteredMovies = filteredMovies.filter((m) => m.rt_score <= 79);
  } else if (sortMethod === "noteDesc") {
    // On garde que les films les mieux notés
    filteredMovies = filteredMovies.filter((m) => m.rt_score >= 80);
  }

  // On trie les films filtrés
  filteredMovies.sort((a, b) => {
    if (sortMethod == "az") {
      return a.title.localeCompare(b.title);
    } else if (sortMethod == "za") {
      return b.title.localeCompare(a.title);
    } else if (sortMethod == "noteAsc") {
      return a.rt_score - b.rt_score;
    } else if (sortMethod == "noteDesc") {
      return b.rt_score - a.rt_score;
    } else if (sortMethod === "durationAsc") {
      return parseInt(a.running_time) - parseInt(b.running_time); // release_date sont des chaine de caractères, donc on le transforme en nombre
    } else if (sortMethod === "durationDesc") {
      return parseInt(b.running_time) - parseInt(a.running_time); // release_date sont des chaine de caractères, donc on le transforme en nombre
    } else if (sortMethod === "dateAsc") {
      return parseInt(a.release_date) - parseInt(b.release_date);
    } else if (sortMethod === "dateDesc") {
      return parseInt(b.release_date) - parseInt(a.release_date);
    }
  });

  // On extrait une portion des films que l'on veut affiche avec le range (Limitation par slider)
  filteredMovies = filteredMovies.slice(0, numberOfMovies);

  // On filtre les films pour pouvoir effectuer une recherche par son titre
  filteredMovies = filteredMovies.filter((movie) => {
    if (filter != "") {
      return movie.title.toLowerCase().includes(filter.toLocaleLowerCase());
    }
    return movie;
  });

  // On affiche les films
  filteredMovies.map((movie) => {
    const imgSrc = movie.image;
    const title = movie.title;
    const description = movie.description.substring(0, 100) + "...";
    const scoreSur5 = movie.rt_score / 20;
    const duration = movie.running_time;
    const dateDeSortie = movie.release_date;

    // Fonction pour transformer la durée en heures et minutes
    const formatDuration = (minutes) => {
      const h = Math.floor(minutes / 60);
      const m = minutes % 60;
      return `${h}h ${m}min`;
    };

    // Fonction qui convertir un score sur 5 en étoiles
    const renderStars = (scoreSur5) => {
      const fullStar = "⭐";
      const emptyStar = "☆";
      const stars =
        fullStar.repeat(Math.round(scoreSur5)) +
        emptyStar.repeat(5 - Math.round(scoreSur5));
      return stars;
    };

    main.innerHTML += `
          <div class="card">
            <div class="card-header">
              <img src="${imgSrc}" class="card-header__img" alt="${title}" />
            </div>
            <div class="card-body">
              <h5 class="card-body__title">${title}</h5>
              <div class="card-body__infos">
                <p class="card-body__infos_score">Note : <span>${renderStars(
                  scoreSur5
                )}</span> <span>${scoreSur5}/5</span></p>
                <p class="card-body__infos_duration">Durée : <span>${formatDuration(
                  duration
                )}</span></p>
                <p class="card-body__infos_date">Année de sortie : <span>${dateDeSortie}</span></p>
                <h3>Résumé du film</h3>
                <p class="card-body__infos_description"><span>${description}</span></p>
              </div>
            </div>
          </div>
        `;
  });
};

fetchMoviesData();

// je créé un événement pour mes boutons
////////////////////
// Pour afficher les films dans l'ordre croissant ou décroissant
///////////////////
btnAz.addEventListener("click", () => {
  sortMethod = "az";
  updateMain();
});

btnZa.addEventListener("click", () => {
  sortMethod = "za";
  updateMain();
});

///////////////////
// Pour affiche les films les biens ou moins notés
//////////////////
btnNoteAsc.addEventListener("click", () => {
  sortMethod = "noteAsc";
  updateMain();
});

btnNoteDesc.addEventListener("click", () => {
  sortMethod = "noteDesc";
  updateMain();
});

///////////////////
// pour extraire une portion des films
//////////////////
inputMovieRange.addEventListener("input", (e) => {
  displayMovieRange.innerHTML = e.target.value;
  numberOfMovies = e.target.value;
  updateMain();
});

/////////////////
// pour filter les noms des films
////////////////
inputMovieName.addEventListener("input", (e) => {
  filter = e.target.value;
  updateMain();
});

////////////////
// bouton pour trier les films du plus court au plus long
///////////////
btnDurationAsc.addEventListener("click", () => {
  sortMethod = "durationAsc";
  updateMain();
});

btnDurationDesc.addEventListener("click", () => {
  sortMethod = "durationDesc";
  updateMain();
});

///////////////
// Trier les films par date de sortie
//////////////
btnDateAsc.addEventListener("click", () => {
  sortMethod = "dateAsc";
  updateMain();
});

btnDateDesc.addEventListener("click", () => {
  sortMethod = "dateDesc";
  updateMain();
});
