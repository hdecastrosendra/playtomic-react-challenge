# Task 02 - Product feature request: download all matches

> [!NOTE]
> This section specification is **fuzzy** on purpose! While we would love for all the work we do to be accurately described; that is not the case sometimes. Here we aim at evaluating your skills as a product engineer: understanding _vague_ requirements and coming up with solutions in the spot.

Some of the clubs using Playtomic want to do some deep-dive analysis into the matches that are being played at their facilities.

While they would love for us to implement it; they told us it would suffice for them if they were able to download **all** their matches into a file they can later import into Excel or a similar tool.

We believe there is value in that and after some conversation we agreed on implementing a quick solution to validate if there is actual interest in this by our customers.

**Dos and Do not's**

- You **must** implement something that fullfil the club's needs
- You **must** implement a solution that is **client-only**; in other words: you **shouldn't** make changes in `@/lib/msw`
- You **can** add tests to any code you add; but it is not mandatory
- You **can** make it look beautiful; but it is not the focus of the task
- You **can** use any component in our [component library](https://mui.com/material-ui/getting-started/)
- You **should** use `@/lib/api` for your data-fetching needs
