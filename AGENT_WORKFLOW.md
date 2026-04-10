# AI Agent Workflow Log

## Agents Used
- OpenAI Codex (GPT-5.3-Codex) for end-to-end scaffolding, domain logic, and test generation.

## Prompts & Outputs
- Example 1 Prompt:
  - "Create a hexagonal backend structure for FuelEU with routes/compliance/banking/pooling use-cases and express endpoints."
  - Output used: use-case classes (`ComputeCb`, `CreatePool`) and HTTP wiring in `buildApp`.
- Example 2 Prompt:
  - "Refine pooling to enforce deficit/surplus exit constraints and sum >= 0."
  - Output used after correction: greedy transfer + post-validation checks.

## Validation / Corrections
- Verified generated formulas against assignment constants and corrected target intensity and energy factor.
- Corrected edge-case handling for bank apply validation (`amount <= available`).
- Added integration tests (`supertest`) to validate endpoint contracts.

## Observations
- Time saved on repetitive scaffolding (types, ports, repositories).
- Initial generated pooling logic needed adjustment to fully respect constraint checks.
- Combining generation + manual verification gave best reliability.

## Best Practices Followed
- Generated boilerplate first, then hardened business rules with tests.
- Kept AI-generated code inside architecture boundaries (core unaware of Express/React).
- Used incremental refinement prompts instead of one-shot generation.
