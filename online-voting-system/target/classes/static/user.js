// ============================================
// CONFIG
// ============================================
const API_BASE_URL = "http://localhost:8080/polls";

// Keeps track of which poll is currently open in the modal
let currentPollId = null;

// Keeps track of the current chart instance so we can destroy/redraw it
let resultsChartInstance = null;

const CHART_COLORS = ["#2980b9", "#27ae60", "#e67e22", "#8e44ad"];

// ============================================
// DOM ELEMENT REFERENCES
// ============================================
const pollsListDiv = document.getElementById("pollsList");
const refreshBtn = document.getElementById("refreshBtn");

const modalOverlay = document.getElementById("modalOverlay");
const closeModalBtn = document.getElementById("closeModalBtn");
const modalQuestion = document.getElementById("modalQuestion");
const modalOptions = document.getElementById("modalOptions");
const voterEmailInput = document.getElementById("voterEmail");
const submitVoteBtn = document.getElementById("submitVoteBtn");
const voteMessage = document.getElementById("voteMessage");
const resultsList = document.getElementById("resultsList");
const viewResultsBtn = document.getElementById("viewResultsBtn");

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

// User view: Vote + Results buttons only, no create option anywhere
function renderPollsList(polls) {
    if (polls.length === 0) {
        pollsListDiv.innerHTML = "<p>No polls available right now. Check back later!</p>";
        return;
    }

    pollsListDiv.innerHTML = "";

    polls.forEach(poll => {
        const pollDiv = document.createElement("div");
        pollDiv.className = "poll-item";

        pollDiv.innerHTML = `
            <div>
                <h3>${escapeHtml(poll.question)}</h3>
                <span>${poll.options.length} options</span>
            </div>
            <div class="actions">
                <button onclick="openVoteModal('${poll.id}')">Vote</button>
                <button onclick="openResultsModal('${poll.id}')">Results</button>
            </div>
        `;

        pollsListDiv.appendChild(pollDiv);
    });
}

// ============================================
// VOTE MODAL
// ============================================
async function openVoteModal(pollId) {
    currentPollId = pollId;
    voteMessage.textContent = "";
    voterEmailInput.value = "";

    try {
        const response = await fetch(`${API_BASE_URL}/${pollId}`); // GET /polls/{id}
        const poll = await response.json();

        modalQuestion.textContent = poll.question;

        modalOptions.innerHTML = "";
        poll.options.forEach(option => {
            const label = document.createElement("label");
            label.className = "option-choice";
            label.innerHTML = `
                <input type="radio" name="voteOption" value="${escapeHtml(option.optionText)}">
                ${escapeHtml(option.optionText)}
            `;
            modalOptions.appendChild(label);
        });

        document.getElementById("voteFormSection").style.display = "block";
        resultsList.innerHTML = "";
        if (resultsChartInstance) {
            resultsChartInstance.destroy();
            resultsChartInstance = null;
        }

        modalOverlay.classList.remove("hidden");

    } catch (error) {
        alert("Error loading poll: " + error.message);
    }
}

submitVoteBtn.addEventListener("click", async function () {
    const voterEmail = voterEmailInput.value.trim();
    const selectedRadio = document.querySelector('input[name="voteOption"]:checked');

    if (voterEmail === "") {
        showMessage(voteMessage, "Please enter your email.", "error");
        return;
    }
    if (!selectedRadio) {
        showMessage(voteMessage, "Please select an option.", "error");
        return;
    }

    const selectedOption = selectedRadio.value;

    try {
        const response = await fetch(`${API_BASE_URL}/${currentPollId}/vote`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ voterEmail, selectedOption })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to submit vote");
        }

        showMessage(voteMessage, "Vote submitted successfully!", "success");
        renderResults(data.options);

    } catch (error) {
        showMessage(voteMessage, error.message, "error");
    }
});

// ============================================
// RESULTS MODAL
// ============================================
async function openResultsModal(pollId) {
    currentPollId = pollId;

    try {
        const response = await fetch(`${API_BASE_URL}/${pollId}`);
        const poll = await response.json();

        modalQuestion.textContent = poll.question;

        document.getElementById("voteFormSection").style.display = "none";

        renderResults(poll.options);
        modalOverlay.classList.remove("hidden");

    } catch (error) {
        alert("Error loading results: " + error.message);
    }
}

viewResultsBtn.addEventListener("click", async function () {
    try {
        const response = await fetch(`${API_BASE_URL}/${currentPollId}/results`);
        const poll = await response.json();
        renderResults(poll.options);
    } catch (error) {
        alert("Error refreshing results: " + error.message);
    }
});

// ============================================
// RESULTS RENDERING — PIE CHART + TEXT BREAKDOWN
// ============================================
function renderResults(options) {
    const totalVotes = options.reduce((sum, opt) => sum + opt.voteCount, 0);
    const labels = options.map(opt => opt.optionText);
    const data = options.map(opt => opt.voteCount);
    const colors = options.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]);

    // Destroy the previous chart instance before drawing a new one
    // (Chart.js requires this - otherwise charts stack on top of each other)
    if (resultsChartInstance) {
        resultsChartInstance.destroy();
    }

    const ctx = document.getElementById("resultsChart").getContext("2d");
    resultsChartInstance = new Chart(ctx, {
        type: "pie",
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderColor: "#ffffff",
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false // We build our own list below instead
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const value = context.parsed;
                            const pct = totalVotes === 0 ? 0 : Math.round((value / totalVotes) * 100);
                            return `${context.label}: ${value} vote(s) (${pct}%)`;
                        }
                    }
                }
            }
        }
    });

    // Text breakdown list under the chart
    resultsList.innerHTML = "";
    if (totalVotes === 0) {
        resultsList.innerHTML = `<p style="text-align:center; color:#888; margin-top:10px;">No votes yet.</p>`;
        return;
    }

    options.forEach((option, i) => {
        const pct = Math.round((option.voteCount / totalVotes) * 100);
        const row = document.createElement("div");
        row.className = "result-row";
        row.innerHTML = `
            <span class="result-name">
                <span class="swatch" style="background:${colors[i]}"></span>
                ${escapeHtml(option.optionText)}
            </span>
            <span class="result-stats">${option.voteCount} vote(s) &middot; ${pct}%</span>
        `;
        resultsList.appendChild(row);
    });
}

// ============================================
// MODAL CLOSE
// ============================================
closeModalBtn.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", function (event) {
    if (event.target === modalOverlay) closeModal();
});

function closeModal() {
    modalOverlay.classList.add("hidden");
    currentPollId = null;
}

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
