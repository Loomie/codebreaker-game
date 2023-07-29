Howto create a release
=====================

If the release contains new features increment the minor version in `server/package.json` (see [Semantic Versioning](https://semver.org/)), if not already done during development.

Create a git tag named `release-1.0.0` and push it. Log into Github, navigate to releases and "create release". For the title use "Version 1.0.0". Click "publish release" to finish.

Update files with the next version. Edit the `server/package.json` and increment the version.