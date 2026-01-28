# Documentation

This directory contains documentation for the reservations project.

## Files

### `spec.md`
A wrapper file that points to `/specs.md` at the repository root. The actual specifications are auto-synced from an external source. Do not manually edit `/specs.md` as it will be overwritten.

### `states.md`
Defines the state contracts for the application:
- Global UI states (loading, empty, error)
- Reservation core fields and statuses
- Payment status
- Deposit placeholder fields

### `flows.md`
Defines the user flows and action placeholders:
- List -> Detail flow
- Detail actions (Modify, Cancel, Refunds)

## Workflow

1. **Update specifications**: Run `npm run update-specs` to refresh `/specs.md` from the external source
2. **Review changes**: Check the updated `/specs.md` for any changes
3. **Update code**: Implement changes in the codebase based on the updated specifications
4. **Update documentation**: Update `states.md` and `flows.md` as needed to reflect the current state of the application

## Notes

- `/specs.md` is the source of truth for specifications and is auto-synced
- `states.md` and `flows.md` are manually maintained and should be updated as the application evolves
