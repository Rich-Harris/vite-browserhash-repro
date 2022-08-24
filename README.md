# vite-browserhash-repro

This repo demonstrates an issue affecting SvelteKit: https://github.com/sveltejs/kit/issues/5952

## Background

When SvelteKit server-renders a page, it includes a `<script>` tag that is effectively this:

```html
<script type="module">
	import { start } from '/node_modules/@sveltejs/kit/src/runtime/client/start.js';
	// ...
</script>
```

This module, which is inside the `@sveltejs/kit` package but not exposed via `pkg.exports`, imports a module that _is_ exposed via `pkg.exports`:

```js
import { error } from '../../index/index.js';
```

If user code imports the same module...

```js
import { error } from '@sveltejs/kit';
```

...then ideally it would resolve to the same module. Instead, the latter import gets a `?v=${browserHash}` suffix:

```
/node_modules/@sveltejs/kit/src/runtime/index/index.js
/node_modules/@sveltejs/kit/src/runtime/index/index.js?v=xyz123
```

Because of that, the module is initialised twice, and `instanceof` checks fail.

## Reproduction

This repro demonstrates the same thing happening in a much simpler form. After installing dependencies, run `npm run dev` and visit [localhost:5173](http://localhost:5173). The expectation is that the `test` module will be instantiated once, but it's instantiated twice — once from `index.html`...

```html
<script type="module" src="/node_modules/test/index.js"></script>
```

...and once from `src/index.js`:

```js
import 'test';
```
