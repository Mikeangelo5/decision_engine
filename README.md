# Loan Decision Engine

A small full-stack application that determines whether a loan can be approved and, if so, returns the **maximum amount** that can be offered based on a simple credit scoring formula.

This project was built as a take-home assignment and focuses on clean logic, clarity, and a straightforward user experience.

---

## ✨ Features

- Single API endpoint for decision calculation
- Simple UI to test different inputs
- Instant feedback with approved amount and period
- Handles edge cases (invalid input, debt, limits)
- Uses a mathematical approach instead of brute force

---

## 🧠 How it works

The decision is based on the following formula:

```
credit score = (credit modifier / loan amount) * loan period
```

A loan is approved if:

```
credit score ≥ 1
```

This can be simplified to:

```
loan amount ≤ credit modifier × loan period
```

So for any given period, the system calculates the **maximum possible loan amount** and returns the best available offer.

---

## 🧾 Decision rules

- If the applicant has debt → ❌ always rejected
- Otherwise:
  - Find the maximum loan amount that satisfies the formula
  - Respect system limits:
    - Amount: 2000 – 10000 €
    - Period: 12 – 60 months
  - Choose the best possible combination of amount and period

---

## 🧪 Test data

| Code        | Description               |
| ----------- | ------------------------- |
| 49002010965 | Has debt (always reject)  |
| 49002010976 | Segment 1 (modifier 100)  |
| 49002010987 | Segment 2 (modifier 300)  |
| 49002010998 | Segment 3 (modifier 1000) |

---

## 🏗 Project structure

```
backend/
  server.js
  package.json

frontend/
  index.html
  style.css
  app.js
```

---

## 🚀 Getting started

### 1. Run backend

```
cd backend
npm install
npm start
```

Server runs on:

```
http://localhost:3001
```

---

### 2. Run frontend

Open:

```
frontend/index.html
```

Or:

```
npx serve frontend
```

---

## 🔌 API

### POST `/api/decision`

#### Request

```
{
  "personalCode": "49002010998",
  "loanAmount": 5000,
  "loanPeriod": 24
}
```

#### Response

```
{
  "decision": "positive",
  "amount": 10000,
  "period": 24,
  "message": "Offer found"
}
```

---

## 🧼 Improvements

- Add unit tests
- Separate business logic into its own module
- Improve validation (Zod / Joi)
- Hide internal fields from API response
- Add Docker support

---

## 💬 Final thoughts

The goal was to keep the solution simple, readable, and correct.

If anything is unclear, happy to explain the decisions or tradeoffs.
