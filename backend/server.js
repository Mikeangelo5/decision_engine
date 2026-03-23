import express from "express";
import cors from "cors";

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const minAmount = 2000;
const maxAmount = 10000;
const minPeriod = 12;
const maxPeriod = 60;

const users = {
    "49002010965": { hasDebt: true, modifier: 0 },
    "49002010976": { hasDebt: false, modifier: 100 },
    "49002010987": { hasDebt: false, modifier: 300 },
    "49002010998": { hasDebt: false, modifier: 1000 }
};

app.post("/api/decision", (req, res) => {
    console.log(req.body)
    const { personalCode, loanAmount, loanPeriod } = req.body;

    if (!personalCode || loanAmount == null || loanPeriod == null) {
        return res.status(400).json({
            error: "personalCode, loanAmount and loanPeriod are required"
        });
    }

    const amount = +loanAmount;
    const period = +loanPeriod;

    if (isNaN(amount) || isNaN(period)) {
        return res.status(400).json({
            error: "loanAmount and loanPeriod must be valid numbers"
        });
    }

    const user = users[personalCode];

    if (!user) {
        return res.json({
            decision: "negative",
            amount: 0,
            period: null,
            message: "Unknown personal code"
        });
    }

    if (user.hasDebt) {
        return res.json({
            decision: "negative",
            amount: 0,
            period: null,
            message: "Applicant has debt"
        });
    }

    let finalAmount = amount;
    let finalPeriod = period;

    if (finalAmount < minAmount) finalAmount = minAmount;
    if (finalAmount > maxAmount) finalAmount = maxAmount;

    if (finalPeriod < minPeriod) finalPeriod = minPeriod;
    if (finalPeriod > maxPeriod) finalPeriod = maxPeriod;

    const modifier = user.modifier;
    const requestedScore = (modifier / finalAmount) * finalPeriod;

    let bestAmount = 0;
    let bestPeriod = null;

    const tryPeriod = (p) => {
        let possibleAmount = modifier * p;

        if (possibleAmount > maxAmount) {
            possibleAmount = maxAmount;
        }

        if (possibleAmount < minAmount) {
            return;
        }

        if (
            bestPeriod === null ||
            possibleAmount > bestAmount ||
            (possibleAmount === bestAmount && p < bestPeriod)
        ) {
            bestAmount = possibleAmount;
            bestPeriod = p;
        }
    };

    for (let p = minPeriod; p <= maxPeriod; p++) {
        tryPeriod(p);
    }

    if (bestPeriod === null) {
        return res.json({
            decision: "negative",
            amount: 0,
            period: null,
            message: "No suitable loan amount found",
            requestedAmount: finalAmount,
            requestedPeriod: finalPeriod,
            creditModifier: modifier
        });
    }

    return res.json({
        decision: "positive",
        amount: bestAmount,
        period: bestPeriod,
        message: "Offer found",
        requestedAmount: finalAmount,
        requestedPeriod: finalPeriod,
        creditModifier: modifier,
        requestedScore
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});