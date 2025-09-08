 
        const palette = document.getElementById("palette");
        const search = document.getElementById("search");
        const suggestionList = document.getElementById("suggestion-list");
        const clearBtn = document.getElementById("clear-history");

        let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
        let selectedIndex = -1;

        // Toggle Palette with Ctrl+K
        document.addEventListener("keydown", (e) => {
            if (e.ctrlKey && e.key.toLowerCase() === "k") {
                e.preventDefault();
                palette.classList.toggle("hidden");
                search.focus();
                search.value = "";
                renderSuggestions("");
            }
        });

        // Render suggestions with delete button
        function renderSuggestions(query) {
            suggestionList.innerHTML = "";
            const matches = history.filter(item => item.toLowerCase().includes(query.toLowerCase()));

            matches.forEach((cmd, index) => {
                const li = document.createElement("li");
                if (index === selectedIndex) li.classList.add("active");

                const textSpan = document.createElement("span");
                textSpan.textContent = cmd;

                const delBtn = document.createElement("button");
                delBtn.innerHTML = "❌";
                delBtn.addEventListener("click", (e) => {
                    e.stopPropagation(); // prevent runCommand
                    deleteHistory(cmd);
                });

                li.appendChild(textSpan);
                li.appendChild(delBtn);

                li.addEventListener("click", () => runCommand(cmd));
                suggestionList.appendChild(li);
            });

            clearBtn.classList.toggle("hidden", history.length === 0);
        }

        // Delete single history item
        function deleteHistory(cmd) {
            history = history.filter(item => item !== cmd);
            localStorage.setItem("searchHistory", JSON.stringify(history));
            renderSuggestions(search.value);
        }

        // Handle input
        search.addEventListener("input", () => {
            selectedIndex = -1;
            renderSuggestions(search.value);
        });

        // Handle keyboard navigation
        search.addEventListener("keydown", (e) => {
            const items = suggestionList.querySelectorAll("li");

            if (e.key === "ArrowDown") {
                e.preventDefault();
                if (selectedIndex < items.length - 1) selectedIndex++;
                renderSuggestions(search.value);
            }

            if (e.key === "ArrowUp") {
                e.preventDefault();
                if (selectedIndex > 0) selectedIndex--;
                renderSuggestions(search.value);
            }

            if (e.key === "Enter") {
                e.preventDefault();
                if (selectedIndex >= 0 && items[selectedIndex]) {
                    runCommand(items[selectedIndex].querySelector("span").textContent);
                } else {
                    runCommand(search.value.trim());
                }
            }

            if (e.key === "Backspace" && search.value === "") {
                palette.classList.add("hidden");
            }
        });

        // Run command & save to history
        function runCommand(cmd) {
            if (!cmd) return;

            if (!history.includes(cmd)) {
                history.unshift(cmd);
                if (history.length > 10) history.pop();
                localStorage.setItem("searchHistory", JSON.stringify(history));
            }

            if (cmd.startsWith("google")) {
                window.open("https://www.google.com/search?q=" + encodeURIComponent(cmd.replace("google", "").trim()), "_blank");
            } else if (cmd.startsWith("youtube")) {
                window.open("https://www.youtube.com/results?search_query=" + encodeURIComponent(cmd.replace("youtube", "").trim()), "_blank");
            } else {
                window.open("https://www.google.com/search?q=" + encodeURIComponent(cmd), "_blank");
            }

            palette.classList.add("hidden");
        }

        // Clear all history
        clearBtn.addEventListener("click", () => {
            history = [];
            localStorage.removeItem("searchHistory");
            renderSuggestions("");
            alert("Search history cleared!");
        });

        // Close palette on outside click
        document.addEventListener("click", (e) => {
            if (!palette.contains(e.target) && !palette.classList.contains("hidden")) {
                palette.classList.add("hidden");
            }
        });

        renderSuggestions("");
  