# Setup

Here is a quick introduction to our tutorial
* Setting up a new Cx project
* Examine project folder structure
* Install Material design theme

## Setting up a new Cx project

To follow along with this tutorial, you can either start from scratch or clone the tutorial's repo, which includes the app as well. 
It is assumed you already have at least `Node 6.0.0` or above installed on your machine. If this is not the case, you can get `Node` [here](https://nodejs.org/en/).

### Starting from scratch

The easiest way to start from scratch is to use `yarn` package manager, so if you don't yet have it already, you can get the installation file [here](https://yarnpkg.com/en/).

To set up a new Cx project, simply use the `yarn`'s [`create`](https://yarnpkg.com/lang/en/docs/cli/create/) command:

```
yarn create cx-app cxjs-home-expenses-app-tutorial
```

This will create a new folder called `cxjs-home-expenses-app-tutorial` at the current location and install the Cx scaffold. To start the project, `cd` into the newly created folder and start the app:

```
cd cxjs-home-expenses-app-tutorial
yarn start
```

### Exploring the finished app

To see the finished app, simply clone this repo onto your computer and switch between branches to explore different stages of the tutorial.

```
git clone git@github.com:codaxy/cxjs-home-expenses-app-tutorial.git
cd cxjs-home-expenses-app-tutorial/src
yarn install
yarn start
```

## Examine project folder structure
