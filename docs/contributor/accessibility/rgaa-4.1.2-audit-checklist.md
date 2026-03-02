# Targeted Audit (RGAA 4.1.2 AA-inspired)

## Priority Flows

1. Login / signup / reset password
2. Machine reservation (modal + form)
3. Admin open badges (create, edit, assign)
4. Admin machines (list, edit)
5. Admin users (list, edit)

## Method

- RGAA 4.1.2-inspired checklist adapted to the product
- Keyboard-only tests
- Screen reader tests (`NVDA` / `VoiceOver`)
- Browser zoom tests at `200%`, `300%`, `400%`

## Cross-cutting Checklist (quick wins + audit)

### Keyboard Navigation & Focus

- [ ] Coherent tab order
- [ ] Visible focus on all interactive elements
- [ ] Menus (`RowQuickActionsMenu`, `Autocomplete`, `Select`) usable by keyboard
- [ ] `Esc` closes menus and dialogs
- [ ] No keyboard trap

### Modals & Dialogs

- [ ] `aria-labelledby` present
- [ ] `aria-describedby` present when descriptive content exists
- [ ] Relevant initial focus
- [ ] Working focus trap
- [ ] Focus returns to trigger on close

### Forms

- [ ] Every field has an explicit label
- [ ] Placeholder is not the only instruction
- [ ] Error fields are clearly announced
- [ ] Error messages are associated with fields
- [ ] Action buttons have explicit labels

### Images & Media

- [ ] Informative images have useful `alt`
- [ ] Decorative images use `alt=\"\"` and/or `aria-hidden`
- [ ] Form image previews are announced correctly

### Contrast & Perception

- [ ] Text contrast >= `4.5:1`
- [ ] Components / icons / buttons contrast checked
- [ ] Information is not conveyed by color only

### Responsive, Zoom, Reflow

- [ ] Usable at `200%`
- [ ] Usable at `400%`
- [ ] No content/function loss
- [ ] No unnecessary horizontal scrolling (unless justified)

### Dynamic States

- [ ] Success/error messages are readable and persist long enough
- [ ] State changes are announced when needed
- [ ] Auto-redirects do not prevent reading

## Per-page Audit Grid (duplicate as needed)

### Page / flow

- URL:
- User role:
- Browser:
- Screen reader:
- Zoom:

### Results

- Criterion:
- Observation:
- Status: `OK` / `KO` / `NA`
- Severity: `P0` / `P1` / `P2`
- Proposed fix:
