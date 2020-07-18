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

Using `binary`

```bash
wget https://github.com/rxdi/firelink/raw/master/dist/firelink-linux
```

Give it permission to execute

```bash
chmod +x firelink-linux
```

```bash
./firelink-linux
```

The tool assumes `@group/package-name` naming convention

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

#### Leave changes to package.json after command execution exited

```bash
firelink --leave-changes
```

This command will create `package.temp.json` which is `original` configuration before modifications

#### Revert changes

```bash
firelink --revert-changes
```

Reverts changes from `package.temp.json` to original `package.json` and deleting `package.temp.json`

If command `firelink --leave-changes` is executed multiple times `package.temp.json` will remain the same as the first time command `firelink --leave-changes` is executed.

Example:

Before

```json
{
  "dependencies": {
    "@graphql/database": "^1.0.0",
    "@graphql/shared": "^1.0.0",
    "@graphql/introspection": "^1.0.0"
  }
}
```

After

```json
{
  "dependencies": {
    "@graphql/database": "file:./.packages/database",
    "@graphql/shared": "file:./.packages/shared",
    "@graphql/introspection": "file:./.packages/introspection"
  }
}
```

# Configuration

Default runner is command `firebase` but you can change it for example to `gcloud` or `serverless` by defining `fireConfig` inside `package.json`

```json
{
  "fireConfig": {
    "runner": "firebase"
  }
}
```

You can put even `dir` command

```json
{
  "fireConfig": {
    "runner": "dir"
  }
}
```

When executing `firelink` you will be referenced to `dir` function so you will get list of folders inside current directory.

```bash
dist  node_modules  package.json  README.md  src  tsconfig.json  yarn.lock
```
