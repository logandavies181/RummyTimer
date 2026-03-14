# AGENTS.md

## The stack

This app uses [htm](https://github.com/developit/htm) and [preact](https://github.com/preactjs/preact) alongside
`deno bundle` to have a React-like feel, while avoiding complicated build processes, but still getting some type safety.

A simple state-management and observer pattern is implemented in `src/state.ts`.

## The application

This is a simple timer app for use with board games. It is intended to be used on a mobile device or tablet placed on
the table between players to track whose turn it is and how much time they have left.

The colour segments are used to represent whose turn it is - i.e. which player is "active".

## Commands

Instead of `deno task` or `npm run`, we leverage `just` to orchestrate commands in a simple, language agnostic way.

- Type check: `just check`
- Build the project (includes the type check): `just build`
- Format: `just fmt`
- Serve locally: `just serve`

## Standards

- Components live in `src/components`.
- Components must be rendered with `html`, which is exported from `src/html.ts`.
- Interaction between components is brokered by the observer pattern from `src/state.ts`.
- Tailwind is used for styling.
- The code is formatted using prettier, by running the standard Format command.
- AGENTS must never run `just deploy`.
