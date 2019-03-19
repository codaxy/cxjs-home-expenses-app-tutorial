## Edit entry page

* Route parameters
* Sandbox
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

        if (id == "new") return; // we'll expand this later

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

It is common practice to keep all data bindings relevant to a specific route/page as properties of the `$page` binding. This way we are effectivly creating a namespace for our page and we don't have to worry about overriding some of the existing (global) app data that is defined at the root of the state object. This is why we are saving the entry data under `$page.entry`, rather than just `entry`.

This brings us to the topic of the so-called global and local Store values. If we now click on the Edit button for one of the entries, open up a console window and expand the `app-data`, we should see something similar to the screenshot below:

<img src="https://github.com/codaxy/cxjs-home-expenses-app-tutorial/blob/master/tutorial/screenshots/global-vs-local-store-values.PNG" alt="App data object" />

We can see some Store bindings with almost random values such as `$index` and `$record`. These were created by the Grid widget in Log page. 
On the other hand, `layout` (manages the position of the sidebar) and `entries` were set by the top level layout controller (`app/layout/Controller.js`). Since they are used on every single page, it was most convenient to keep them easily accessible at the root of the state object. This also indicates that they should be treated as global app values and should not be overwritten with local page values, as this could cause errors in our app.


## Sandbox

You might be thinking we should be using a different namespace for each page (e.g. `$dashboard`, `$log`...) to avoid unintended data overwriting, and you would be right. But that's not so practical, because it imposes on us the mental burdain of making up unique names. If we had just a couple of pages, that wouldn't be so bad, but bear in mind, in this case each entry would need its own namespace! Wouldn't it be great if we could somehow bind these names to their unique identifiers, such as URLs?
That's exactly what we use the Sandbox widget for.

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
            //recordAlias="$page" // this is the default setting
        >
        ...
        </Sandbox>
    </PureContainer>
</cx>
```

Sandbox is used to isolate data between different pages. It keeps each namespace as a unique `key` under the `storage` binding, and exposes it under a temporary alias called `$page` (this is the default alias and can by changed using the `recordAlias` attribute).

<img src="https://github.com/codaxy/cxjs-home-expenses-app-tutorial/blob/master/tutorial/screenshots/sandbox-view.PNG" alt="Sandboxed data" />

In this case, Sandbox is managing our `$page` binding based on the value of the `url`, by making sure it actually points to the appropriate part of the `pages` object, which can be seen in the screenshot above (`$page` and `pages['~/entry/xo9ihsk']` are the same for the `url` equal to `~/entry/xo9ihsk`).
This way we get to consistently use `$page` as a namespace for our pages withiout worrying about unintentionally overwritting the data. Also, page data is preserved on navigation and it can be restored if the user goes back to the same page.

## Build the Form

Now we have everything we need to build a form for editing the entry:

#### app/routes/entry/index.js
```jsx
import { 
    HtmlElement, 
    DateField, 
    NumberField, 
    LookupField, 
    TextField, 
    FlexCol,
    Section
} from 'cx/widgets';

import Controller from './Controller';
import {categories} from '../../data/categories';

export default (
    <cx>
        <div controller={Controller}>
            <h2 putInto="header">Edit entry</h2>
            <Section
                mod="card"
            >
                <FlexCol>
                    <DateField
                        label="Date"
                        value-bind="$page.entry.date"
                        required
                        autoFocus
                    />

                    <NumberField
                        value-bind="$page.entry.amount"
                        label="Amount"
                        format="currency;;2"
                        placeholder="$"
                        required
                    />

                    <LookupField
                        value-bind='$page.entry.categoryId'
                        options={categories}
                        optionTextField="name"
                        label="Category"
                        required
                    />

                    <TextField
                        value-bind='$page.entry.description'
                        label="Description"
                        style="width: 100%; max-width: 500px"
                    />
                </FlexCol>
            </Section>
        </div>
    </cx>
);
```

We are using the FlexCol widget to arrange the form elements in a column. Our form consists of four widgets which are by most part self-explanatory, so we'll just go through some of the settings that could use additional elaboration: 
* [`DateField`](https://docs.cxjs.io/widgets/date-fields) - entry date,
* [`NumberField`](https://docs.cxjs.io/widgets/number-fields) - entry amount
    * `format` - displays the number as a currency (with `$` prefix), rounded to 2 decimal places
* [`LookupField`](https://docs.cxjs.io/widgets/lookup-fields) - expense category
    * `options` - list of available options, here we are passing the list of categories imported from `app/data/categories.js`
    * `optionTextField` - name of the field which holds the display text of the option,
    * `value` - Store binding where the selected option is kept, by defalut `LookupField` uses the `id` property to keep track of the selection
* [`TextField`](https://docs.cxjs.io/widgets/text-fields) - entry description

We should now be able to see a form with all of the entry data:

<img src="https://github.com/codaxy/cxjs-home-expenses-app-tutorial/blob/master/tutorial/screenshots/entry-data.PNG" alt="Entry data" />

## Form validation

Before allowing the user to save the changes, we need to make sure that all the required information has been filled in. 
We have been using the `required` attributes to define which fields are obligatory. Now we can simply use the [`ValidationGroup`](https://docs.cxjs.io/widgets/validation-groups) component 
that will check for us if the form is valid. 
`ValidationGroup` uses a `valid-bind="$page.valid"` binding to track the form state in the application `Store`. 
We can then use that value to enable/disable the `Save` Button:

```jsx
    ...
    <ValidationGroup valid={bind("$page.valid")}>
        ...
        <Button
            mod="primary"
            onClick="save"
            disabled={expr('!{$page.valid}')}
            text="Save"
        />
        ...
    </ValidationGroup>
    ...
```

After adding the `Cancel` button as well, our `index.js` file looks like this:

#### app/routes/entry/index.js
```jsx
import { 
    HtmlElement, 
    DateField, 
    NumberField, 
    LookupField, 
    TextField, 
    FlexCol,
    FlexRow,
    Section,
    ValidationGroup,
    Button
} from 'cx/widgets';

import Controller from './Controller';
import {categories} from '../../data/categories';

export default (
    <cx>
        <div controller={Controller}>
            <h2 putInto="header">Edit entry</h2>
            <Section
                mod="card"
            >
                <ValidationGroup
                    valid-bind="$page.valid"
                >
                    <FlexCol>
                        <DateField
                            label="Date"
                            value-bind="$page.entry.date"
                            required
                            autoFocus
                        />

                        <NumberField
                            value-bind="$page.entry.amount"
                            label="Amount"
                            format="currency;;2"
                            placeholder="$"
                            required
                        />

                        <LookupField
                            value-bind='$page.entry.categoryId'
                            options={categories}
                            optionTextField="name"
                            label="Category"
                            required
                        />

                        <TextField
                            value-bind='$page.entry.description'
                            label="Description"
                            style="width: 100%; max-width: 500px"
                        />

                        <br/>
                        <FlexRow spacing>
                            <Button
                                onClick="back"
                                text="Back"
                            />

                            <Button
                                mod="primary"
                                onClick="save"
                                disabled={expr('!{$page.valid}')}
                                text="Save"
                            />
                        </FlexRow>
                    </FlexCol>
                </ValidationGroup>
            </Section>
        </div>
    </cx>
);
```