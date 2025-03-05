# Task 01 - Technical work: filling the gaps in the auth flow

> [!NOTE]
> This section aims at measuring how good you are at understanding technical requirements and sticking to an existing contract between parties.

Oops! Looks like we forgot to implement the auth flow. That is bad news because it will prevent users from accessing our awesome application.

Thankfully we have a **contract** for its [public API](../src/lib/auth/index.ts). The documentation does mention something regarding _refreshing_ tokens; but for now we can ignore it and just focus on the **access token**.

## Dos and Do not's

- You **must** implement the internals of `AuthProvider` and `useAuth` according to the specification on their respective JSDoc
- You **can** create, change or remove any files inside `@/lib/auth`
- You **can** add tests to any code you add inside `@/lib/auth`; but it is not mandatory
- You **should** make sure the tests in the project pass after you are done with this task
- You **shouldn't** make changes to the `@/lib/auth` [public facing API](../src/lib/auth/index.ts)
- You **shouldn't** make changes outside of `@/lib/auth`
- You **shouldn't** implement the refresh flow yet; there is an [_optional_](./task-04.md) task later if you have the time
