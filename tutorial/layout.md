# Layout

In this section we will explore the following:
* [Layout intro](#layout-intro)
* [App layout](#app-layout)
* [Routes](#routes)
* [Links](#links)

## Layout intro

A layout is a simple widget tree with `ContentPlaceholder` elements that are used to specify content insertion points.

Outer layouts define a container with a custom look and feel for the content being rendered. This is very convenient when multiple pages need to share a common layout or for defining global application layouts.

To assign an outer layout to a widget, we specify the `outerLayout` attribute and pass in the predefined application layout.


## App layout

Our app is using the default layout as defined in our project scaffold. The layout consists of a collapsable sidebar (`aside`), a header (`header`) and the main section (`main`). Feel free to define your own custom layout, but for the purpose of this tutorial, we will use the one already defined.

#### app/layout/index.js

```jsx
import {HtmlElement, Link, Button} from 'cx/widgets';
import {ContentPlaceholder} from 'cx/ui';
import Controller from "./Controller";

export default <cx>
    <div
        controller={Controller}
        class={{
            "layout": true,
            "nav": {bind: "layout.aside.open"}
        }}
    >
        <main class="main" onMouseDownCapture="onMainClick">
            <ContentPlaceholder />
        </main>
        <header class="header">
            <i
                class={{
                    hamburger: true,
                    open: {bind: 'layout.aside.open'}
                }}
                onClick={(e, {store}) => {
                    store.toggle('layout.aside.open');
                }}
            />
            <ContentPlaceholder name="header"/>
        </header>
        <aside class="aside">
            <h1>Cx App</h1>
            <dl>
                <dt>
                    App
                </dt>
                <dd>
                    <Link href="~/" url:bind="url">
                        Home
                    </Link>
                </dd>
                <dd>
                    <Link href="~/dashboard" url:bind="url">
                        Dashboard
                    </Link>
                </dd>
                    <dd>
                    <Link href="~/about" url:bind="url">
                        About
                    </Link>
                    </dd>
                </dl>
                <dl>
                    <dt>
                        Admin
                    </dt>
                <dd>
                    <Link href="~/users" url:bind="url" match="prefix">
                        Users
                    </Link>
                </dd>
            </dl>
        </aside>
    </div>
</cx>
```

It is interesting to notice that our `header` and `aside` elements come **after** the `main` element. The reason is that our scaffold app is using `fixed` positioning for `header` and `aside` elements with partial overlapping, and this ensures the correct stacking order: `main` at the bottom (gray background), `aside` at the top (left sidebar) and the `header` in between (over `main` and under `aside`). Also notice that our layout has two `ContentPlaceholders`, one in the `header` and the other in the `main` section.

<a href="https://github.com/codaxy/cxjs-home-expenses-app-tutorial/blob/master/tutorial/screenshots/default-layout.PNG">
    <img src="https://github.com/codaxy/cxjs-home-expenses-app-tutorial/blob/master/tutorial/screenshots/default-layout.PNG" alt="Default layout" />
</a>

Default layout


Now let's examine one of the predefined routes, to see how we actually define dynamic content to be inserted into the `ContentPlaceholders` in our `header` and `main` sections:

#### app/routes/dashboard/index.js
```jsx
...

export default <cx>
    <h2 putInto="header">Dashboard</h2>

    <FlexCol spacing="large" controller={Controller}>
        ...
    </FlexCol>
</cx>
```

If we take a closer look at the content enclosed in `<cx></cx>`, we can see there is an `h2` header with `putInto` attribute, and another `FlexCol` component that holds the rest of the content.

The value of the `putInto` attribute actually represents the `name` of the `ContentPlaceholder`, or the insertion point for our `h2` element. This means, the `h2` element will get inserted into the `ContentPlaceholder` inside the `header` section in our layout.

The `FlexCol` component, that has no `putInto` attribute specified, will be inserted into the `ContentPlaceholder` inside the `main` section in our layout. In the background, the `ContentPlaceholder` is named `body` by default, and this is used as the default insertion point for all of the content without the `putInto` attribute.


## Routes

The concept of routes is essentialy quite simple. The `Route` widget is a pure container element which renders only if the current `url` matches the assigned `route` value.

Notice that in the example below we are providing the `url` attribute from the Store using two-way data-binding that was explained in Core concepts.

Let's see how the Routes are used. 

#### app/routes/index.js
```jsx
import { Route, PureContainer, Section, Sandbox } from 'cx/widgets';
import { FirstVisibleChildLayout } from 'cx/ui'

import AppLayout from '../layout';

import Default from './default';
import About from './about';
import Dashboard from './dashboard';
import UserRoutes from './users';


export default <cx>
    <Sandbox
       key:bind="url"
       storage:bind="pages"
       outerLayout={AppLayout}
       layout={FirstVisibleChildLayout}
    >
        <Route route="~/" url:bind="url">
            <Default/>
        </Route>
        <Route route="~/about" url:bind="url">
            <About/>
        </Route>
        <Route route="~/dashboard" url:bind="url">
            <Dashboard/>
        </Route>
        <UserRoutes/>
        <Section title="Page Not Found" mod="card">
            This page doesn't exists. Please check your URL.
        </Section>
    </Sandbox>
</cx>
```

You can think of the `app/routes/index.js` as a router that determines which part of our application to show, based on the current `url`.

So in the code snippet above, we simply import the predefined layout (`AppLayout`), as well as all of the routes that are accessible from this part of the application.

We then apply our `AppLayout` to the Sandbox component, through the `outerLayout` attribute that we mentioned earlier. We are also applying the `FirstVisibleChildLayout` to our Sandbox through the `layout` attribte. 

`FirstVisibleChildLayout` is one of the predefined [inner layouts](https://docs.cxjs.io/concepts/inner-layouts) that are available in Cx, and as the name might imply, it means that Cx will explore the Sandbox's child components from top to bottom until it reaches the first one that is set to get rendered (in this case, the first Route that matches the current url). All subsequent components are ignored. In this specific case, by placing the 'Page not found' Section at the bottom of the Sandbox, we ensure it gets rendered only if none of the Routes matches the current url.

`UserRoutes` might seem a bit puzzling because it is not isnide the Route wrapper. It actually contains two seperate routes defined inside it, but they work exactly the same as all the other routes defined here.

#### app/routes/users/index.js

```jsx
import { Route } from 'cx/widgets';

import List from './List';
import Editor from './Editor';

export default <cx>
   <Route route="~/users" url:bind="url">
      <List />
   </Route>
   <Route route="~/users/:userId" url:bind="url">
      <Editor />
   </Route>
</cx>
```

### Route parameters

The parts of the `route` that start with `:` are URL parameters whose values will be parsed out and saved to the Store.

For example, the following URL `http://localhost:8088/users/1` would match the following route:

```jsx
<Route route="~/users/:userId" url:bind="url">
    ...
</Route>
```
Since we are using relative paths, the Url begins with the `~/` prefix which will automatically get replaced with the app's root url (`http://localhost:8088/`).

Inside a Controller, we could obtain the `userId` from the Store as follows:

```jsx
let userId = this.store.get('$route.userId'); // 1
```

Don't worry if this seems cryptic right now. It will come in very handy at a later point in our tutorial. 

Now that we have the necessary knowledge, we'll start making changes on our scaffold project.

### Routes setup

Among the existing routes, we'll keep the `~/dashboard`, and replace the others with `~/entry` and `~/log` routes.

#### app/routes/index.js
```jsx
import { Route, RedirectRoute, PureContainer, Section, Sandbox } from 'cx/widgets';
import { FirstVisibleChildLayout, bind } from 'cx/ui'

import AppLayout from '../layout';

import Dashboard from './dashboard';
import Entry from './entry';
import Log from './log';


export default <cx>
    <PureContainer layout={FirstVisibleChildLayout}>
        <Sandbox
            key={bind("url")}
            storage={bind("pages")}
            outerLayout={AppLayout}
            layout={FirstVisibleChildLayout}
        >
            <RedirectRoute
                route="~/"
                url={bind("url")}
                redirect="~/dashboard"
            />

            <Route route="~/entry/:id" url={bind("url")}>
                <Entry />
            </Route>

            <Route route="~/log" url={bind("url")}>
                <Log />
            </Route>

            <Route route="~/dashboard" url={bind("url")}>
                <Dashboard />
            </Route>

            <Section title="Page Not Found" mod="card">
                This page doesn't exists. Please check your URL.
            </Section>

        </Sandbox>
    </PureContainer>
</cx>
```

We import the `bind` function from `cx/ui`, so we can use functional binding sintax as described in [Core concepts](https://github.com/codaxy/cxjs-home-expenses-app-tutorial/blob/master/tutorial/core-concepts.md#two-way-data-binding-bind).

We are also using the `RedirectRoute` widget to open the Dashboard page by default. `RedirectRoute` is self-explaining: if the `route` matches the `url`, the user will be redirected to the `redirect` route.

Now we need to create the actual folders where our routes will be kept.
The easiest way is to use the `Cx CLI` tool. If you used `yarn create` to set up the project, you already have `Cx CLI` tool installed, otherwise you can install it using `yarn`:

```
yarn global add cx-cli
```
Or `npm`:
```
npm install cx-cli --global
```

Now, to set up route folders, open up the console inside the project root directory and enter the following commands:

```
cx add route entry
cx add route log
```

Your folder structure should now look like this:
<a href="https://github.com/codaxy/cxjs-home-expenses-app-tutorial/blob/master/tutorial/screenshots/add-routes-folder-structure.PNG">
    <img src="https://github.com/codaxy/cxjs-home-expenses-app-tutorial/blob/master/tutorial/add-routes-folder-structure" alt="Folder structure after adding routes" />
</a>

`cx add route entry` creates a new folder (`app/routes/entry`) and adds template files (index.js, index.scss and Controller.js) for the new route. Naturally, you can also create the files and folders manually.

Finally, don't forget to add imports for the newly created files and remove the onsed that are not needed anymore:
#### app/routes/index.scss
```
@import 'dashboard/index';
@import 'entry/index';
@import 'log/index';
```

## Links

We should also update the links in the sidebar menu. For defining links, the [`Link`](https://docs.cxjs.io/widgets/links) Widget is used. `href` attribute represents the Url to the link's target location. 

The following code-changes to the sidebar will define the links for our app and set the new sidebar header text to "Home Expenses":

```jsx
    ...
    import {ContentPlaceholder, bind} from 'cx/ui';
    ...
        <aside class="aside">
            <h1>Home Expenses</h1>
            <dl>
                <dt>
                    <Link href="~/dashboard" url={bind("url")}>
                        Dashboard
                    </Link>
                </dt>
                <dt>
                    <Link href="~/entry/new" url={bind("url")}>
                        Add Expense
                    </Link>
                </dt>
                <dt>
                    <Link href="~/log" url={bind("url")}>
                        Log
                    </Link>
                </dt>
            </dl>
        </aside>
    ...
```

We set the `url` attribute as a binding to the `'url'` value available in the Store. If `href` matches `url`, additional CSS class `active` is applied to indicate the link that is currently active.

Oh, and don't forget to change the header inside the `index.html` file:

#### app/index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
    <title>Home Expenses</title>
    <link href="https://fonts.googleapis.com/css?family=Roboto|Material+Icons:400,500,600" rel="stylesheet">
</head>
<body>
    <div id="app">
    </div>
</body>
</html>
```
