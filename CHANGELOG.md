## [0.7.61](https://github.com/rxdi/firelink/compare/v0.7.59...v0.7.61) (2021-12-09)


### Bug Fixes

* **exitHandler:** added await inside create-virtual-symlink ([0b83f78](https://github.com/rxdi/firelink/commit/0b83f78f68ef1da8dd66f2a85a35298383271566))



## [0.7.59](https://github.com/rxdi/firelink/compare/017f8ee90d8b7eb26e5150fb963c2870cd4cce49...v0.7.59) (2021-12-09)


### Bug Fixes

* **Dependencies:** https://github.com/rxdi/firelink/pull/3 ([017f8ee](https://github.com/rxdi/firelink/commit/017f8ee90d8b7eb26e5150fb963c2870cd4cce49))
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



