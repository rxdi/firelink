# @rxdi/firelink

Sync packages when deploying `monorepos` with firebase using `yarn` or `bolt` workspaces

> Have you ever have a problem when deploying `npm` package with `monorepos` inside `firebase functions` ? You are really lucky then! Skip this library!

> If you have problem resolving your package since it is only virtually present as a symlink inside your `monorepo` then you should try `@rxdi/firelink`

> This repository is a complete replacement for `firebase` function.

> The only purpose is to `copy` mapped modules inside `package.json` before working with `firebase` CLI. This way when deploying application `npm` will install packages locally `file:./.packages/database` instead from global registry.

## Features

- No dependencies
- `firebase` command replacement
- Created with Typescript
- 3 KB bundle

## Installation

```bash
npm i -g @rxdi/firelink
```

## Usage

#### Add `fireDependencies` inside `package.json`

```json
{
  "fireDependencies": {
    "@graphql/database": "../../packages/database",
    "@graphql/shared": "../../packages/shared",
    "@graphql/introspection": "../../packages/introspection"
  }
}
```

#### Usage

```bash
firelink deploy
```

The same as `firebase deploy` the only differance is that it will COPY monorepos replace package.json > dependencies with appropriate local file structure and then will revert changes after `firebase` script exit



Example compiled `json`

Before

```json
{
  "dependencies": {
    "@graphql/database": "^1.0.0",
    "@graphql/shared": "^1.0.0",
    "@graphql/introspection": "^1.0.0",
  }
}
```

After

```json
{
  "dependencies": {
    "@graphql/database": "file:./.packages/database",
    "@graphql/shared": "file:./.packages/shared",
    "@graphql/introspection": "file:./.packages/introspection",
  }
}
```
