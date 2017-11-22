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

<a href="https://github.com/codaxy/cxjs-home-expenses-app-tutorial/blob/master/tutorial/screenshots/folder-structure.PNG">
    <img src="https://github.com/codaxy/cxjs-home-expenses-app-tutorial/blob/master/tutorial/screenshots/folder-structure.PNG" alt="Folder structure" />
</a>

The scaffold project can be found inside the `app` folder. In it, we can find the following subfolders:
   * `components` - here we normally save custom Cx components used throughout the app.
   * `data` - here it is convenient to keep data that is hardcoded, but used at multiple places inside the app. For this app we will keep here our expenses categories and the fake data generator.
   * `layout` - here we define the main layout for our app (sidebars, headers,                    columns...).
   * `routes` - subfolders inside the `routes` basically represent all of the pages/views our app has, and inside them are all of the JS files that are used to generate that route.


It is also interesting to mention the other folders outside the `app` folder:
   * `assets` - here we typically save all the assets that are used in our app (images, icons...).
   * `config` - this folder contains all of the configuration files for `babel` and `webpack`, but for most of the use-cases, the default settings are fine and we won't have to bother ourselves with it.
   * `dist` - this folder is created when we run the `yarn build` command. Inside it, we will find the entire app optized for production (all JS files have been bundeled together and minified).
   * `node_modules` - this is where `Node` keeps all of the project dependencies. This folder is maintaned by our package manager (`yarn` or `npm`).

Don't worry if some things are still unclear to you, this is just a short overview. As you follow along this tutorial, we will be exploring most of these folders in more depth, and the folder structure will begin to make more sense.

## Install Material design theme
