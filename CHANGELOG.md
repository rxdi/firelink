# [1.0.0-beta-0](https://github.com/rxdi/firelink/compare/v0.9.2...v1.0.0-beta-0) (2023-03-07)


### Bug Fixes

* removed namespacing and instead we use provided folder from fireDependencies the tool resolves now any package not only monorepo packages ([2184330](https://github.com/rxdi/firelink/commit/2184330fdc94c9ffe982940d98f24c7fa52ff161))


### Features

* **refactor:** whole logic is refactored to new one using commander ([06ec191](https://github.com/rxdi/firelink/commit/06ec1910b5785686303eed784acc2e9a40673980))



## [0.9.2](https://github.com/rxdi/firelink/compare/v0.9.1...v0.9.2) (2023-03-05)


### Bug Fixes

* **husky:** added new husky file ([c72d910](https://github.com/rxdi/firelink/commit/c72d910eaa30e4fd1512f6a1e07a6e5aee208925))
* **rsync:** added --force argument in order to test the idempotency of rsync ([09770e6](https://github.com/rxdi/firelink/commit/09770e6bc382b053f0207ff8f6a90f075587df74))



## [0.9.1](https://github.com/rxdi/firelink/compare/v0.9.0...v0.9.1) (2022-10-25)


### Bug Fixes

* **release:** added old version of nodejs due to cli incompatability ([0e279bf](https://github.com/rxdi/firelink/commit/0e279bf91dab80c6722b28b4dcc3ab0ab9f59b39))



# [0.9.0](https://github.com/rxdi/firelink/compare/v0.8.2...v0.9.0) (2022-10-25)



## [0.8.2](https://github.com/rxdi/firelink/compare/v0.8.1...v0.8.2) (2022-10-25)


### Bug Fixes

* **package:** added npx parcel build command with specific version ([317cfb6](https://github.com/rxdi/firelink/commit/317cfb6b63d02ac7bd010954bb1991467b444741))



## [0.8.1](https://github.com/rxdi/firelink/compare/v0.8.0...v0.8.1) (2022-10-25)


### Features

* **copy:** added new argument which can be passed called use native copy which defaults to nodejs copy recursive ([d6d2c52](https://github.com/rxdi/firelink/commit/d6d2c522fc71cced8053b352614ac4891abd2875))



# [0.8.0](https://github.com/rxdi/firelink/compare/v0.7.75...v0.8.0) (2022-03-16)


### Features

* **--no-runner:** added command to do the copy magic without running command at the end ([532df1b](https://github.com/rxdi/firelink/commit/532df1bdabbd816dc0dcd50c91ab8039ac8c54b5))



## [0.7.75](https://github.com/rxdi/firelink/compare/v0.7.74...v0.7.75) (2021-12-11)


### Bug Fixes

* **release:** added tsc to release for npm and added main.js file to be available when releasing tag inside github ([7c613a1](https://github.com/rxdi/firelink/commit/7c613a1d51212e25b6f8e97ce7323fbcafda1ca2))



## [0.7.74](https://github.com/rxdi/firelink/compare/v0.7.73...v0.7.74) (2021-12-11)


### Features

* **index:** added barrel export using index.ts for further more extension of the library ([60907ea](https://github.com/rxdi/firelink/commit/60907ea3385a5399d1704373a10fb25e299c7a89))



## [0.7.73](https://github.com/rxdi/firelink/compare/v0.7.72...v0.7.73) (2021-12-11)


### Bug Fixes

* **createVirtualSymlink:** pass success status to all calls to exitHandler ([d9ff6b7](https://github.com/rxdi/firelink/commit/d9ff6b7e74e83668726476300b1a412a885d45f8))



## [0.7.72](https://github.com/rxdi/firelink/compare/v0.7.71...v0.7.72) (2021-12-11)


### Bug Fixes

* **package.json:** added mkdir for binaries since the build was not working ([62036d9](https://github.com/rxdi/firelink/commit/62036d956afa0b5f8aba34ca922bbb4189423ccc))



## [0.7.71](https://github.com/rxdi/firelink/compare/v0.7.70...v0.7.71) (2021-12-11)


### Bug Fixes

* **README:** changed link to lead to latest binary ([26c152c](https://github.com/rxdi/firelink/commit/26c152c97fb85d104f9edeef39999a999c6bc4fe))


### Features

* **release:** release process is only triggered when tag is created ([2529635](https://github.com/rxdi/firelink/commit/25296357961d6c3d087035f394d111896057eaf4))



## [0.7.70](https://github.com/rxdi/firelink/compare/v0.7.69...v0.7.70) (2021-12-11)



## [0.7.69](https://github.com/rxdi/firelink/compare/v0.7.68...v0.7.69) (2021-12-11)



## [0.7.68](https://github.com/rxdi/firelink/compare/v0.7.67...v0.7.68) (2021-12-11)


### Bug Fixes

* **binaries:** release for binaries using github action ([1afda49](https://github.com/rxdi/firelink/commit/1afda49d893bd1ad14ade61bdfa87cd984257933))



## [0.7.67](https://github.com/rxdi/firelink/compare/v0.7.66...v0.7.67) (2021-12-11)



## [0.7.66](https://github.com/rxdi/firelink/compare/v0.7.65...v0.7.66) (2021-12-11)



## [0.7.65](https://github.com/rxdi/firelink/compare/v0.7.64...v0.7.65) (2021-12-11)


### Features

* **binaries:** trying to upload binaries to release... ([ad16d33](https://github.com/rxdi/firelink/commit/ad16d33ed52156602b79ab139307ef936e757253))



## [0.7.64](https://github.com/rxdi/firelink/compare/v0.7.63...v0.7.64) (2021-12-11)


### Features

* **binaries:** release for binaries version 2 ([ded727e](https://github.com/rxdi/firelink/commit/ded727e64374113efac033eeb0e5b6b55b6205e6))



## [0.7.63](https://github.com/rxdi/firelink/compare/v0.7.62...v0.7.63) (2021-12-11)


### Features

* **binaries:** added a github action to release binaries based on tags ([5620385](https://github.com/rxdi/firelink/commit/5620385eff79856c70ef79e1feeea98927332598))



## [0.7.62](https://github.com/rxdi/firelink/compare/017f8ee90d8b7eb26e5150fb963c2870cd4cce49...v0.7.62) (2021-12-09)


### Bug Fixes

* **Dependencies:** https://github.com/rxdi/firelink/pull/3 ([017f8ee](https://github.com/rxdi/firelink/commit/017f8ee90d8b7eb26e5150fb963c2870cd4cce49))
* **exitHandler:** added await inside create-virtual-symlink ([0b83f78](https://github.com/rxdi/firelink/commit/0b83f78f68ef1da8dd66f2a85a35298383271566))
* **main:** when firebase crashes it is wrapped inside try catch causing to silend build fails ([9445747](https://github.com/rxdi/firelink/commit/944574740fbcb534540075b3b12d9bd8d982f9b3))
* **packages:** on windows native fs introduced since the rsync behaviour differs ([d5b0bb4](https://github.com/rxdi/firelink/commit/d5b0bb491c14dc8bd635ccff5ca52bd63eefc72a))
* **yarn:** version missmatch and wrong generated yarn.lock removed since we have package.lock.json ([7e0fce9](https://github.com/rxdi/firelink/commit/7e0fce993816629210f9abc1bab4961edc58d415))


### Features

* **actions:** added ci-skip option to publish build if we want to skip ([86430c5](https://github.com/rxdi/firelink/commit/86430c5fc549e6f9c98202eb0a022ffd9f9e14d0))
* **Binary:** added executable binary so it can be used without nodejs ([7dfe08d](https://github.com/rxdi/firelink/commit/7dfe08d09b0f6fc3604e04d2b1fecce902d36b04))
* **customOutDir:** added options insideadded option inside fireConfig to specify folder explicitly for out dir .packages ([6315e63](https://github.com/rxdi/firelink/commit/6315e6305c112c18e1b39d4c6a62f0a5062e8d78))
* **ignore:** added ignore files using pattern and revereted rsync and for windows robocopy is used ([9e311ea](https://github.com/rxdi/firelink/commit/9e311ea6f0d6e8208654654e53161c9a8e8db1f5))
* **rsync:** removed native rsync process and replaced with nodejs version for cross platform compatability ([096fec7](https://github.com/rxdi/firelink/commit/096fec7fa71e3d463bef0996dfb816eb2d6c0ee8))
* **Worker:** removed unused if condition and added return type https://github.com/rxdi/firelink/pull/6 ([b93919b](https://github.com/rxdi/firelink/commit/b93919b9d307240276fc8add946d92c773f1cc0c))



