# Changelog

## v1.1.1

### Changed
- Fixed typos
- Fixed the images in readme not showing up (hopefully this time it's fixed)
- Fixed the output csv file not having the correct link to the generated pull request

## v1.1.0

### Added
- Added more "Built With" frameworks/libraries in readme
- Added an additional flag `-f | --force` for force updating the package even if it might break some features
- Added a test for testing `pull` under `Fork-> Clone -> Push -> Pull` block
- Added two tests under `Getting the package.json of a Repository` for testing the said action
- More robust version checking. Supports packages with semantic versioning with formats such as
    - ^1.5.6
    - ~2.4.5
    - 1
    - 2.x
    - 17.0
    - 17.0.x
    - 1.6.5 - 2.5.6
- After all entries have been checked and necesary actions have been done the `Temorary_Directory` will be deleted.


### Changed
- Fixed typos
- Fixed the images in readme not showing up
- Moved from *'have to work anyhow'* to *'should be logically sound'* (Hopefully)
- Changed the name of a test block from `GITHUB REST API` to `Fork-> Clone -> Push -> Pull`  (though there are no tests for cloning and pushing)
- `Temporary_Directory` won't be pushed to github anymore. (Even if it's not automatically deleted)
- Changed the priotity of `npm test` from *High* to *Normal*
- Changed the priority of *reduce dependency* from *Noraml* to *Low*
### Removed
- [get-repo-package-json](https://www.npmjs.com/package/get-repo-package-json)
- test for get-repo-package-json

## v1.0.0

### Added
- Added this changelog :)
- Back to top links
- Added "Built With" frameworks
- Changed table of contents to start collapsed
- Added checkboxes for major features on roadmap
- Added the entire project except for the pre-build template