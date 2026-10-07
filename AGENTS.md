# Project instructions

- Use Tailwind CSS utility classes for new or changed UI styling in this repository.
- When touching existing component styles, move the relevant rules from `src/styles.css` into Tailwind classes where practical.
- Keep existing CSS rules that are unrelated to the requested change until those parts are updated.
- Use the `ui-ux-pro-max` skill for UI/UX design, implementation, review, or fixes when the skill is available.

## Admin design reference

- Use [`docs/design/admin-dashboard-reference.png`](docs/design/admin-dashboard-reference.png) as the visual direction for admin pages. The lower, unobscured dashboard is the primary reference; the upper modal illustrates the same component style if a modal is needed later.
- Match its calm analytics layout: a slim white left sidebar, compact top utility bar, pale gray page background, four small summary cards, and a two-column area with a primary trend chart and supporting cards.
- Use compact typography, generous but controlled spacing, soft borders, rounded cards, and subtle shadows. Use only black, white, and neutral grays for admin navigation, charts, actions, and states; interpret the reference's blue accents in monochrome. Keep accessible contrast and responsive behavior.
- Adapt the content to Holywin registrations. Do not copy the reference product name, ecommerce metrics, placeholder widgets, or controls without working behavior.
- Keep the admin sidebar, registration table, and graph in separate reusable components under `src/components/admin/`.
