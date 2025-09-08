
    const palette = document.getElementById("palette");
    const search = document.getElementById("search");
    const suggestions = document.getElementById("suggestions");
    const themeBtn = document.getElementById("themeBtn");
    let history = JSON.parse(localStorage.getItem("history")) || [];

    // Theme button click
    themeBtn.addEventListener("click", () => {
      document.body.classList.toggle("light");
    });

    // Open/close palette with Ctrl+K
    document.addEventListener("keydown", function (e) {
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        palette.classList.toggle("hidden");
        search.focus();
        search.value = "";
        showSuggestions();
      }

      // Backspace -> close if input empty
      if (e.key === "Backspace" && document.activeElement === search && search.value === "") {
        palette.classList.add("hidden");
      }

      // Enter -> run command
      if (e.key === "Enter" && !palette.classList.contains("hidden")) {
        runCommand(search.value.trim());
        search.value = "";
        palette.classList.add("hidden");
      }
    });

    // Hide palette if clicked outside
    document.addEventListener("click", (e) => {
      if (!palette.contains(e.target) && !palette.classList.contains("hidden")) {
        palette.classList.add("hidden");
      }
    });

    // Suggestions display
    search.addEventListener("input", showSuggestions);

    function showSuggestions() {
      suggestions.innerHTML = "";
      let input = search.value.toLowerCase();
      let filtered = history.filter(item => item.toLowerCase().includes(input));
      filtered.forEach(item => {
        let div = document.createElement("div");
        div.classList.add("suggestion");
        div.innerText = item;
        div.onclick = () => {
          runCommand(item);
          palette.classList.add("hidden");
        };
        suggestions.appendChild(div);
      });
    }

    // Run command
    function runCommand(cmd) {
      if (!cmd) return;

      // Save in history
      if (!history.includes(cmd)) {
        history.unshift(cmd);
        if (history.length > 10) history.pop();
        localStorage.setItem("history", JSON.stringify(history));
      }

      // Special command
      if (cmd === "toggle theme") {
        document.body.classList.toggle("light");
        return;
      }

      // Shortcut commands
      let [shortcut, ...rest] = cmd.split(" ");
      let query = rest.join(" ");

      if (shortcut === "yt") {
        window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`, "_blank");
      } else if (shortcut === "g" || shortcut === "google") {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, "_blank");
      } else if (shortcut === "gh" || shortcut === "github") {
        window.open(`https://github.com/search?q=${encodeURIComponent(query)}`, "_blank");
      } else if (shortcut === "tw" || shortcut === "twitter") {
        window.open(`https://twitter.com/search?q=${encodeURIComponent(query)}`, "_blank");
      } else {
        alert("Unknown command: " + cmd);
      }
    }
 