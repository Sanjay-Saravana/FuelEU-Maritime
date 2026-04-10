# FuelEU Maritime Compliance Platform

## Overview
This repository contains a minimal full-stack FuelEU Maritime module split into `/frontend` and `/backend`.
It provides routes management, baseline comparison, compliance balance (CB), banking (Article 20), and pooling (Article 21).

## Architecture Summary (Hexagonal)
- `core/`: domain models, use-cases, and ports
- `adapters/`: UI + HTTP controllers (inbound), API + repositories (outbound)
- `infrastructure/`: runtime/server and SQL schema/seed scripts

## Setup & Run
```bash
npm install
npm --prefix backend install
npm --prefix frontend install
npm run dev
```
Backend starts on `http://localhost:4000` and frontend via Vite default `http://localhost:5173`.

## Tests
```bash
npm run test
```
Includes backend unit/integration tests and a lightweight frontend test.

## Sample Requests/Responses
- `GET /routes`
- `GET /routes/comparison`
- `GET /compliance/cb?shipId=S001&year=2024`
- `POST /banking/bank` body: `{ "shipId":"S005", "year":2025, "amount":5000 }`
- `POST /pools` body: `{ "year":2025, "members":[{"shipId":"S002","cbBefore":40000},{"shipId":"S001","cbBefore":-10000}] }`
