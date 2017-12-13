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

That means the entry id will be exposed in Store under the `$route.id` binding.

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



<img src="https://github.com/codaxy/cxjs-home-expenses-app-tutorial/blob/master/tutorial/screenshots/add-links.PNG" alt="Added links" />
