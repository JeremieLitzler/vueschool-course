#

## What Is a Higher Order Function in JavaScript?

A higher order function in Javascript is a function that takes a function as one of its arguments or returns a function.

Higher order functions bring practical re-usability to your code base.

Compare:

```javascript
fourWheelsVehicules = vehicules.filter(
  (vehicule) => vehicule.wheels.length === 4
);
```

to:

```javascript
//This is a higher order function
const hasFourWheels = (vehicule) => {
  return vehicule.wheels.length === 4;
};

fourWheelsVehicules = vehicules.filter(hasFourWheels);
```

See [the video](https://vueschool.io/lessons/what-is-a-higher-order-function-in-javascript) explaining the concept with an example.
