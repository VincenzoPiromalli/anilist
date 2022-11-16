const api = "https://api.consumet.org/meta/anilist/";

function hexToCssHsl(hex, valuesOnly = false) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  let r = parseInt(result[1], 16);
  let g = parseInt(result[2], 16);
  let b = parseInt(result[3], 16);
  let cssString = "";
  (r /= 255), (g /= 255), (b /= 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h;
  let s;
  let l = (max + min) / 2;
  if (max == min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  cssString = h + "," + s + "%," + l + "%";
  cssString = !valuesOnly ? "hsl(" + cssString + ")" : cssString;

  return cssString;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const lazyLoadInstance = new LazyLoad({
  elements_selector: ".lazy"
});

function SkeletonLazy() {
  setTimeout(function () {
    $(".cover, .title, .content").removeClass("loading");
    $(".cover.lazy").attr("lazy", "loaded");
    new LazyLoad();
  }, 2000);
}

function ProgressBar() {
  const progressBar = $(".progress");
  let width = 0;

  progressBar.width(width);

  var interval = setInterval(function () {
    width += 1;
    progressBar.css("width", width + "%");

    if (width >= 100) {
      clearInterval(interval);
      $(progressBar).removeClass("fixed show");
    }
  }, 9);
}

function showTrending() {
  $.getJSON(
    api + "advanced-search?page=1&perPage=6&sort=[%22TRENDING_DESC%22]",
    function (data) {
      for (let i = 0; i < 6 && i < data.results.length; i++) {
        const id = data.results[i].id;
        const color = data.results[i].color;
        const hsl = hexToCssHsl(color);
        const title = data.results[i].title.userPreferred;
        const description = data.results[i].description;
        const rating = data.results[i].rating;
        const duration = data.results[i].duration;
        const totalEpisodes = data.results[i].totalEpisodes;
        const type = data.results[i].type;
        const releaseDate = data.results[i].releaseDate;
        const status = data.results[i].status;
        const genres = data.results[i].genres;
        const poster = data.results[i].image;
        if (poster === "null") {
        } else if (poster === "") {
        } else if (description == "null") {
        } else {
          const item =
            '<div data-v-4d8937d6="" data-v-5ca09bd3="" class="media-card" style="--media-text:' +
            hsl +
            "; --media-background:" +
            hsl +
            "; --media-background-text:hsl(0deg 0% 100%); --media-overlay-text:" +
            hsl +
            ';"> <a data-v-4d8937d6="" onclick="showAnime(' +
            id +
            ')" href="javascript:void(0)" class="cover loading"> <img data-v-4d8937d6="" data-src="' +
            poster +
            '" class="image lazy"> </a> <a data-v-4d8937d6="" onclick="showAnime(' +
            id +
            ')" href="javascript:void(0)" class="title loading"> ' +
            title +
            ' </a> <div data-v-4d8937d6="" class="hover-data right"> <div data-v-4d8937d6="" class="header"> <div data-v-4d8937d6="" class="date airing"> ' +
            releaseDate +
            ' </div><div data-v-4d8937d6="" class="score"><i data-v-4d8937d6="" style="color:rgb(var(--color-green)); font-weight: 300;" class="icon fa fa-smile fa-w-16"></i> <span data-v-4d8937d6="" class="percentage">' +
            rating +
            '%</span></div></div><div data-v-4d8937d6="" class="studios">' +
            status +
            '</div><div data-v-4d8937d6="" class="info"><span data-v-4d8937d6="">' +
            type +
            '</span> <span data-v-4d8937d6="" class="separator">•</span> <span data-v-4d8937d6="">' +
            totalEpisodes +
            ' episodes</span></div><div data-v-4d8937d6="" class="genres"> <div data-v-4d8937d6="" class="genre">' +
            genres[0] +
            '</div><div data-v-4d8937d6="" class="genre">' +
            genres[1] +
            '</div><div data-v-4d8937d6="" class="genre">' +
            genres[2] +
            '</div><div data-v-4d8937d6="" class="genre">' +
            genres[3] +
            "</div></div></div></div>";

          $(".landing-section.trending .results").append(item);

          SkeletonLazy();
          new LazyLoad();
        }
      }
    }
  );
}

function movieInfo(id) {
  $.getJSON(api + "info/" + id, function (data) {
    $("#main").hide();
    $("#single").show();

    const id = data.id;
    const color = data.color;
    const hsl = hexToCssHsl(color);
    const title = data.title.english;
    const description = data.description;
    const rating = data.rating;
    const duration = data.duration;
    const totalEpisodes = data.totalEpisodes;
    const type = data.type;
    const releaseDate = data.releaseDate;
    const status = data.status;
    const genres = data.genres;
    const poster = data.image;
    const cover = data.cover;
    const season = data.season;
    const subOrDub = data.subOrDub;
    const popularity = data.popularity;

    $("#season").text(season);
    $("#popularity").text(popularity);
    $("#rating").text(rating + "%");
    $("#season").text(season);
    // $(".chiudi").append(
    // "<div class='fa fa-times close-icon' onclick='exit(" + l + ")'></div>"
    // ),
    $(".content h1").text(title),
      $(".description").html(description), // $(".movieyear").text(s.substring(0, 4)),
      // $(".movieruntime").text(i + " min"),
      //
      // $(".moviegenres").text(genre),
      $(".cover-wrap-inner img").attr("src", poster), // $(".mcover-image").removeClass("fadein").addClass("fadein"),
      // $(".source-link").attr("href", t),
      // $("#watch-trailer").attr("href", n),
      // $(".magnet-link").attr("href", t),
      $(".banner").css("background-image", "url(" + cover + ")"), // $(".backdrop").removeClass("fadein").addClass("fadein"),
      $(".movie-detail").hide().fadeIn(500);
  });
}

function showPopular() {
  $.getJSON(
    api + "advanced-search?page=1&perPage=25&season=FALL&year=2022",
    function (data) {
      for (let i = 0; i < 6 && i < data.results.length; i++) {
        const id = data.results[i].id;
        const color = data.results[i].color;
        const hsl = hexToCssHsl(color);
        const title = data.results[i].title.userPreferred;
        const description = data.results[i].description;
        const rating = data.results[i].rating;
        const duration = data.results[i].duration;
        const totalEpisodes = data.results[i].totalEpisodes;
        const type = data.results[i].type;
        const releaseDate = data.results[i].releaseDate;
        const status = data.results[i].status;
        const genres = data.results[i].genres;
        const poster = data.results[i].image;
        if (poster === "null") {
        } else if (poster === "") {
        } else if (description == "null") {
        } else {
          const item =
            '<div data-v-4d8937d6="" data-v-5ca09bd3="" class="media-card" style="--media-text:' +
            hsl +
            "; --media-background:" +
            hsl +
            "; --media-background-text:hsl(0deg 0% 100%); --media-overlay-text:" +
            hsl +
            ';"> <a data-v-4d8937d6="" onclick="showAnime(' +
            id +
            ')" href="javascript:void(0)" class="cover loading"> <img data-v-4d8937d6="" data-src="' +
            poster +
            '" class="image lazy"> </a> <a data-v-4d8937d6="" onclick="showAnime(' +
            id +
            ')" href="javascript:void(0)" class="title loading"> ' +
            title +
            ' </a> <div data-v-4d8937d6="" class="hover-data right"> <div data-v-4d8937d6="" class="header"> <div data-v-4d8937d6="" class="date airing"> ' +
            releaseDate +
            ' </div><div data-v-4d8937d6="" class="score"><i data-v-4d8937d6="" style="color:rgb(var(--color-green)); font-weight: 300;" class="icon fa fa-smile fa-w-16"></i> <span data-v-4d8937d6="" class="percentage">' +
            rating +
            '%</span></div></div><div data-v-4d8937d6="" class="studios">' +
            status +
            '</div><div data-v-4d8937d6="" class="info"><span data-v-4d8937d6="">' +
            type +
            '</span> <span data-v-4d8937d6="" class="separator">•</span> <span data-v-4d8937d6="">' +
            totalEpisodes +
            ' episodes</span></div><div data-v-4d8937d6="" class="genres"> <div data-v-4d8937d6="" class="genre">' +
            genres[0] +
            '</div><div data-v-4d8937d6="" class="genre">' +
            genres[1] +
            '</div><div data-v-4d8937d6="" class="genre">' +
            genres[2] +
            '</div><div data-v-4d8937d6="" class="genre">' +
            genres[3] +
            "</div></div></div></div>";

          $(".landing-section.season .results").append(item);
        }
      }
    }
  );
}

function showUpcoming() {
  $.getJSON(
    api + "advanced-search?page=1&perPage=6&season=WINTER&year=2023",
    function (data) {
      for (let i = 0; i < 6 && i < data.results.length; i++) {
        const id = data.results[i].id;
        const color = data.results[i].color;
        const hsl = hexToCssHsl(color);
        const title = data.results[i].title.userPreferred;
        const description = data.results[i].description;
        const rating = data.results[i].rating;
        const duration = data.results[i].duration;
        const totalEpisodes = data.results[i].totalEpisodes;
        const type = data.results[i].type;
        const releaseDate = data.results[i].releaseDate;
        const status = data.results[i].status;
        const genres = data.results[i].genres;
        const poster = data.results[i].image;
        if (poster === "null") {
        } else if (poster === "") {
        } else if (description == "null") {
        } else {
          const item =
            '<div data-v-4d8937d6="" data-v-5ca09bd3="" class="media-card" style="--media-text:' +
            hsl +
            "; --media-background:" +
            hsl +
            "; --media-background-text:hsl(0deg 0% 100%); --media-overlay-text:" +
            hsl +
            ';"> <a data-v-4d8937d6="" onclick="showAnime(' +
            id +
            ')" href="javascript:void(0)" class="cover loading"> <img data-v-4d8937d6="" data-src="' +
            poster +
            '" class="image lazy"> </a> <a data-v-4d8937d6="" onclick="showAnime(' +
            id +
            ')" href="javascript:void(0)" class="title loading"> ' +
            title +
            ' </a> <div data-v-4d8937d6="" class="hover-data right"> <div data-v-4d8937d6="" class="header"> <div data-v-4d8937d6="" class="date airing">WINTER ' +
            releaseDate +
            ' </div></div><div data-v-4d8937d6="" class="studios">Not yet aired</div><div data-v-4d8937d6="" class="info"><span data-v-4d8937d6="">' +
            type +
            '</span></div><div data-v-4d8937d6="" class="genres"> <div data-v-4d8937d6="" class="genre">' +
            genres[0] +
            '</div><div data-v-4d8937d6="" class="genre">' +
            genres[1] +
            '</div><div data-v-4d8937d6="" class="genre">' +
            genres[2] +
            '</div><div data-v-4d8937d6="" class="genre">' +
            genres[3] +
            "</div></div></div></div>";

          $(".landing-section.nextSeason .results").append(item);
        }
      }
    }
  );
}

function showAllTimePopular() {
  $.getJSON(api + "popular", function (data) {
    for (let i = 0; i < 6 && i < data.results.length; i++) {
      const id = data.results[i].id;
      const color = "#e34f85";
      const hsl = hexToCssHsl(color);
      const title = data.results[i].title.userPreferred;
      const description = data.results[i].description;
      const rating = data.results[i].rating;
      const duration = data.results[i].duration;
      const totalEpisodes = data.results[i].totalEpisodes;
      const type = data.results[i].type;
      const releaseDate = data.results[i].releaseDate;
      const status = data.results[i].status;
      const genres = data.results[i].genres;
      const poster = data.results[i].image;
      if (poster === "null") {
      } else if (poster === "") {
      } else if (description == "null") {
      } else {
        const item =
          '<div data-v-4d8937d6="" data-v-5ca09bd3="" class="media-card" style="--media-text:' +
          hsl +
          "; --media-background:" +
          hsl +
          "; --media-background-text:hsl(0deg 0% 100%); --media-overlay-text:" +
          hsl +
          ';"> <a data-v-4d8937d6="" onclick="showAnime(' +
          id +
          ')" href="javascript:void(0)" class="cover loading"> <img data-v-4d8937d6="" data-src="' +
          poster +
          '" class="image lazy"> </a> <a data-v-4d8937d6="" onclick="showAnime(' +
          id +
          ')" href="javascript:void(0)" class="title loading"> ' +
          title +
          ' </a> <div data-v-4d8937d6="" class="hover-data right"> <div data-v-4d8937d6="" class="header"> <div data-v-4d8937d6="" class="date airing"> ' +
          releaseDate +
          ' </div><div data-v-4d8937d6="" class="score"><i data-v-4d8937d6="" style="color:rgb(var(--color-green)); font-weight: 300;" class="icon fa fa-smile fa-w-16"></i> <span data-v-4d8937d6="" class="percentage">' +
          rating +
          '%</span></div></div><div data-v-4d8937d6="" class="studios">' +
          status +
          '</div><div data-v-4d8937d6="" class="info"><span data-v-4d8937d6="">' +
          type +
          '</span> <span data-v-4d8937d6="" class="separator">•</span> <span data-v-4d8937d6="">' +
          totalEpisodes +
          ' episodes</span></div><div data-v-4d8937d6="" class="genres"> <div data-v-4d8937d6="" class="genre">' +
          genres[0] +
          '</div><div data-v-4d8937d6="" class="genre">' +
          genres[1] +
          '</div><div data-v-4d8937d6="" class="genre">' +
          genres[2] +
          '</div><div data-v-4d8937d6="" class="genre">' +
          genres[3] +
          "</div></div></div></div>";

        $(".landing-section.popular .results").append(item);
      }
    }
  });
}

function showTop() {
  $.getJSON(
    api +
      "advanced-search?page=1&perPage=10&sort=[%22SCORE_DESC%22]&status=FINISHED",
    function (data) {
      for (let i = 0; i < 10 && i < data.results.length; i++) {
        const id = data.results[i].id;
        const color = data.results[i].color;
        const hsl = hexToCssHsl(color);
        const title = data.results[i].title.userPreferred;
        const description = data.results[i].description;
        const rating = data.results[i].rating;
        const duration = data.results[i].duration;
        const totalEpisodes = data.results[i].totalEpisodes;
        const type = data.results[i].type;
        const releaseDate = data.results[i].releaseDate;
        const status = data.results[i].status;
        const genres = data.results[i].genres;
        const poster = data.results[i].image;
        const number = i + 1;

        if (poster === "null") {
        } else if (poster === "") {
        } else if (description == "null") {
        } else {
          const item =
            '<div data-v-70df6e62="" data-v-5ca09bd3="" class="media-card has-rank" style="--media-text:' +
            hsl +
            "; --media-background:" +
            hsl +
            "; --media-background-text:hsl(0deg 0% 100%); --media-overlay-text:" +
            hsl +
            ';"> <div data-v-70df6e62="" class="rank circle"><span data-v-70df6e62="" class="hash">#</span>' +
            number +
            '</div><a data-v-70df6e62="" onclick="showAnime(' +
            id +
            ')" href="javascript:void(0)" class="cover loading"> <img data-v-70df6e62="" data-src="' +
            poster +
            '" class="image lazy"> </a> <div data-v-70df6e62="" class="content loading"> <div data-v-70df6e62="" class="row title"> <div data-v-70df6e62="" class="title-wrap"><a data-v-70df6e62="" onclick="showAnime(' +
            id +
            ')" href="javascript:void(0)" class="title-link ellipsis"> ' +
            title +
            ' </a></div><div data-v-70df6e62="" class="genres"> <a data-v-70df6e62="" href="#" class="genre">' +
            genres[0] +
            '</a><a data-v-70df6e62="" href="#" class="genre">' +
            genres[1] +
            '</a><a data-v-70df6e62="" href="#" class="genre">' +
            genres[2] +
            '</a><a data-v-70df6e62="" href="#" class="genre">' +
            genres[3] +
            '</a> </div></div><div data-v-70df6e62="" class="row score"><i data-v-70df6e62="" style="color:rgb(var(--color-green)); font-weight: 300;" class="icon fa fa-smile fa-w-16 fa-fw"></i> <div data-v-70df6e62="" class="percentage"> ' +
            rating +
            '% <div data-v-70df6e62="" class="sub-row popularity"> ' +
            rating +
            '604 users </div></div></div><div data-v-70df6e62="" class="row format"> ' +
            type +
            ' <div data-v-70df6e62="" class="sub-row length"> ' +
            totalEpisodes +
            ' ep </div></div><div data-v-70df6e62="" class="row date"> ' +
            releaseDate +
            ' <div data-v-70df6e62="" class="sub-row status"> ' +
            status +
            " </div></div></div></div>";

          $(".landing-section.top .results.table").append(item);
        }
      }
    }
  );
}

$(".open-btn").click(function () {
  $(this).toggleClass("active");
});

$(".genres.select-wrap").click(function () {
  $(this).toggleClass("dropdown-visible");
  $(".genres.options").toggleClass("active");
});
$(".year.select-wrap").click(function () {
  $(this).toggleClass("dropdown-visible");
  $(".year.options").toggleClass("active");
});
$(".season.select-wrap").click(function () {
  $(this).toggleClass("dropdown-visible");
  $(".season.options").toggleClass("active");
});
$(".format.select-wrap").click(function () {
  $(this).toggleClass("dropdown-visible");
  $(".format.options").toggleClass("active");
});

const scrollGenres = document.querySelector(".scroll-wrap.genres");
const ps1 = new PerfectScrollbar(scrollGenres, {
  wheelPropagation: true
});

const scrollYears = document.querySelector(".scroll-wrap.year");
const ps2 = new PerfectScrollbar(scrollYears, {
  wheelPropagation: true
});
const scrollFormat = document.querySelector(".scroll-wrap.format");
const ps3 = new PerfectScrollbar(scrollFormat, {
  wheelPropagation: true
});

const query = `
query {
  genres: GenreCollection
  tags: MediaTagCollection {
    name
    description
    category
    isAdult
  }
}
`;

const variables = {};

const url = "https://graphql.anilist.co";
const options = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  },
  body: JSON.stringify({
    query: query,
    variables: variables
  })
};

fetch(url, options).then(handleResponse).then(handleData).catch(handleError);

function handleResponse(response) {
  return response.json().then(function (json) {
    return response.ok ? json : Promise.reject(json);
  });
}

function handleData(data) {
  for (let i = 0; i < data.data.genres.length; i++) {
    const genre = data.data.genres[i];
    // console.log(genre);
    const genres =
      '<div data-v-e3e1e202="" class="option"><div data-v-e3e1e202="" class="label"><div data-v-e3e1e202="" class="name">' +
      genre +
      "</div></div></div>";
    $(".option-group.genres").append(genres);
  }
}

function handleError(error) {
  alert("Error, check console");
  console.error(error);
}

function AnimeYears() {
  const max = 2023;
  const min = max - 49;
  const years = [];

  for (let i = max; i >= min; i--) {
    const year =
      '<div data-v-e3e1e202="" class="option"><div data-v-e3e1e202="" class="label"><div data-v-e3e1e202="" class="name">' +
      i +
      "</div></div></div>";
    year.replace(",", "");
    years.push(year);
  }
  return years;
}

const years = AnimeYears();

$(".option-group.years").append(years);

function AnimeSeasons() {
  const arr = ["Winter", "Spring", "Fall", "Summer", "Fall"];
  for (let i = 0; i < arr.length; i++) {
    const season = arr[i];

    const seasons =
      '<div data-v-e3e1e202="" class="option"><div data-v-e3e1e202="" class="label"><div data-v-e3e1e202="" class="name">' +
      season +
      "</div></div></div>";
    $(".option-group.seasons").append(seasons);
  }
}

function AnimeFormat() {
  const data = [
    "TV Show",
    "Movie",
    "TV Short",
    "Special",
    "OVA",
    "ONA",
    "Music"
  ];
  for (let i = 0; i < data.length; i++) {
    const format = data[i];

    const formats =
      '<div data-v-e3e1e202="" class="option"><div data-v-e3e1e202="" class="label"><div data-v-e3e1e202="" class="name">' +
      format +
      "</div></div></div>";
    $(".option-group.formats").append(formats);
  }
}

function fadeNav() {
  document.addEventListener("wheel", (e) => {
    if (e.deltaY >= 0) {
      document.querySelector("#nav").classList.add("hide");
    } else {
      if (document.querySelector(".landing-section.trending") != null) {
        if (document.querySelector("html,body").scrollTop <= 200) {
          document.querySelector("#nav").classList.add("fade");
        } else {
          document.querySelector("#nav").classList.remove("fade");
        }
      } else {
        document.querySelector("#nav").classList.remove("fade");
      }
      document.querySelector("#nav").classList.remove("hide");
    }
  });
}

const nav =
  '<div data-v-17620a08="" data-v-62eacfff="" class="quick-search"> <div data-v-17620a08="" class="input"><i class="icon fa fa-search fa-w-16"></i> <input data-v-17620a08="" type="text" placeholder="Search AniList"> <i data-v-17620a08="" class="icon right fa fa-times fa-w-11 fa-sm"></i> <div data-v-17620a08="" class="hint">Hint: Want more advanced searching? Try the Browse page</div></div><div data-v-17620a08="" class="results"></div></div><div data-v-62eacfff="" class="wrap guest"><a data-v-62eacfff="" href="/" class="logo router-link-active"><img data-v-62eacfff="" src="https://i.imgur.com/HBhDIoR.png"></a> <div data-v-62eacfff="" class="links"><span data-v-62eacfff="" class="browse-wrap"><a data-v-62eacfff="" href="#" class="link router-link-exact-active router-link-active">search</a> <div data-v-38edf8f8="" data-v-62eacfff="" class="dropdown"> <div data-v-38edf8f8="" class="primary-links"> <div data-v-38edf8f8="" class="primary-link"><a data-v-38edf8f8="" href="#" class="router-link-exact-active router-link-active"><i data-v-38edf8f8="" class="icon fa fa-play fa-w-14"></i></a> <section data-v-38edf8f8=""><a data-v-38edf8f8="" href="#" class="primary-link-text router-link-exact-active router-link-active"> Anime </a> <div data-v-38edf8f8="" class="secondary-links"><a data-v-38edf8f8="" href="#">Top 100</a> <a data-v-38edf8f8="" href="#">Trending</a> <a data-v-38edf8f8="" href="#">Top Movies</a></div></section> </div><div data-v-38edf8f8="" class="primary-link"><a data-v-38edf8f8="" href="#"><i data-v-38edf8f8="" class="icon fa fa-book-open fa-w-18"></i></a> <section data-v-38edf8f8=""><a data-v-38edf8f8="" href="#" class="primary-link-text"> Manga </a> <div data-v-38edf8f8="" class="secondary-links"><a data-v-38edf8f8="" href="#">Top 100</a> <a data-v-38edf8f8="" href="#">Trending</a> <a data-v-38edf8f8="" href="#">Top Manhwa</a></div></section> </div></div><div data-v-38edf8f8="" class="footer"><a data-v-38edf8f8="" href="#"><i data-v-38edf8f8="" class="icon fa fa-user-tie fa-w-14"></i> Staff </a> <a data-v-38edf8f8="" href="#"><i data-v-38edf8f8="" class="icon fa fa-user-astronaut fa-w-14"></i> Characters </a> <a data-v-38edf8f8="" href="#"><i data-v-38edf8f8="" class="icon fa fa-star fa-w-18"></i> Reviews </a> <a data-v-38edf8f8="" href="#"><i data-v-38edf8f8="" class="icon fa fa-thumbs-up fa-w-16"></i> Recommendations </a></div></div></span> <a data-v-62eacfff="" href="#" class="link">social</a> <a data-v-62eacfff="" href="#" class="link">forum</a> <a data-v-62eacfff="" href="#" class="link login">Login</a> <a data-v-62eacfff="" href="#" class="link signup">Sign Up</a></div></div>';
$("#nav").append(nav);

const mobilenav =
  '<div data-v-8aeb5e9a="" class="hamburger"> <i data-v-8aeb5e9a="" class="fa fa-bars fa-w-14 fa-fw fa-2x"></i> </div><div data-v-8aeb5e9a="" class="menu"> <a data-v-8aeb5e9a="" href="#"><i data-v-8aeb5e9a="" class="fa fa-comments fa-w-18 fa-fw fa-lg"></i> <span data-v-8aeb5e9a="" class="label">forum</span></a> <a data-v-8aeb5e9a="" href="#"><i data-v-8aeb5e9a="" class="fa fa-users fa-w-20 fa-fw fa-lg"></i> <span data-v-8aeb5e9a="" class="label">social</span></a> <a data-v-8aeb5e9a="" href="#" class="router-link-exact-active router-link-active"> <i class="fa fa-search fa-w-16 fa-fw fa-lg"></i><span data-v-8aeb5e9a="" class="label">search</span></a> <a data-v-8aeb5e9a="" href="#"> <i data-v-8aeb5e9a="" class="fa fa-user-plus fa-w-20 fa-fw fa-lg"></i><span data-v-8aeb5e9a="" class="label">sign up</span></a> <a data-v-8aeb5e9a="" href="#"> <i data-v-8aeb5e9a="" class="fa fa-sign-in-alt fa-w-16 fa-fw fa-lg"></i><span data-v-8aeb5e9a="" class="label">login</span></a> <i data-v-8aeb5e9a="" class="fa fa-times fa-w-11 fa-fw fa-lg"></i> </div>';
$(".mobile-nav").append(mobilenav);

const footer =
  '<div data-v-0f519cab="" class="container"><div data-v-0f519cab="" class="theme-selector"><h2 data-v-0f519cab="">Site Theme</h2><div data-v-0f519cab="" class="el-tooltip theme-preview default" aria-describedby="el-tooltip-7071" tabindex="0">A</div><div data-v-0f519cab="" class="el-tooltip theme-preview dark" aria-describedby="el-tooltip-2200" tabindex="0">A</div><div data-v-0f519cab="" class="el-tooltip theme-preview contrast" aria-describedby="el-tooltip-7097" tabindex="0">A</div><div data-v-0f519cab="" class="el-tooltip theme-preview system" aria-describedby="el-tooltip-2830" tabindex="0">A</div></div><div data-v-0f519cab="" class="links"><section data-v-0f519cab=""><a data-v-0f519cab="" href="#">Donate</a><a data-v-0f519cab="" href="#">AniList.co</a><a data-v-0f519cab="" href="#">AniChart.net</a></section><section data-v-0f519cab=""><a data-v-0f519cab="" href="#">Apps</a><a data-v-0f519cab="" href="#">Site Stats</a><a data-v-0f519cab="" href="#">Recommendations</a><a data-v-0f519cab="" href="#">API</a></section><section data-v-0f519cab=""><a data-v-0f519cab="" href="#">Discord</a><a data-v-0f519cab="" href="#">Twitter</a><a data-v-0f519cab="" href="#">Facebook</a><a data-v-0f519cab="" href="#">GitHub</a></section><section data-v-0f519cab=""><a data-v-0f519cab="" href="#">Add Data</a><a data-v-0f519cab="" href="#">Moderators</a><a data-v-0f519cab="" href="#" target="_top">Contact</a><a data-v-0f519cab="" href="/terms">Terms &amp; Privacy</a><a data-v-0f519cab="" href="#">Site Map</a></section></div></div>';

$("#footer").append(footer);

$("a").click(function (event) {
  event.preventDefault();
});

function showAnime(id) {
  $.ajax({
    method: "POST",
    url: "https://graphql.anilist.co",
    contentType: "application/json",

    data: JSON.stringify({
      query: `query media($id: Int, $type: MediaType, $isAdult: Boolean) {
  Media(id: $id, type: $type, isAdult: $isAdult) {
    id
    title {
      userPreferred
      romaji
      english
      native
    }
    coverImage {
      extraLarge
      large
    }
    bannerImage
    startDate {
      year
      month
      day
    }
    endDate {
      year
      month
      day
    }
    description
    season
    seasonYear
    type
    format
    status(version: 2)
    episodes
    duration
    chapters
    volumes
    genres
    synonyms
    source(version: 3)
    isAdult
    isLocked
    meanScore
    averageScore
    popularity
    favourites
    isFavouriteBlocked
    hashtag
    countryOfOrigin
    isLicensed
    isFavourite
    isRecommendationBlocked
    isFavouriteBlocked
    isReviewBlocked
    nextAiringEpisode {
      airingAt
      timeUntilAiring
      episode
    }
    relations {
      edges {
        id
        relationType(version: 2)
        node {
          id
          title {
            userPreferred
          }
          format
          type
          status(version: 2)
          bannerImage
          coverImage {
            large
          }
        }
      }
    }
    characterPreview: characters(perPage: 6, sort: [ROLE, RELEVANCE, ID]) {
      edges {
        id
        role
        name
        voiceActors(language: JAPANESE, sort: [RELEVANCE, ID]) {
          id
          name {
            userPreferred
          }
          language: languageV2
          image {
            large
          }
        }
        node {
          id
          name {
            userPreferred
          }
          image {
            large
          }
        }
      }
    }
    staffPreview: staff(perPage: 8, sort: [RELEVANCE, ID]) {
      edges {
        id
        role
        node {
          id
          name {
            userPreferred
          }
          language: languageV2
          image {
            large
          }
        }
      }
    }
    studios {
      edges {
        isMain
        node {
          id
          name
        }
      }
    }
    reviewPreview: reviews(perPage: 2, sort: [RATING_DESC, ID]) {
      pageInfo {
        total
      }
      nodes {
        id
        summary
        rating
        ratingAmount
        user {
          id
          name
          avatar {
            large
          }
        }
      }
    }
    recommendations(perPage: 7, sort: [RATING_DESC, ID]) {
      pageInfo {
        total
      }
      nodes {
        id
        rating
        userRating
        mediaRecommendation {
          id
          title {
            userPreferred
          }
          format
          type
          status(version: 2)
          bannerImage
          coverImage {
            large
          }
        }
        user {
          id
          name
          avatar {
            large
          }
        }
      }
    }
    externalLinks {
      id
      site
      url
      type
      language
      color
      icon
      notes
      isDisabled
    }
    streamingEpisodes {
      site
      title
      thumbnail
      url
    }
    trailer {
      id
      site
    }
    rankings {
      id
      rank
      type
      format
      year
      season
      allTime
      context
    }
    tags {
      id
      name
      description
      rank
      isMediaSpoiler
      isGeneralSpoiler
      userId
    }
    mediaListEntry {
      id
      status
      score
    }
    stats {
      statusDistribution {
        status
        amount
      }
      scoreDistribution {
        score
        amount
      }
    }
  }
}`,
      variables: {
        id: id,
        type: "ANIME",
        isAdult: false
      }
    }),
    success: function (result) {
      setTimeout(function () {
        const id = result.data.Media.id;
        const title = result.data.Media.title.userPreferred;
        const english = result.data.Media.title.english;
        const native = result.data.Media.title.native;
        const romaji = result.data.Media.title.romaji;
        const synonyms = result.data.Media.synonyms[0];
        const description = result.data.Media.description;
        var rating = result.data.Media.averageScore;
        const duration = result.data.Media.duration;
        const episodes = result.data.Media.episodes;
        var format = result.data.Media.format;
        const year = result.data.Media.seasonYear;
        var status = result.data.Media.status;
        const source = result.data.Media.source;
        // var genres = data.genres;
        const poster = result.data.Media.coverImage.large;
        const cover = result.data.Media.bannerImage;
        const season = result.data.Media.season;
        const popularity = result.data.Media.popularity;
        const studio = result.data.Media.studios.edges[0].node.name;
        const hashtag = result.data.Media.hashtag;

        if (result.data.Media.trailer == null) {
          var trailer = null;
        } else {
          var trailer = result.data.Media.trailer.id;
          const embed =
            '<div data-v-cc58dc40="" data-v-cdf07c88="" class="trailer"><h2 data-v-cc58dc40="">Trailer</h2><div class="rwd-video"><iframe data-v-cc58dc40="" data-src="https://www.youtube-nocookie.com/embed/' +
            trailer +
            '" frameborder="0" allowfullscreen="allowfullscreen" id="trailer" class="video lazy"></iframe></div></div>';
          $("#embed").append(embed);
        }
        $(".content h1").text(title),
          $(".description").html(description),
          $("#rating").text(rating + "%");
        $("#duration").text(duration + " min");
        $("#episodes").text(episodes);
        $("#format").text(format);
        $("#year").text(year);
        $("#status").text(status);
        $("#source").text(source);
        $(".cover-wrap-inner img").attr("src", poster),
          $(".banner").css("background-image", "url(" + cover + ")"),
          $("#season").text(season);
        $("#popularity").text(popularity);
        $("#studio").text(studio);
        $("#hashtag").text(hashtag);
        $("#english").text(english);
        $("#native").text(native);
        $("#romaji").text(romaji);
        $("#synonyms").text(synonyms);

        for (let i = 0; i < result.data.Media.genres.length; i++) {
          const genre = result.data.Media.genres[i];
          const genres =
            '<span data-v-d3a518a6=""><a data-v-d3a518a6="" href="#">' +
            genre +
            '</a><br data-v-d3a518a6=""></span>';
          $("#sidegenres").append(genres);
        }

        for (let i = 0; i < result.data.Media.staffPreview.edges.length; i++) {
          var image = result.data.Media.staffPreview.edges[i].node.image.large;
          var name =
            result.data.Media.staffPreview.edges[i].node.name.userPreferred;
          var role = result.data.Media.staffPreview.edges[i].role;
          const staff =
            ' <div data-v-f92815d6="" class="role-card view-staff small"> <div data-v-f92815d6="" class="staff"><a data-v-f92815d6="" href="#" class="cover" style="background-image: url(' +
            image +
            ');"></a> <a data-v-f92815d6="" href="#" class="content"> <div data-v-f92815d6="" class="name"> ' +
            name +
            ' </div><div data-v-f92815d6="" class="role">' +
            role +
            "</div></a></div></div>";
          $("#staff").append(staff);
        }
        for (
          let i = 0;
          i < 6 && i < result.data.Media.characterPreview.edges.length;
          i++
        ) {
          var image =
            result.data.Media.characterPreview.edges[i].node.image.large;
          var name =
            result.data.Media.characterPreview.edges[i].node.name.userPreferred;
          var role = result.data.Media.characterPreview.edges[i].role;

          if (
            result.data.Media.characterPreview.edges[i].voiceActors.length > 0
          ) {
            var image_voice =
              result.data.Media.characterPreview.edges[i].voiceActors[0].image
                .large;
            var language_voice =
              result.data.Media.characterPreview.edges[i].voiceActors[0]
                .language;
            var name_voice =
              result.data.Media.characterPreview.edges[i].voiceActors[0].name
                .userPreferred;
          } else {
            var image_voice = "";
            var language_voice = "";
            var name_voice = "";
          }

          // var image_voice = result.data.Media.characterPreview.edges[i].voiceActors[0].image.large;
          // var language_voice = result.data.Media.characterPreview.edges[i].voiceActors[0].language;
          // var name_voice = result.data.Media.characterPreview.edges[i].voiceActors[0].name.userPreferred;

          const character =
            ' <div data-v-f92815d6="" class="role-card view-character-staff"> <div data-v-f92815d6="" class="character"><a data-v-f92815d6="" href="#" class="cover" style="background-image: url(' +
            image +
            ');"></a> <a data-v-f92815d6="" href="#" class="content"> <div data-v-f92815d6="" class="name"> ' +
            capitalizeFirstLetter(name.toLowerCase()) +
            ' </div><div data-v-f92815d6="" class="role"> ' +
            capitalizeFirstLetter(role.toLowerCase()) +
            ' </div></a></div><div data-v-f92815d6="" class="staff"><a data-v-f92815d6="" href="#" class="cover" style="background-image: url(' +
            image_voice +
            ');"></a> <a data-v-f92815d6="" href="#" class="content"> <div data-v-f92815d6="" class="name"> ' +
            name_voice +
            ' </div><div data-v-f92815d6="" class="role"> ' +
            language_voice +
            " </div></a></div></div>";
          $("#character").append(character);
        }

        for (
          let i = 0;
          i < 5 && i < result.data.Media.recommendations.nodes.length;
          i++
        ) {
          var image =
            result.data.Media.recommendations.nodes[i].mediaRecommendation
              .coverImage.large;
          var name =
            result.data.Media.recommendations.nodes[i].mediaRecommendation.title
              .userPreferred;
          var rating = result.data.Media.recommendations.nodes[i].rating;
          const recommendations =
            '<div data-v-38341878="" data-v-597da2e4="" class="recommendation-card"> <div data-v-38341878="" class="cover lazy" data-bg="' +
            image +
            '"><a data-v-38341878="" href="#" class="cover-link"></a> <div data-v-38341878="" class="rating-wrap"> <div data-v-38341878="" class="actions"> <div data-v-38341878="" class="icon thumbs-up"><i data-v-38341878="" class="fa fa-thumbs-up fa-w-16"></i></div><div data-v-38341878="" class="icon thumbs-down"><i data-v-38341878="" class="fa fa-thumbs-down fa-w-16"></i></div></div><div data-v-38341878="" class="rating"> +' +
            rating +
            ' </div></div></div><a data-v-38341878="" href="#" class=""> <div data-v-38341878="" class="title"> <div data-v-38341878="" style="overflow: hidden;"><span style="box-shadow: transparent 0px 0px;"><span aria-label="Aoashi"> ' +
            name +
            " </span></span></div></div></a></div>";
          $("#recommendations").append(recommendations);
        }
        for (let i = 0; i < result.data.Media.relations.edges.length; i++) {
          var image =
            result.data.Media.relations.edges[i].node.coverImage.large;
          var name =
            result.data.Media.relations.edges[0].node.title.userPreferred;
          var status = result.data.Media.relations.edges[i].node.status;
          var format = result.data.Media.relations.edges[0].node.format;
          const relations =
            '<div data-v-6dc78144="" data-v-4650c4e0="" class="media-preview-card"><a data-v-6dc78144="" href="#" class="cover lazy" data-bg="' +
            image +
            '" lazy="loading"> <div data-v-6dc78144="" class="image-text"> <div data-v-4650c4e0="">Source</div></div></a> <div data-v-6dc78144="" class="content"> <div data-v-6dc78144="" class="info-header"> <div data-v-4650c4e0="" data-v-6dc78144="">Source</div></div><a data-v-6dc78144="" href="#" class="title"> ' +
            name +
            ' </a> <div data-v-6dc78144="" class="info">' +
            capitalizeFirstLetter(format.toLowerCase()) +
            " · " +
            capitalizeFirstLetter(status.toLowerCase()) +
            "</div></div></div>";
          $("#relations").append(relations);
        }

        $("#app, #nav").addClass("transparent");
        $(".progress").addClass("fixed show");
        $(".signup").addClass("back");
        $(".signup").text("back");
        $("#main").hide();
        $("#single").show();

        $(".back").click(function () {
          $("#main").show();
          $("#single").hide();
          $("#app, #nav").removeClass("transparent");
          $(".signup").removeClass("back");
          $(".signup").text("Sign Up");
          $(".progress").addClass("fixed show");
        });

        ProgressBar();
        SkeletonLazy();
        $("html, body").animate(
          {
            scrollTop: 0
          },
          500
        );
      }, 500);
    },
    error: function (error) {
      $("#main").show();
      $("#single").hide();
    }
  });
}

$(".logo").click(function (event) {
  event.preventDefault();
  $("#main").show();
  $("#single").hide();
  $("#app, #nav").removeClass("transparent");
});
ProgressBar();
fadeNav();
AnimeSeasons();
AnimeFormat();
showTrending();
showPopular();
showUpcoming();
showAllTimePopular();
showTop();
SkeletonLazy();
new LazyLoad();
$("#single").hide();