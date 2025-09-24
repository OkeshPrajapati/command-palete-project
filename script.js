// const palette = document.getElementById("palette");
// const search = document.getElementById("search");
// const suggestions = document.getElementById("suggestions");
// const themeBtn = document.getElementById("themeBtn");
// let history = JSON.parse(localStorage.getItem("history")) || [];

// // Theme button click
// themeBtn.addEventListener("click", () => {
//   document.body.classList.toggle("light");
// });

// // Open/close palette with Ctrl+K
// document.addEventListener("keydown", function (e) {
//   if (e.ctrlKey && e.key === "k") {
//     e.preventDefault();
//     palette.classList.toggle("hidden");
//     search.focus();
//     search.value = "";
//     showSuggestions();
//   }

//   // Backspace -> close if input empty
//   if (
//     e.key === "Backspace" &&
//     document.activeElement === search &&
//     search.value === ""
//   ) {
//     palette.classList.add("hidden");
//   }

//   // Enter -> run command
//   if (e.key === "Enter" && !palette.classList.contains("hidden")) {
//     runCommand(search.value.trim());
//     search.value = "";
//     palette.classList.add("hidden");
//   }
// });

// // Hide palette if clicked outside
// document.addEventListener("click", (e) => {
//   if (!palette.contains(e.target) && !palette.classList.contains("hidden")) {
//     palette.classList.add("hidden");
//   }
// });

// // Suggestions display
// search.addEventListener("input", showSuggestions);

// function showSuggestions() {
//   suggestions.innerHTML = "";
//   let input = search.value.toLowerCase();
//   let filtered = history.filter((item) => item.toLowerCase().includes(input));
//   filtered.forEach((item) => {
//     let div = document.createElement("div");
//     div.classList.add("suggestion");
//     div.innerText = item;
//     div.onclick = () => {
//       runCommand(item);
//       palette.classList.add("hidden");
//     };
//     suggestions.appendChild(div);
//   });
// }

// // Run command
// function runCommand(cmd) {
//   if (!cmd) return;

//   // Save in history
//   if (!history.includes(cmd)) {
//     history.unshift(cmd);
//     if (history.length > 10) history.pop();
//     localStorage.setItem("history", JSON.stringify(history));
//   }

//   // Special command
//   if (cmd === "toggle theme") {
//     document.body.classList.toggle("light");
//     return;
//   }

//   // Shortcut commands
//   let [shortcut, ...rest] = cmd.split(" ");
//   let query = rest.join(" ");

//   if (shortcut === "yt") {
//     window.open(
//       `https://www.youtube.com/results?search_query=${encodeURIComponent(
//         query
//       )}`,
//       "_blank"
//     );
//   } else if (shortcut === "g" || shortcut === "google") {
//     window.open(
//       `https://www.google.com/search?q=${encodeURIComponent(query)}`,
//       "_blank"
//     );
//   } else if (shortcut === "gh" || shortcut === "github") {
//     window.open(
//       `https://github.com/search?q=${encodeURIComponent(query)}`,
//       "_blank"
//     );
//   } else if (shortcut === "tw" || shortcut === "twitter") {
//     window.open(
//       `https://twitter.com/search?q=${encodeURIComponent(query)}`,
//       "_blank"
//     );
//   } else {
//      window.open(
//        `https://www.google.com/search?q=${encodeURIComponent(cmd)}`,
//        "_blank"
//      );
//   }
// }


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
      let filtered = history.filter(item => item.toLowerCase().includes(input));

      // show/hide clear history button
      if (history.length > 0) {
        clearBtn.classList.remove("hidden");
      } else {
        clearBtn.classList.add("hidden");
      }

      filtered.forEach(item => {
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
        window.open(`https://www.youtube.com/results?search_query=${cmd.slice(3)}`, "_blank");
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
