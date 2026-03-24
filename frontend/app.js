const form = document.getElementById("loanForm");
const resultEl = document.getElementById("result");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const payload = {
        personalCode: document.getElementById("personalCode").value.trim(),
        loanAmount: Number(document.getElementById("loanAmount").value),
        loanPeriod: Number(document.getElementById("loanPeriod").value)
    };

    try {
        const response = await fetch("http://localhost:3001/api/decision", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Request failed");
        }

        const isPositive = data.decision === "positive";

        resultEl.className = `card ${isPositive ? "result-positive" : "result-negative"}`;

        resultEl.innerHTML = `
            <div class="result-inner">
                <div class="result-status">
                    <div class="status-dot"></div>
                    <span class="status-label">${isPositive ? "Approved" : "Declined"}</span>
                </div>

                <div class="result-amount">
                    ${isPositive ? Number(data.amount).toLocaleString() : "—"}
                    ${isPositive ? "<sup style='font-size:20px;color:var(--ink-muted)'>€</sup>" : ""}
                </div>
                <div class="result-amount-label">
                    ${isPositive ? "maximum approved amount" : data.message}
                </div>

                ${isPositive ? `
                <div class="result-meta">
                    <div class="meta-item">
                        <div class="meta-label">Period</div>
                        <div class="meta-value">${data.period} <span style="font-size:12px;font-weight:400;color:var(--ink-muted)">mo</span></div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-label">Requested</div>
                        <div class="meta-value">${Number(data.requestedAmount).toLocaleString()} <span style="font-size:12px;font-weight:400;color:var(--ink-muted)">€</span></div>
                    </div>
                </div>
                ` : ""}

                <div class="result-message">
                    Requested ${Number(payload.loanAmount).toLocaleString()} € over ${payload.loanPeriod} months
                </div>
            </div>
        `;

    } catch (error) {
        resultEl.className = "card result-negative";
        resultEl.innerHTML = `
            <div class="result-inner">
                <div class="result-status">
                    <div class="status-dot"></div>
                    <span class="status-label">Error</span>
                </div>
                <div class="result-amount-label">${error.message}</div>
            </div>
        `;
    }
});