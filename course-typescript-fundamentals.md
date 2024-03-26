# TypeScript Fundamentals

## What is TypeScript

Typescript is a super set of Javascript that provides static typing. With static typing we include a number of benefits including:

- Tighter integration with IDE
- Better Refactoring with Errors at Compile Time
- And Self Documented Code that's Easier to Understand by other people or even yourself in 6-months time.

Finally, TypeScript compiles into JavaScript, so you can run your TypeScript anywhere you'd run your JavaScript code.

See the [TypeScript playground](https://www.typescriptlang.org/play) to learn and test.

## Usage of JavaScript that cause problems

In JavaScript, you can do things that can cause real trouble and silently pull your hairs out.

For example:

- a variable can change type

```javascript
let price = 24;
console.log(typeof price); //outputs 'number'
price = "24";
console.log(typeof price); //outputs 'string'
```

- an object can be assigned any number of properties on the fly:

```javascript
const lion = {
  legs: 4,
  teeth: 50,
};

lion.runs = true;

delete lion.teeth;
```

While this has been used to achieve functionnality, it makes the code more opaque.

In TypeScript, you can be sure that:

- variable types don't change
- objects retains properties.

## Implicit and Explicit Types in TypeScript

### What is Implicit Typing

Let's the previous example:

```typescript
let price = 24;
price = "24"; //TypeScript doesn't allow this and would not allow the code to compile...
```

Basically, TypeScript knows how the primitivily-typed variable was initialize, so it knows its type.

Otherwise, use the Explicit way.

### What is Explicit Typing

Basically, you tell in the code the type of the variable:

```typescript
let price: number = 2;
```

Trying to initialize the variable to a string, TypeScript would show an issue.

It leaves no room to mistypes, even if it is more verbose.

## What about Array of Types in TypeScript

In plain JavaScript, defining an array gives this:

```javascript
const veggies = ["Salad", "Carrot", "Tomatoes"];
console.log(typeof veggies); //object
```

In TypeScript, `const veggies = ['Salad', 'Carrot', 'Tomatoes'];` would be implicitly typed as `string[]`.

If you were to push a number to the array above, TypeScript would not allow it because the array can only contains strings.

## Functions: Type Parameters and Returns In TypeScript

That is very handy to understand the types of inputs and output.

What does this print to the console?

```javascript
function sum(a, b) {
  return a + b;
}

console.log(sum(1, "2"));
```

Yes, the string `12`.

TypeScript cannot know the type, which is `any` in the above example.

Using TypeScript, you can change it to this:

```javascript
function sum(a: number, b: number): number {
  return a + b;
}

console.log(sum(1, "2")); // doesn't work
console.log(sum(1, 2)); //logs 3
```

100% of the time, `sum` takes only numbers and return a number.

## What about Functions: Parameter Destructuring, Void, and Optional Params in TypeScript

It is still possible, but the syntax needs to be learned:

```typescript
function sum({ a, b }: { a: number; b: number }) {
  return a + b;
}

console.log(sum({ a: 1, b: "2" })); // doesn't work
console.log(sum({ a: 1, b: 2 })); //logs 3
```

### What about function that don't return anything?

Similar to C#, the return type is `void` but placed the TypeScript way.

### What about Optional parameters?

Similar to the null coalescing operator in C#, you can type a parameter as optional:

```typescript
function sayHello(name?: string) {
  return name ? `Hello ${name}` : "Hello stranger";
}

console.log(sayHello());
console.log(sayHello("John"));
```

## About Union Types in TypeScript

Union types means "_I am a variable that can any of multiple types_".

```typescript
let aBoolOrString: string | boolean = "I am string...";
aBoolOrString = true;
```

Why would you want that?

If a variable can either a string or a number, a function could receive the mixed types and handle the logic for each type.

For example, the following would not be valid:

```typescript
function logId(id: string | number) {
  console.log(id.toUpperCase());
}
```

To fix it, it should be:

```typescript
function logId(id: string | number) {
  if (typeof id === "string") {
    console.log(id.toUpperCase());
  } else {
    console.log(id);
  }
}
```

This is called narrowing. TypeScript forces you to specificly treat all scenarios independently.

## Literal Types In TypeScript

What do you say when you see this?

```typescript
let pi: 3.14 = 3.14;
```

Yead, like me, you'd say: "_What is that?_"

Well, basically, in TypeScript, you assign to a variable a Literal type: string, number, bool.

```typescript
function setProductSize(size: "small" | "medium" | "large") {}

setProductSize("huge"); // doesn't work
setProductSize("small"); // works
```

## Type Aliases in TypeScript

Type aliases are simply named types for Union types.

If you take the example from the previous paragraph, you can end up with the following:

```typescript
type Sizes = "small" | "medium" | "large";
function setProductSize(size: Sizes) {}

setProductSize("huge"); // doesn't work
setProductSize("small"); // works
```

It can particularly be interesting for objects:

```typescript
type Car = {
    brand: string,
    price: number
}

const Renault: Car = {
    brand: 1 // fails TypeScript checking
    price: 10000
};

const Renault: Car = {
    brand: 'Renault' // TypeScript is happy
    price: 10000
}
```

While it is possible to do this, it is better to use [Interfaces](https://www.typescriptlang.org/docs/handbook/2/objects.html) or Object Literals.

PS: JavaScript Object Literal is a data type used to define objects in JavaScript. It is a syntax for creating an object in JavaScript that is composed of key-value pairs. It is a lightweight and efficient way to create and store data. It is a great way to store related data in an organized manner.

For example: `{ brand: "Renault", price: 10000}`.

## Defining Interfaces in TypeScript

If you take the previous `Car` type alias, the interface is the following:

```typescript
interface Car {
  brand: string;
  price: number;
}
```

What is the differences between Type aliases and Interfaces?

1. You add new propertys to the interface at any time while with Type Aliases, this is not possible.

```typescript
interface Car {
  brand: string;
  price: number;
  // adding a new property as
  horsePower?: number;
}
```

2.  You can extend an interface

```typescript
interface ElectricCar extends Car {
  powerOutputKwh: number;
}

interface CarSalesService extends Car {
  soldOn?: Date;
  availableForSale: Date;
}
interface Car {
  brand: string;
  price: number;
}
const renaultZoe: ElectricCar = {
  brand: "Renault",
  price: 10000,
  powerOutputKwh: 65, // omitting this property would not be valid to TypeScript
};

const renaultScenic: CarSalesService = {
  brand: "Renault",
  price: 10000,
  availableForSale: new Date(Date.now()),
};
```

You can use interfaces in functions very easily. Taking the above interface definition, you can define the following function:

```typescript
function purchaseCar(car: Car): Car {
  console.log(car);
  return car;
}

purchasedCar = purchaseCar({ brand: "Ferrari", price: 1000000 });
// outputs: { "brand": "Ferrari", "price": 1000000 }

purchasedCar = purchaseCar({ brand: "Ferrari", pice: 1000000 });
// throw an error since 'pice' doesn't exist...
```

## Defining Enums

This is an exciting features!

If we take the `Sizes` type alias from above, we could have the following enum:

```typescript
enum Sizes {
  small, // 0
  medium, // 1
  large, // 2
}
```

The above is a numeric enum where the numeric value zero-indexed.

What is it useful for? The enum usage allows better autocomplete in an IDE.

Also, if you need string enums instead of the implicit numeric enmus, you can do so:

```typescript
enum Sizes {
  small, // 0
  medium, // 1
  large, // 2
}

enum SizesStr {
  small = "small",
  medium = "medium",
  large = "large",
}

console.log(Sizes.small); // log 0
console.log(SizesStr.small); // log 'small'
```

You can mix numeric and string values but I don't see the usecase...

## Let's move on to Classes in TypeScript

The syntax ressembles very much to ES6 syntax:

```typescript
enum EngineType {
  diesel = "diesel",
  petrol = "petrol",
  electric = "electric",
}

class Car {
  // you must have a constructor, otherwise TypeScript will complain...
  constructor(brand: string, price: number) {
    this.brandName = brand;
    this.priceTag = price;
  }

  brandName: string;
  priceTag: number;
  //the following two propertys are not mandatory in the constructor because:
  // - one has a default value
  // - the last is optional
  numberOfWheels: number = 4;
  engineType?: EngineType;
}

const renaultCar = new Car("Renault", 10000);
renaultCar.engineType = EngineType.diesel;
renaultCar.buy(); // prints: "This Renault costs €10000"
```

Similar to interfaces, you extend classes. However, the parent must be declared first, whereas it doesn't matter for interfaces.

```typescript
enum EngineType {
  diesel = "diesel",
  petrol = "petrol",
  electric = "electric",
}

class Car {
  brandName: string;
  priceTag: number;
  numberOfWheels: number = 4;
  engineType?: EngineType;

  constructor(brandName: string, priceTag: number) {
    this.brandName = brandName;
    this.priceTag = priceTag;
  }
}

class CarSalesService extends Car {
  soldOn?: Date;
  availableForSale: Date;

  constructor(brandName: string, priceTag: number, availableForSale: Date) {
    super(brandName, priceTag);
    this.availableForSale = availableForSale;
  }

  buy(): void {
    console.log(
      `This ${this.brandName} costs €${
        this.priceTag
      } was released on ${this.availableForSale.toDateString()}`
    );
  }
}

const renaultCar = new CarSalesService(
  "Renault",
  10000,
  new Date("2023-01-01")
);
renaultCar.engineType = EngineType.diesel;

renaultCar.buy(); // logs "This Renault costs €10000 was released on Sun Jan 01 2023"
```

## Implementing Interfaces on Classes in TypeScript

Implementing interfaces, classes must follow a contract and it provides a way to inject dependencies:

Here is an example of interface implementation:

```typescript
enum EngineType {
  diesel = "diesel",
  petrol = "petrol",
  electric = "electric",
}

interface IAvailableToBuy {
  howMuch(): string;
}

class Vehicule {
  brandName: string;
  priceTag: number;
  numberOfWheels: number = 4;
  engineType?: EngineType;

  constructor(brandName: string, priceTag: number) {
    this.brandName = brandName;
    this.priceTag = priceTag;
  }
}

class SalesService extends Vehicule implements IAvailableToBuy {
  availableOn: Date;

  constructor(brandName: string, priceTag: number, availableOn: Date) {
    super(brandName, priceTag);
    this.availableOn = availableOn;
  }

  howMuch(): string {
    return `This ${this.brandName} costs €${this.priceTag}`;
  }
}

function askPrice(salesService: IAvailableToBuy) {
  console.log(salesService.howMuch());
}

const buyingRenaultCar = new SalesService(
  "Renault",
  10000,
  new Date("2023-01-01")
);
const ducatiMotocycle = new Vehicule("Ducati", 5000);
ducatiMotocycle.numberOfWheels = 2;

askPrice(buyingRenaultCar); // logs "This Renault costs €10000"
askPrice(ducatiMotocycle); // TypeScript throws an error because the Vehicule class doesn't implement "howMuch".
```

## Class Access Modifiers in TypeScript

Much like C#, you can add access modifiers on the class propertys.

They are:

- `public`: get and set possible from outside the class.
- `protected`: get and set impossible. It is used to let child classes to access the parent's propertys.
- `private`: the property is only accessible in the class where it is declared.
- `readonly`: make the property available from outsite but doesn't allow modification outsite the class.

## Type Assertions in TypeScript

Sometimes, you know more than TypeScript about a type of variable.

Using type assertions, you can help.

```typescript
const theCanvas = document.querySelector(".the-textarea");
```

TypeScript knows `theCanvas` is a DOM `Element` but it cannot guess it is more specificly a ``text-area` element.

Using `as` followed by the more specific type, you can assert the type for TypeScript:

```typescript
const theCanvas = document.querySelector(
  ".the-textarea"
) as HTMLTextAreaElement;
```

If you use JSX, we could use the alternate syntax :

```typescript
const theCanvas = <HTMLTextAreaElement>document.querySelector(".the-textarea");
```

In the playground, you will need to set `JSX` option to `None`. We'll learn more about this below.

**IMPORTANT**: there will be no runtime checking, no exception or `null` generated if the assertion is wrong. Why? Type assertions are removed at compile time.

## What is `unknown` type

It is used in a usecase like the following:

```typescript
function getNetPrice(
  price: number,
  discount: number,
  format: boolean
): unknown {
  let netPrice = price * (1 - discount);
  return format ? `$${netPrice}` : netPrice;
}

const netPrice = getNetPrice(20, 10, true);
netPrice.startsWith("$"); // throw an exception

const netPriceProperly = getNetPrice(20, 10, true) as string;
netPriceProperly.startsWith("$"); // works fine
```

It seems to me that setting the type properly is better than using type assertions.

## About Generics in TypeScript

It is very similar to the C# generics. You can see now, if you worked with .NET and C#, the influence of the creators at Microsoft...

Though the syntax is slightly different, it will look familiar:

```typescript
// T can be named anything else. It doesn't matter.
const clone = <T>(value: T): T => {
  const json = JSON.stringify(value);
  return JSON.parse(json);
};

const books: string[] = ["Harry Potter", "Jurrasic Park", "Goodnight Moon"];
const bookCopies = clone<string[]>(books);
bookCopies.push("Project Hail Mary");
```

Read [the docs](https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-types) for more information.

## Advanced Narrowing in TypeScript

We saw narrowing above for primitive types.

We can also use it with Reference types:

- with classes:

```typescript
class Person {
  firstName: string;
  lastName: string;

  constructor(firstName: string, lastName: string) {
    this.firstName = firstName;
    this.lastName = lastName;
  }
}

class Company {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

function greetFromClass(entity: Person | Company) {
  //we check the instance type
  if (entity instanceof Person) {
    console.log(`Hello ${entity.firstName} ${entity.lastName}`);
  } else {
    console.log(`Hello ${entity.name}`);
  }
}

greetFromClass(new Person("Daniel", "Kelly"));
greetFromClass(new Company("Vue School"));
```

- with interfaces:

```typescript
greetFromClass(new Person("Daniel", "Kelly"));
greetFromClass(new Company("Vue School"));

interface Person {
  firstName: string;
  lastName: string;
}

interface Company {
  name: string;
}

function greetFromInterface(entity: Person | Company) {
  //we use the `in` operator to check a property exists
  if ("firstName" in entity) {
    console.log(`Hello ${entity.firstName} ${entity.lastName}`);
  } else {
    console.log(`Hello ${entity.name}`);
  }
}

greetFromInterface({ firstName: "Daniel", lastName: "Kelly" });
greetFromInterface({ name: "Vue School" });
```

## How to make TypeScript available locally

Use npm to install it globally: `npm install -g typescript`.

Then, simply create the TypeScript file you need and either:

- compile it to JavaScript: `tsc my-file.ts`.
- compile it while watching for changes: `tsc my-file.ts --watch`.

Adding a `tsconfig.json` file with the content being `{}`, running `tsc` in the directory is sufficient to compile all the files of the directory.

Furthermore, you can configure the TypeScript settings to have more control on the compiler rules.

For example:

- `noImplicitAny`: don't allow `any` as implicit type on functions. It is `true` by default.
- `target`: what version of JavaScript do you want to use
- `module`: to specify the module system of the project. For example, `CommonJS` is usually the way to go with NodeJS applications.
- `output`: for example, it could be `dist`
  Read [more in the docs](https://www.typescriptlang.org/tsconfig).

## A lot more to learn and put in practice

You should try to start using in VueJS applications.

I know I will.

In case you need to use JavaScript, using the `allowJs` flag to `true` in the `tsconfig.json` file will allow to have a specific file to use JavaScript instead of TypeScript.

Remember though: in a Vue component, the script setup must not use any TypeScript if the attribute `lang="ts"` isn't set.
