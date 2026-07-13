// ============================================
// CONFIG
// ============================================
const API_BASE_URL = "http://localhost:8080/polls";

// ============================================
// DOM ELEMENT REFERENCES
// ============================================
const createPollForm = document.getElementById("createPollForm");
const createPollMessage = document.getElementById("createPollMessage");
const pollsListDiv = document.getElementById("pollsList");
const refreshBtn = document.getElementById("refreshBtn");

// ============================================
// LOAD ALL POLLS ON PAGE START
// ============================================
document.addEventListener("DOMContentLoaded", loadAllPolls);
refreshBtn.addEventListener("click", loadAllPolls);

async function loadAllPolls() {
    pollsListDiv.innerHTML = "<p>Loading polls...</p>";

    try {
        const response = await fetch(API_BASE_URL); // GET /polls
        if (!response.ok) throw new Error("Failed to load polls");

        const polls = await response.json();
        renderPollsList(polls);

    } catch (error) {
        pollsListDiv.innerHTML = `<p class="message error">Error loading polls: ${error.message}. Is the backend running?</p>`;
    }
}

// Admin view: read-only list, just question + option count + total votes
function renderPollsList(polls) {
    if (polls.length === 0) {
        pollsListDiv.innerHTML = "<p>No polls yet. Create one above!</p>";
        return;
    }

    pollsListDiv.innerHTML = "";

    polls.forEach(poll => {
        const totalVotes = poll.options.reduce((sum, opt) => sum + opt.voteCount, 0);

        const pollDiv = document.createElement("div");
        pollDiv.className = "poll-item";

        pollDiv.innerHTML = `
            <div>
                <h3>${escapeHtml(poll.question)}</h3>
                <span>${poll.options.length} options · ${totalVotes} total vote(s)</span>
            </div>
        `;

        pollsListDiv.appendChild(pollDiv);
    });
}

// ============================================
// CREATE POLL
// ============================================
createPollForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const question = document.getElementById("question").value.trim();

    const optionInputs = document.querySelectorAll(".option-input");
    const options = Array.from(optionInputs)
        .map(input => input.value.trim())
        .filter(value => value !== "");

    if (question === "") {
        showMessage(createPollMessage, "Poll question cannot be empty.", "error");
        return;
    }
    if (options.length < 2) {
        showMessage(createPollMessage, "Please provide at least 2 options.", "error");
        return;
    }

    try {
        const response = await fetch(API_BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question, options })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to create poll");
        }

        showMessage(createPollMessage, "Poll created successfully!", "success");
        createPollForm.reset();
        loadAllPolls();

    } catch (error) {
        showMessage(createPollMessage, error.message, "error");
    }
});

// ============================================
// HELPER FUNCTIONS
// ============================================
function showMessage(element, text, type) {
    element.textContent = text;
    element.className = "message " + type;
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}
