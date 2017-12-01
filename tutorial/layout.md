# Layout

In this section we will explore the following:
* [Layout elements](#layout-elements)
* [Main layout operations](#main-layout-operations)
* [Main content and routing](#main-content-and-routing)

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

And inside a Controller, we could obtain the `userId` from the Store as follows:

```jsx
let userId = this.store.get('$route.userId'); // 1
```

Don't worry if this seems cryptic right now. It will come in very handy at a later point in our tutorial. 

Now that we have the necessary knowledge, we'll start making changes on our scaffold project.
