# Visual Studio Code for Vue.js Developers

## Create a profile

And install:

- `Todo Tree`
- `Material Icon Theme`
  - and select the icon set
- `Material Theme`
  - and select `Material Theme Darker High Contrast`
- `Material Theme Icons`
- `Prettier - Coder Formatter`
  - and set as default formatter
- `ESLint`
- `Vue docs`
- `Vue Language Features (Volar)`
- `TypeScript Vue Plugin (Volar)`
- `Vue 3 Snippets`
- `Vue VSCode Snippets`
- `advanced-new-file`: to create new file from the command palette.
- `Tailwind CSS IntelliSense`

  - and add a `tailwind.config.js` file to enable in the root of the project:

  ```javascript
  module.exports = {
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    theme: {
      extend: {},
    },
    plugins: [],
  };
  ```

  - and enable `Editor: Quick Suggestions` with `string` to `on`

- `CSS Navigation`
- `NPM Browser` to view dependencies and the available versions.

## Formatting with Prettier

The prerequisite is to enable Prettier extension.

### To format all the files

Run in Terminal `npx prettier --write .`

### To check all the files

Run in Terminal `npx prettier --check .`

## Linting

The prerequisite is to enable ESLint extension.

Then, in the User settings in JSON, add the following:

```json
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
```

Read more in the docs:

- [ESLint](https://eslint.org/)
- [ESLint Plugin Vue Docs](https://eslint.vuejs.org/)

## Debugging Vue Apps in VS Code

Instead of using `console.log`, use the built-in JavaScript debugger.

With CTRL+SHIFT+P:

- `Setting UI` and search for `margin`
  - check the `Editor: Glyph Margin` to enable breakpoints.
- open a `Debug: JavaScript Debug Terminal`
  - run `npm run dev` and click the link in the Terminal.

**IMPORTANT** : do not enter the URL yourself so that the debugging works.

On a breakpoint, you can set conditions, like `post.id === 10`. It can be very handy to skip data or go straight to the issue.

## Must-learn shortcuts

### To open a file quickly

Learn the `CTRL+P` and type the file name you are looking for.

It is the one to learn if you need to learn one shortcut.

### To create a new file at a specific location

With `advanced-new-file`:

- `CTRL+ALT+N`
- type and select the destination folder
- type the file name.
- BOOM!

### Emmet

#### For HTML

Emmet allows us to scaffold HTML code quickly with a CSS-like syntax.

For example:

- `section.section-class>article#article-id` becomes the following on tab:

```htm
<section class="section-class">
  <article id="article-id"></article>
</section>
```

- `section.section-class>article*4#id-$` becomes the following on tab:

```htm
<section class="section-class">
  <article id="id-1"></article>
  <article id="id-2"></article>
  <article id="id-3"></article>
  <article id="id-4"></article>
</section>
```

- `section.section-class>article*4#id-${Item $}` becomes the following on tab:

```htm
<section class="section-class">
  <article id="id-1">Item 1</article>
  <article id="id-2">Item 2</article>
  <article id="id-3">Item 3</article>
  <article id="id-4">Item 4</article>
</section>
```

#### For CSS

Read [more in the docs](https://docs.emmet.io/).

### Linked Editing

When you edit a DOM element in the template, for example, changing a `<div>... </div>` to `<p>... </p>`, the default is not change the closing tag in VSC.

To enable the option to update the closing tag, go to the Settings UI and search `linked editing` and check the option.

Next time you rename a element, the closing tag will update.

### Inlay hints

To show inputs and output expected and returned by methods or functions, you can:

- enable

  - `JavaScript > Inlay Hints > Function Like Return Types`
  - `TypeScript > Inlay Hints > Function Like Return Types`

- and configure:
- `JavaScript > Inlay Hints > Parameter Names` to `all`
- `TypeScript > Inlay Hints >  Parameter Names` to `all`
