# Contributing

Jodit is an open source project and we would really appreciate your contributions.
You can help us by fixing bugs, reporting them, or translating the editor interface.

## TL;DR

```bash
git clone git@github.com:xdan/jodit.git
cd jodit
nvm use
npm ci
```

Change code + add autotest in `test/tests/` folder. Run

```bash
npm run lint && npm test
```

Fix it and commit your changes:

```bash
git commit -m "Fixed issue smt"
git checkout -b i/GITHUB-ISSUE-NUMBER
git push
````

In your repository in the GitHub interface, create a pull request.

## Fixing issues and adding features

Before you start, here are some things to keep in mind:

-   We expect contributions to conform to the high quality code standards we follow, including [coding style](#code-style) and [tests](#tests). Lack of attention to this point can either slow down the acceptance of the contribution, or even cause us to reject it completely.
-   There is no guarantee your contribution will be included in the project code. However, pull requests make it easy for you to keep them for your own use or for others who might be interested in them.
-   If you need help creating a patch or implementing a feature, please submit a ticket to us on the issue tracker.

### Code style

In order for the code to match the general style, you can simply run prettier:

```bash
npx prettier ./src/%YOUR_PATCHED_FILE_PATH% --write
````

It is also important that before you create a PR, you run the command without errors:

```bash
npm run lint
```

We follow simple code formatting rules that your IDE or editor will tell you.

### Tests

Before doing any functionality or fixing a bug, you need to create a test for it.
We follow the [TDD](https://en.wikipedia.orgwikiTest-driven_development) methodology, i.e. first we write an autotest, and then a functional.
It would be absolutely impossible to maintain our editor without autotests. Therefore, this is one of the most important things you need to do in your PR.

### Creating a pull request

> GitHub provides an [excellent documentation about pull requests](https://help.github.com/categories/collaborating-with-issues-and-pull-requests/). If you are not sure what to do, this is the right place to start.

Assuming that you would like to propose some changes, these are the steps you should take to create a pull request:

1. Make sure to open a ticket in https://github.com/xdan/jodit describing the issue, feature or problem that you want to solve in your pull request. This can be skipped in case of obvious and trivial changes (typos, documentation, etc.).
2. Go to GitHub and [fork the repository](https://help.github.com/articles/fork-a-repo). The forked repository will appear in your GitHub account as `https://github.com/YOUR-USERNAME/jodit`.
3. Open your terminal, then go to the package ("repository") folder in your development environment:

```bash
$ cd path/to/jodit
```

1. Start a new branch for your code. We use the `i/GITHUB-ISSUE-NUMBER` convention for branch names:

```bash
$ git checkout -b i/GITHUB-ISSUE-NUMBER
```

1. Make the changes. Stick to the [code-style guidelines](#code-style) and remember about [tests](#tests)!
2. Commit your changes:

```bash
$ git commit -m "Fixed issue smt."
```

1. Now it is time to make your changes public. First, you need to let `git` know about the fork you created by adding the remote:

```bash
$ git remote add my-fork https://github.com/YOUR-USERNAME/jodit
```

1. Push your changes to your forked repository:

```bash
$ git push my-fork i/GITHUB-ISSUE-NUMBER
```

1. Go to your forked repository on GitHub. Use the [pull request button](https://help.github.com/articles/about-pull-requests/) and follow the instructions.
