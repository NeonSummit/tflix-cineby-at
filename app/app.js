(function () {
  "use strict";

  var DB = "https://db.videasy.to/3";
  var IMAGE = "https://image.tmdb.org/t/p/";
  var state = {
    section: "trending",
    items: [],
    current: null,
    currentUrl: "",
    altUrl: "",
    lastCatalogFocus: null,
    detailSeasons: [],
    detailEpisodes: [],
    selectedSeason: 1
  };

  function $(id) {
    return document.getElementById(id);
  }

  function showError(message) {
    var debug = $("debug");
    debug.className = "debug";
    debug.textContent = String(message || "Unknown error");
    setStatus("Error. See red diagnostic box.");
  }

  window.onerror = function (message, source, line, column, error) {
    showError([message, source, line + ":" + column, error && error.stack].filter(Boolean).join("\n"));
  };

  window.onunhandledrejection = function (event) {
    showError(event && event.reason ? event.reason.stack || event.reason : "Unhandled promise rejection");
  };

  function setStatus(text) {
    $("status").textContent = text;
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function request(path, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", path.indexOf("http") === 0 ? path : DB + path, true);
    xhr.timeout = 18000;
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) {
        return;
      }
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          callback(null, JSON.parse(xhr.responseText));
        } catch (e) {
          callback(e);
        }
      } else {
        callback(new Error("HTTP " + xhr.status + " for " + path));
      }
    };
    xhr.ontimeout = function () {
      callback(new Error("Timeout for " + path));
    };
    xhr.onerror = function () {
      callback(new Error("Network error for " + path));
    };
    xhr.send();
  }

  function poster(path, size) {
    if (!path) {
      return "";
    }
    return IMAGE + (size || "w342") + path;
  }

  function normalize(item) {
    var media = item.media_type || (item.first_air_date || item.name ? "tv" : "movie");
    return {
      id: item.id,
      title: item.title || item.name || item.original_title || item.original_name || "Untitled",
      overview: item.overview || "",
      poster_path: item.poster_path,
      backdrop_path: item.backdrop_path,
      media_type: media,
      date: item.release_date || item.first_air_date || "",
      rating: item.vote_average || 0
    };
  }

  function year(value) {
    return value ? String(value).slice(0, 4) : "";
  }

  function renderHero(item) {
    var hero = $("hero");
    if (!item) {
      hero.innerHTML = '<div class="hero-content"><h2>TFlix Cineby AT</h2><p>Catalog is loading...</p></div>';
      return;
    }
    if (item.backdrop_path) {
      hero.style.backgroundImage = "url('" + poster(item.backdrop_path, "w1280") + "')";
    } else {
      hero.style.backgroundImage = "";
    }
    hero.innerHTML =
      '<div class="hero-content">' +
      "<h2>" + escapeHtml(item.title) + "</h2>" +
      "<p>" + escapeHtml(item.overview || "Select a title to open details and start playback.") + "</p>" +
      "</div>";
  }

  function renderGrid(items) {
    var grid = $("grid");
    var html = "";
    var i;
    state.items = items;
    for (i = 0; i < items.length; i += 1) {
      html +=
        '<button class="focusable card" data-action="details" data-index="' + i + '">' +
        '<img class="poster" src="' + escapeHtml(poster(items[i].poster_path, "w342")) + '" alt="">' +
        '<span class="card-title">' + escapeHtml(items[i].title) + "</span>" +
        '<span class="card-meta">' + escapeHtml(items[i].media_type.toUpperCase() + (year(items[i].date) ? " • " + year(items[i].date) : "")) + "</span>" +
        "</button>";
    }
    grid.innerHTML = html || '<p class="muted">Nothing found.</p>';
    renderHero(items[0]);
    focusFirstIn(grid);
  }

  function loadSection(section) {
    var title = section === "movies" ? "Popular Movies" : section === "tv" ? "Popular TV" : "Trending";
    var path = section === "movies" ? "/movie/popular" : section === "tv" ? "/tv/popular" : "/trending/all/week";
    state.section = section;
    $("section-title").textContent = title;
    setStatus("Loading " + title + "...");
    setActiveTab(section);
    showCatalog();
    request(path, function (err, data) {
      if (err) {
        showError(err);
        return;
      }
      setStatus("Ready");
      renderGrid((data.results || []).filter(function (item) {
        return item && item.poster_path && item.id && (item.media_type !== "person");
      }).map(normalize));
    });
  }

  function setActiveTab(section) {
    var tabs = document.querySelectorAll(".tab");
    var i;
    for (i = 0; i < tabs.length; i += 1) {
      if (tabs[i].getAttribute("data-section") === section) {
        tabs[i].className = "focusable tab is-active";
      } else {
        tabs[i].className = "focusable tab";
      }
    }
  }

  function showCatalog() {
    $("catalog").className = "catalog";
    $("detail").className = "detail hidden";
    $("player").className = "player hidden";
  }

  function showDetail() {
    $("catalog").className = "catalog hidden";
    $("detail").className = "detail";
    $("player").className = "player hidden";
  }

  function openDetails(index) {
    var item = state.items[index];
    if (!item) {
      return;
    }
    state.lastCatalogFocus = document.activeElement;
    setStatus("Loading details...");
    request("/" + item.media_type + "/" + item.id + "?append_to_response=external_ids,recommendations", function (err, data) {
      if (err) {
        showError(err);
        return;
      }
      state.current = normalize(data);
      state.current.imdb_id = data.external_ids && data.external_ids.imdb_id;
      state.current.number_of_seasons = data.number_of_seasons || 0;
      state.current.seasons = data.seasons || [];
      state.selectedSeason = 1;
      state.detailEpisodes = [];
      renderDetails(data);
      showDetail();
      setStatus("Details ready");
      focusFirstIn($("detail"));
    });
  }

  function renderDetails(data) {
    var media = state.current.media_type;
    var detail = $("detail");
    var seasonHtml = "";
    if (media === "tv") {
      seasonHtml = renderSeasonPicker(data.seasons || []);
    }
    detail.innerHTML =
      '<div class="detail-layout">' +
      '<img class="detail-poster" src="' + escapeHtml(poster(data.poster_path, "w500")) + '" alt="">' +
      "<div>" +
      "<h2>" + escapeHtml(state.current.title) + "</h2>" +
      '<div class="detail-meta">' + escapeHtml(media.toUpperCase() + (year(state.current.date) ? " • " + year(state.current.date) : "") + (data.vote_average ? " • " + Number(data.vote_average).toFixed(1) : "")) + "</div>" +
      '<p class="detail-overview">' + escapeHtml(data.overview || "No description available.") + "</p>" +
      '<div class="actions">' +
      '<button class="focusable button primary" data-action="play-current">Play</button>' +
      '<button class="focusable button" data-action="play-alt-current">Alt Player</button>' +
      '<button class="focusable button" data-action="back-catalog">Back</button>' +
      "</div>" +
      seasonHtml +
      "</div>" +
      "</div>";
    if (media === "tv") {
      loadSeason(state.current.id, state.selectedSeason);
    }
  }

  function renderSeasonPicker(seasons) {
    var html = '<div class="season-select"><h2>Episodes</h2><div class="actions">';
    var added = 0;
    var i;
    state.detailSeasons = [];
    for (i = 0; i < seasons.length; i += 1) {
      if (seasons[i].season_number > 0) {
        state.detailSeasons.push(seasons[i]);
        if (added < 8) {
          html += '<button class="focusable button" data-action="season" data-season="' + seasons[i].season_number + '">S' + seasons[i].season_number + "</button>";
        }
        added += 1;
      }
    }
    html += '</div><div id="episodes" class="episode-grid"><p class="muted">Loading episodes...</p></div></div>';
    return html;
  }

  function loadSeason(tvId, seasonNumber) {
    state.selectedSeason = seasonNumber;
    request("/tv/" + tvId + "/season/" + seasonNumber, function (err, data) {
      var box = $("episodes");
      var html = "";
      var episodes;
      var i;
      if (!box) {
        return;
      }
      if (err) {
        box.innerHTML = '<p class="muted">Could not load episodes.</p>';
        return;
      }
      episodes = data.episodes || [];
      state.detailEpisodes = episodes;
      for (i = 0; i < episodes.length; i += 1) {
        html += '<button class="focusable episode-button" data-action="play-episode" data-episode="' + episodes[i].episode_number + '">E' + episodes[i].episode_number + "</button>";
      }
      box.innerHTML = html || '<p class="muted">No episodes found.</p>';
    });
  }

  function buildPlayerUrls(item, episode) {
    var id = item.id;
    var imdb = item.imdb_id || id;
    if (item.media_type === "tv") {
      return {
        primary: "https://player.videasy.to/tv/" + id + "/" + state.selectedSeason + "/" + (episode || 1),
        alt: "https://vidsrc.to/embed/tv/" + id + "/" + state.selectedSeason + "/" + (episode || 1)
      };
    }
    return {
      primary: "https://player.videasy.to/movie/" + id,
      alt: "https://vidsrc.to/embed/movie/" + imdb
    };
  }

  function openPlayer(useAlt, episode) {
    var urls;
    if (!state.current) {
      return;
    }
    urls = buildPlayerUrls(state.current, episode);
    state.currentUrl = urls.primary;
    state.altUrl = urls.alt;
    $("player-title").textContent = state.current.title;
    $("player-url").textContent = useAlt ? urls.alt : urls.primary;
    $("player-frame").src = useAlt ? urls.alt : urls.primary;
    $("catalog").className = "catalog hidden";
    $("detail").className = "detail hidden";
    $("player").className = "player";
    setStatus("Player opened");
    focusFirstIn($("player"));
  }

  function runSearch() {
    var query = $("search-input").value.replace(/^\s+|\s+$/g, "");
    if (!query) {
      return;
    }
    closeSearch();
    $("section-title").textContent = "Search: " + query;
    setStatus("Searching...");
    showCatalog();
    request("/search/multi?query=" + encodeURIComponent(query), function (err, data) {
      if (err) {
        showError(err);
        return;
      }
      setStatus("Ready");
      renderGrid((data.results || []).filter(function (item) {
        return item && item.poster_path && item.id && (item.media_type === "movie" || item.media_type === "tv");
      }).map(normalize));
    });
  }

  function openSearch() {
    $("search-panel").className = "overlay";
    $("search-input").focus();
  }

  function closeSearch() {
    $("search-panel").className = "overlay hidden";
  }

  function focusFirstIn(root) {
    var first = root.querySelector(".focusable");
    if (first) {
      setTimeout(function () {
        first.focus();
      }, 0);
    }
  }

  function getFocusables() {
    var nodes = document.querySelectorAll(".focusable");
    var list = [];
    var i;
    for (i = 0; i < nodes.length; i += 1) {
      if (nodes[i].offsetParent !== null && !nodes[i].disabled) {
        list.push(nodes[i]);
      }
    }
    return list;
  }

  function moveFocus(direction) {
    var items = getFocusables();
    var active = document.activeElement;
    var currentRect = active && active.getBoundingClientRect ? active.getBoundingClientRect() : null;
    var best = null;
    var bestScore = 999999999;
    var i;
    var rect;
    var dx;
    var dy;
    var primary;
    var secondary;
    if (!currentRect || !items.length) {
      focusFirstIn(document);
      return;
    }
    for (i = 0; i < items.length; i += 1) {
      if (items[i] === active) {
        continue;
      }
      rect = items[i].getBoundingClientRect();
      dx = rect.left + rect.width / 2 - (currentRect.left + currentRect.width / 2);
      dy = rect.top + rect.height / 2 - (currentRect.top + currentRect.height / 2);
      if (direction === "left" && dx >= -8) { continue; }
      if (direction === "right" && dx <= 8) { continue; }
      if (direction === "up" && dy >= -8) { continue; }
      if (direction === "down" && dy <= 8) { continue; }
      primary = direction === "left" || direction === "right" ? Math.abs(dx) : Math.abs(dy);
      secondary = direction === "left" || direction === "right" ? Math.abs(dy) : Math.abs(dx);
      if (primary + secondary * 2 < bestScore) {
        bestScore = primary + secondary * 2;
        best = items[i];
      }
    }
    if (best) {
      best.focus();
      if (best.scrollIntoView) {
        best.scrollIntoView({ block: "nearest", inline: "nearest" });
      }
    }
  }

  function goBack() {
    if ($("search-panel").className.indexOf("hidden") === -1) {
      closeSearch();
      return;
    }
    if ($("player").className.indexOf("hidden") === -1) {
      $("player-frame").src = "about:blank";
      showDetail();
      focusFirstIn($("detail"));
      return;
    }
    if ($("detail").className.indexOf("hidden") === -1) {
      showCatalog();
      if (state.lastCatalogFocus) {
        state.lastCatalogFocus.focus();
      }
    }
  }

  function handleClick(target) {
    var action = target.getAttribute("data-action");
    var key = target.getAttribute("data-key");
    if (key != null) {
      $("search-input").value += key;
      $("search-input").focus();
      return;
    }
    if (action === "section") {
      loadSection(target.getAttribute("data-section"));
    } else if (action === "search") {
      openSearch();
    } else if (action === "details") {
      openDetails(Number(target.getAttribute("data-index")));
    } else if (action === "back-catalog") {
      goBack();
    } else if (action === "play-current") {
      openPlayer(false, 1);
    } else if (action === "play-alt-current") {
      openPlayer(true, 1);
    } else if (action === "play-episode") {
      openPlayer(false, Number(target.getAttribute("data-episode")));
    } else if (action === "season") {
      loadSeason(state.current.id, Number(target.getAttribute("data-season")));
    } else if (action === "close-player") {
      goBack();
    } else if (action === "open-alt-player") {
      $("player-frame").src = state.altUrl;
      $("player-url").textContent = state.altUrl;
    } else if (action === "run-search") {
      runSearch();
    } else if (action === "close-search") {
      closeSearch();
    } else if (action === "delete-char") {
      $("search-input").value = $("search-input").value.slice(0, -1);
      $("search-input").focus();
    }
  }

  document.addEventListener("click", function (event) {
    var node = event.target;
    while (node && node !== document) {
      if (node.getAttribute && (node.getAttribute("data-action") || node.getAttribute("data-key"))) {
        handleClick(node);
        return;
      }
      node = node.parentNode;
    }
  });

  document.addEventListener("keydown", function (event) {
    var code = event.keyCode || event.which;
    if (code === 37) { event.preventDefault(); moveFocus("left"); }
    else if (code === 38) { event.preventDefault(); moveFocus("up"); }
    else if (code === 39) { event.preventDefault(); moveFocus("right"); }
    else if (code === 40) { event.preventDefault(); moveFocus("down"); }
    else if (code === 13) { event.preventDefault(); if (document.activeElement) { document.activeElement.click(); } }
    else if (code === 8 || code === 10009 || code === 461) { event.preventDefault(); goBack(); }
  });

  try {
    if (window.tizen && tizen.tvinputdevice) {
      tizen.tvinputdevice.registerKey("Back");
      tizen.tvinputdevice.registerKey("MediaPlayPause");
      tizen.tvinputdevice.registerKey("MediaPlay");
      tizen.tvinputdevice.registerKey("MediaPause");
      tizen.tvinputdevice.registerKey("MediaStop");
    }
  } catch (e) {
    setStatus("Ready without Tizen key registration");
  }

  loadSection("trending");
}());
