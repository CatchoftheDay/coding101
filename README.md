# Coding 101

This is a simple playground developed for the 2019 Coding 101 tutorial. It teaches several fundamental concepts of programming: 

* Instructions
* Conditionals
* Loops 
* Branching
* Variables 

A working version is currently hosted at <https://coding101.seatiger.org>. Note that students should be told about the "left-hand-rule", that is in a maze that has both the entrance and exit on the edge and no bridges, always following the wall on your left (or right!) side will eventually lead you to the exit. A complete program can be found in the `mazeRunner` constant defined in `src/services/script/constants.ts`.

## Stages

The program is divided into 3 separate stages, with more advanced stages requiring a "password" being typed in to the screen to access.

### Stage 1

The user solves a small maze using instructions only - no conditionals or loops.

### Stage 2 (password: "catch")

The user solves a larger maze by building a general solver using a while loop and if statement.

### Stage 3 (password: "coding101")

The user learns about variables - there is a locked door that can only be opened if the key has been picked up, but the program must also remember whether it has the key or not.
