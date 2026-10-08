# SPEC.md

## The application

This is a simple timer app for use with board games. It is intended to be used on a mobile device or tablet placed on
the table between players to track whose turn it is and how much time they have left.

The colour segments are used to represent whose turn it is - i.e. which player is "active".

There should be a wakelock so the screen doesn't dim while the players are playing.

## Code Style

This is a Deno project and doesn't use dependencies outside of @std.

If a function takes an object as an argument, it must be specified as a named type, rather than defined anonymously.

Prefer types over interfaces.

Use the formatter.

Don't stringly-type things.

## Testing

Use In-Source testing to avoid cluttering each file's public API. Define tests at the bottom of the file.

## Documentation

Don't. We're going to make readable code instead.
