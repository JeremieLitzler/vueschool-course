# JavaScript Testing Fundamentals

## Why is testing important

1. Confidence in your code: not that it is weak or bad.
2. Document the code for devs
3. Refactoring gets easy: if the refactor breaks something, you'll know
4. Make better developer: like the code, the test is simple and focused
5. Essential to work as a team: every successful open-source code is backed by tests

## What to test

First: _would it be bad if a piece of code is not tested ?_

Second, the question really becomes: _what actually makes sense to test?_

In this example, read the comments:

```javascript
// Permissions implementation does not matter
import { Permissions } from '@/lib/permissions'

// Check what should be tested
class User {

  // NO
  constructor(details, traits = {}) {
    const { firstname, lastname } = details
    this.firstname = firstname
    this.lastname = lastname
    this.traits = traits

    this.sessionStartedAt = Date.now()
  }

  // YES
  get name() {
    return `${this.firstname} ${this.lastname}`
  }

  // YES
  get isAdmin() {
    return Permissions.granted(this, 'admin')
  }

  // YES in combination with "extendSession"
  get currentSessionIsValid() {
    const tenMinutesInMiliseconds = 600000
    return (this.sessionStartedAt + tenMinutesInMiliseconds) <= Date.now()
  }

  extendSession() {
    this.sessionStartedAt = Date.now()
  }
}
```

The summary:

- test methods
- don't test dependencies
- don't test constructors, if it doesn't do anything for the business logic.

With the example, we see that 100% test coverage is hard. Getting to 80% is a good goal.

## Types of Testing

They are, in order of performance and cost:

- Unit Tests
- Integration Tests
- Acceptance Tests (often called end-to-end tests)

See the [testing pyramide](https://www.google.com/search?q=pyramid+of+testing).

## What are mocks and mocking

A mock is a clone of a dependency.

When mocking, we don't care the dependency work, we want to make sure it is called correctly.

But we want the mock to return data.

See [the example](https://github.com/vueschool/javascript-testing-fundamentals/commit/9bd9123e46a00ce5c5a7951f9e9e6e88d918d629).

## What are stubs

A stub is a replacement of a part of dependency.

See [the example](https://github.com/vueschool/javascript-testing-fundamentals/commit/12b607d3c084bd41fb98d883289986a42194a05f).

## What are spies

> See spies as watchers for functions and events.
>
> You can assert if they are called, how many times there were called, with which parameters they were called and what they return.
>
> Helpful for async actions like callbacks or events.

See [the example](https://github.com/vueschool/javascript-testing-fundamentals/commit/f2f49405a121d85cbfa049c123857f7d622bc184).
