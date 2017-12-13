# Setup

Here is a quick introduction to our tutorial
* [Setting up a new Cx project](#setting-up-a-new-cx-project)
* [Examine project folder structure](#examine-project-folder-structure)
* [Install Material design theme](#install-material-design-theme)

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

### Git version control

It is also a good idea to use `git` version control from the very beginning of the project. So, if starting from scratch, make sure to initialize the git repository by running the following command inside the project folder:

```
git init
```

Make sure to add a `.gitignore` file to the project folder with the following text:
```
dist
node_modules
```
This tells `git` not to keep track of changes inside `dist` and `node_modules` folders, as these folders will be maintained automatically by our scripts and package manager.

Now you can make your initial commit by entering the following commands:
```
git add .
git commit -m "Initial commit"
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
   * `dist` - this folder is created when we run the `yarn build` command. Inside it, we will find the entire app optimized for production (all JS files have been bundeled together and minified, all Sass files have been compiled to valid CSS, assets are copied...).
   * `node_modules` - this is where `Node` keeps all of the project's dependencies. This folder is maintaned by our package manager (`yarn` or `npm`).

Don't worry if some things are still unclear to you, this is just a short overview. As you follow along this tutorial, we will be exploring most of these folders in more depth, and the folder structure will begin to make more sense.

## Install Material design theme

Although Cx themes are mostly plug-and-play, there are a couple of steps we need to perform when installing them. Here we demonstrate how to install the Material theme, but the process is simillar for the other themes as well.

First we install the theme package:

```
yarn add cx-theme-material
```

This will save the theme package to the `node_modules` folder and update our `package.json` file.

Since Material theme has it's own icons and fonts, we need to 

Next, we need to update the `index.scss` file inside the `app` folder:

#### app/index.scss

```
$cx-include-global-rules: true;

// replacement lines to import the material theme styles
@import "~cx-theme-material/src/variables";
@import "~cx-theme-material/src/index";

@import "components/index";
@import "layout/index";
@import "routes/index";
```
Please note that these two lines should be added after the first line of code.

Beside CSS, a theme may include JavaScript changes as well. Because of this, the theme's `index.js` file needs to be imported at the JavaScript's entry point of your Cx application.

```
import 'cx-theme-material';
```
Or more specifically, if we want also to use material design label and help messages placement, we need to enable these features explicitly: 

```
import {enableMaterialLabelPlacement, enableMaterialHelpPlacement} from 'cx-theme-material';
enableMaterialLabelPlacement();
enableMaterialHelpPlacement();
```
The updated file should look like this:

#### app/index.js
```
import { Store } from 'cx/data';
import { Url, History, Widget, startAppLoop, enableCultureSensitiveFormatting } from 'cx/ui';
import { Timing, Debug } from 'cx/util';
//css
import "./index.scss";

//material theme
import {enableMaterialLabelPlacement, enableMaterialHelpPlacement} from 'cx-theme-material';
enableMaterialLabelPlacement();
enableMaterialHelpPlacement();

//store
const store = new Store();

//webpack (HMR)
if (module.hot) {
   // accept itself
   module.hot.accept();

   // remember data on dispose
   module.hot.dispose(function (data) {
      data.state = store.getData();
      if (stop)
         stop();
   });

   //apply data on hot replace
   if (module.hot.data)
      store.load(module.hot.data.state);
}

//routing
Url.setBaseFromScript('app.js');
History.connect(store, 'url');

//debug
Widget.resetCounter();
Timing.enable('app-loop');
Debug.enable('app-data');

//app loop
import Routes from './routes';

let stop = startAppLoop(document.getElementById('app'), store, Routes);
```

Be sure to update the `webpack.config.js` so that `babel-loader` also goes through `cx-theme-material` folder:

#### config/webpack.config.js

```
    ...

    module: {
        loaders: [{
            test: /\.js$/,
            //add here any ES6 based library
            // add 'cx-theme-material' to the regex
            include: /(app|cx|cx-react|cx-theme-material)[\\\/]/, 
            loader: 'babel-loader',
            query: babelCfg
        }, {
           test: /\.(png|jpg)/,
           loader: 'file-loader'
        }]
    },
    
    ...
```

Finally, don't forget to add material icons to your project, as described [here](https://google.github.io/material-design-icons/#icon-font-for-the-web). 

#### app/index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
    <title>Home Expenses</title>
    <!--Add Material icons-->
    <link href="https://fonts.googleapis.com/css?family=Roboto|Material+Icons:400,500,600" rel="stylesheet">
</head>
<body>
    <div id="app">
    </div>
</body>
</html>
```

To check that the material theme was successfully installed, enter `yarn start` in command line, in the app go to `Users` page and choose `User 1` ([http://localhost:8088/users/1](http://localhost:8088/users/1)) and check out the Edit User form.

<img src="https://github.com/codaxy/cxjs-home-expenses-app-tutorial/blob/master/tutorial/screenshots/edit_user_default.PNG" alt="Default theme" />

Default theme

<img src="https://github.com/codaxy/cxjs-home-expenses-app-tutorial/blob/master/tutorial/screenshots/edit_user_material.PNG" alt="Material theme" />

Material theme

<img src="https://github.com/codaxy/cxjs-home-expenses-app-tutorial/blob/master/tutorial/screenshots/edit_user_material_label_placement.PNG" alt="Material theme and label placement" />

Material theme and label placement

The form should now look like the one on the third image.