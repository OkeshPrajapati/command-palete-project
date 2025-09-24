const palette = document.getElementById("palette");
const search = document.getElementById("search");
const suggestions = document.getElementById("suggestions");
const clearBtn = document.getElementById("clearBtn");
let history = JSON.parse(localStorage.getItem("history")) || [];

// Show palette with Ctrl + K
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key.toLowerCase() === "k") {
    e.preventDefault();
    palette.classList.toggle("hidden");
    search.focus();
    showSuggestions();
  }
  if (e.key === "Escape") palette.classList.add("hidden");
});

// Close on click outside
document.addEventListener("click", (e) => {
  if (!palette.contains(e.target) && e.target !== search) {
    palette.classList.add("hidden");
  }
});

// Hide on backspace if empty
search.addEventListener("keydown", (e) => {
  if (e.key === "Backspace" && search.value === "") {
    palette.classList.add("hidden");
  }
});

// Run command
search.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    runCommand(search.value.trim());
  }
});

// Show suggestions
search.addEventListener("input", showSuggestions);

function showSuggestions() {
  suggestions.innerHTML = "";
  let input = search.value.toLowerCase();
  let filtered = history.filter((item) => item.toLowerCase().includes(input));

  // show/hide clear history button
  if (history.length > 0) {
    clearBtn.classList.remove("hidden");
  } else {
    clearBtn.classList.add("hidden");
  }

  filtered.forEach((item) => {
    let div = document.createElement("div");
    div.classList.add("suggestion");
    div.innerText = item;
    div.onclick = () => runCommand(item);
    suggestions.appendChild(div);
  });
}

function runCommand(cmd) {
  if (!cmd) return;
  history.unshift(cmd);
  history = [...new Set(history)];
  localStorage.setItem("history", JSON.stringify(history));

  if (cmd.startsWith("yt ")) {
    window.open(
      `https://www.youtube.com/results?search_query=${cmd.slice(3)}`,
      "_blank"
    );
  } else if (cmd.startsWith("gh ")) {
    window.open(`https://github.com/search?q=${cmd.slice(3)}`, "_blank");
  } else if (cmd.startsWith("tw ")) {
    window.open(`https://twitter.com/search?q=${cmd.slice(3)}`, "_blank");
  } else {
    window.open(`https://www.google.com/search?q=${cmd}`, "_blank");
  }

  search.value = "";
  palette.classList.add("hidden");
}

function clearHistory() {
  history = [];
  localStorage.removeItem("history");
  suggestions.innerHTML = "";
  clearBtn.classList.add("hidden");
  alert("Search history cleared ✅");
}

// Theme toggle
document.getElementById("toggleTheme").onclick = () => {
  document.body.classList.toggle("light");
};
