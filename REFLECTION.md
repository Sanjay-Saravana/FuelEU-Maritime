# Reflection
Using AI agents significantly accelerated setup and boilerplate generation for both backend and frontend. The biggest gain was in quickly shaping hexagonal layers (ports, adapters, use-cases) and producing an initial test suite. Compared with manual coding, I was able to iterate faster on architecture and spend more time validating domain behavior.

The tradeoff is that generated code still needed careful review. For example, pooling and banking rules are easy to get subtly wrong; I had to inspect and tighten constraints and add explicit edge-case tests. This reinforced that AI is best used as a collaborator for drafts, not as an unquestioned source of correctness.

Next time, I would improve by adding stronger frontend component tests (with React Testing Library), introducing real PostgreSQL adapters with migration tooling, and automating contract tests between frontend and backend APIs. I would also log prompt iterations more granularly (per commit) to make AI usage traceability even clearer.
