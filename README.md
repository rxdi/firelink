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
- 7 KB bundle

## Installation

Using `npm`

```bash
npm i -g @rxdi/firelink
```

Using `binary`

```bash
wget https://github.com/rxdi/firelink/releases/download/v0.7.69/firelink-linux
```

Give it permission to execute

```bash
chmod +x firelink-linux
```

```bash
./firelink-linux
```

Alias

```
sudo ln -s ./firelink-linux /bin/firelink
```

There are multiple binaries for `mac`, `windows` and `linux`
There is only one tested in `linux` so keep in mind that for `mac` and `windows` may not work!
If the binaries don't work in `mac` or `windows` please install it via `npm` globally with `npm i -g @rxdi/firelink`

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

Bootstrapping the packages
It will run `npm install` inside the current working directory
This will install local packages referenced inside `fireDependencies`
It means that `node_modules` folder will be already populated with appropriate packages after `npm install`

```bash
firelink --bootstrap --no-runner
```

Deploying as usual

```bash
firelink deploy
```

You can also use one liner replacement for `npm install` and `firebase deploy`

```bash
firelink deploy --bootstrap
```

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

#### No runner

With argument `no-runner` no actual script will be executed after the copy logic.
This will help us to benefit from the `firelink` to do his magic without running a command `firebase` or other specified inside `fireConfig.runner`. This way we can use the logic for firelink only to prepare the environment and change `package.json` with appropriate installation directory configured inside `fireDependencies`.
It is recommended to be used with `--leave-changes` since it will create a temporary file called `package-temp.json` in order at some point to revert the side effects from running the command:

```
firelink --no-runner --leave-changes
```

Revert the changes made inside `package.json`

```
firelink --no-runner --revert-changes
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

You can pass `--runner dir` argument to the command which will override the default runner `firebase`

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
