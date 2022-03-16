This example assumes that you are mocking `npm` command specified inside file `package.json` and property `fireConfig` is configurated

```
npx firelink install
```

### Typescript

In order to transpile typescript to javascript there is a argument `--build` which will build with `tsc` every package

```
npx firelink install --build
```

### Specify default runner

Inside `package.json` there is a property called `fireConfig` and inside of it we have a `runner`

```json
{
  "fireConfig": {
    "runner": "npm"
  }
}
```
