# Changelog

## v1.2.0

### Added
- Added an additional flag `-s | --start` for specifying which row (0 indexed) of the file to start execution from
- Added an additional flag `-o | --own` for specifying whether the user owns all the repository listed in the csv file. If this flag is passed forking won't be done.
- Added a request limit checking logic that'll automatically stop the execution if the request limit per hour (according to github API) is about to be reached.
- Added a condition that'll check if the github PAT is defined in `.env` file under `G_TOKEN` variable. If not then using `-u | --update` will not perform the said task.


### Changed
- Fixed typos
- Changed the core logic. Previously all the content would have been read first and then processing would start. Now the processing happends line by line i.e., it reads a line, takes the necessary action and then reads the next line. For hugely large files (doubltful anyone would have large file) it'll increase performance.
- Now the output won't be written on the same file. Instead a new file will be created with ***_output*** suffix. This is done to make sure even if someone executes the command by mistake they'll still have access to the previous data in the original file. If the file already exists then it's not overridden instead new content is appended. 

### Removed
- [csv-parser](https://www.npmjs.com/package/csv-parser)
- [csv-writer](https://www.npmjs.com/package/csv-writer)
- Removed the line that would report current package index out of all packages in the form *`[current_index / total_count]`*. Since the file content isn't pre-read anymore this won't be possible.

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