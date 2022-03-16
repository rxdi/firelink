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
    "runner": "firebase",
    "outFolderName": ".packages",
    "outFolderLocation": ".",
    "excludes": ["node_modules"]
  }
}
```

`excludes` property can exclude some folders or files from being copied it accepts `Array` from `string`

For example we may want to install dependencies of the packages when deploying using local npm path,
so we want to not waste time duplicating node modules

Equivalent of excludes inside package.json `.fireignore` can be specified as a file inside a directory where the command `firelink` will be executed. `.fireignore` behaviour is the same as `.gitignore`

If you do not wish to use `.fireignore` file name the name can be specified from `fireConfig.excludesFileName`

By default packages will be saved in `.packages` folder and `current` directory will be used
U can change that by specifiyng properties `outFolderName` and `outFolderLocation` inside `fireConfig`
Check `example` folder inside this repository

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
