## Edit entry page

* Route parameters + Sandbox (edit entry example)
* Build the form (buttons, text fields, number fields, date fields, lookup fields...)
* Form validation
* Data loading
* Saving data to the store
* Explain other common Store manipulations

## Route parameters + Sandbox

For starters, let's create a page that will read the entry id froum the URL and display it on the page.

We have already configured our route earlier to read entry id from the url:

#### app/routes/index.js
```jsx
        ...
            <Route route="~/entry/:id" url-bind="url" >
                <Entry />
            </Route>
        ...
```

For a refresher on how routes work, you can revisit [this part](tutorial/layout.md#routes) of the tutorial or take a look at the [docs](https://docs.cxjs.io/concepts/router#route).

The above route will expose the entry id in the Store under the `$route.id` binding. Let's use that to get the information about the entry.

#### app/routes/entry/Controller.js

```js
import { Controller } from 'cx/ui';

export default class extends Controller {
    onInit(){
        let id = this.store.get('$route.id');
        let entries = this.store.get('entries');

        let entry = entries.find(e => e.id == id);
        if (!entry) {
            throw new Error('Entry could not be found.')
        }
        
        this.store.set('$page.entry', entry);
    }
}
```
Inside the `onInit` method, we are reading the entry id and the list of all entries from the Store. We are then finding the entry with the given id and saving it to the Store. 

### Global vs. Local Store values

It is common practice to prefix all data bindings relevant to a specific route/page with `$page.`. This way we don't have to worry about overriding some of the existing (global) app data that is defined at the root of the state object. This is why we are saving the entry data under `$page.entry`, rather than just `entry`.

This brings us to the topic of the so-called global and local Store values. If we now click on the Edit button for one of the entries, open up a console window and expand the `app-data`, we should see something similar to the screenshot below:

<img src="https://github.com/codaxy/cxjs-home-expenses-app-tutorial/blob/master/tutorial/screenshots/global-vs-local-store-values.PNG" alt="App data object" />

We can see some local Store value residues such as `$index` and `$record` from the use of Grid widget on the Log page. On the other hand, since `layout` (manages the position of the sidebar) and `entries` are used on every single page, it is most convenient to keep them easily accessible at the root of the state object. This also indicates that they should be treated as global app values and should not be overwritten with local page values, as this could cause errors in our app.



## Sandbox

Being aware about global and local Store values helps understand the Sandbox component that is used here:

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
            key-bind="url"
            storage-bind="pages"
            outerLayout={AppLayout}
            layout={FirstVisibleChildLayout}
        >
        ...
        </Sandbox>
    </PureContainer>
</cx>
```

Sandbox is used to isolate data between different pages. 
It selects a value pointed by the `key` from the `storage` object and exposes it as a new property (`$page`).

<img src="https://github.com/codaxy/cxjs-home-expenses-app-tutorial/blob/master/tutorial/screenshots/sandbox-view.PNG" alt="Sandboxed data" />

In this case, Sandbox is reading the contents from `pages['~/entry/xo9ihsk']` property and exposing it as `$page` property, which can be seen in the screenshot above.
This way page data is preserved on navigation and it can be restored if the user goes back to the same page.



#### app/routes/entry/index.js
```jsx
import { HtmlElement } from 'cx/widgets';

import Controller from './Controller';

export default <cx>
    <div controller={Controller}>
        <h2 text-bind="$route.id" />
    </div>
</cx>
```



<img src="https://github.com/codaxy/cxjs-home-expenses-app-tutorial/blob/master/tutorial/screenshots/global-vs-local-store-values.PNG" alt="Added links" />
