# Entry log page - simple grid showing all of the entries
  
* Fake data generator
* Loading data to the Store
* Grid widget


In this part of the tutorila we will generate fake data for our app and display it in a table.

<a href="https://github.com/codaxy/cxjs-home-expenses-app-tutorial/blob/master/tutorial/screenshots/log.PNG">
    <img src="https://github.com/codaxy/cxjs-home-expenses-app-tutorial/blob/master/tutorial/screenshots/log.PNG" alt="Log page" />
</a>


## Fake data generator

First, let's add the list of expense categories to the `data` folder:

#### app/data/categories.js
```js
export const categories = [
    {
        id: 'children',
        name: 'Children'
    }, {
        id: 'debt',
        name: 'Debt'
    }, {
        id: 'education',
        name: 'Education'
    }, {
        id: 'entertainment',
        name: 'Entertainment'
    }, {
        id: 'gifts',
        name: 'Gifts'
    }, {
        id: 'health',
        name: 'Health/medical'
    }, {
        id: 'home',
        name: 'Home'
    }, {
        id: 'insurance',
        name: 'Insurance'
    }, {
        id: 'pets',
        name: 'Pets'
    }, {
        id: 'tech',
        name: 'Technology'
    }, {
        id: 'transportation',
        name: 'Transportation'
    }, {
        id: 'travel',
        name: 'Travel'
    }, {
        id: 'utilites',
        name: 'Utilities'
    },
];

export const categoryNames = {};

categories.forEach(c => {
    categoryNames[c.id] = c.name;
});
```
Here we are simply making category names available both as an array of objects and as an object map. This way we can use the array when we need to iterate over the category list and the object map when we need to get the category name based on its `id`. 

Next, inside the same folder, add the fake data generator:

#### app/data/entries.js
```js
import uid from 'uid';
import {categories} from './categories';

function generateDummyData() {
    let endDate = Date.now();
    let data = Array.from({length: 1000}, () => ({
        id: uid(),
        date: new Date(endDate - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        amount: Number((Math.random() * 100).toFixed(2)),
        categoryId: categories[Math.floor(Math.random() * categories.length)].id,
        description: 'Lorem ipsum dolor sit amet.'
    }));
    return data;
}
```
As we mentioned in the introduction, the fake data generator uses `uid` package to generate unique entry ids, so now is a good time to install it. Open up a console inside the folder where `package.json` is saved and enter the following:
```
yarn add uid
```

To avoid generating a new set of entries every time we use the app, we'll use `localstorage` to save the data between sessions. For this purpose, we'll add the two helper functions just after the data generator:

#### app/data/entries.js
```js
import uid from 'uid';
import {categories} from './categories';

function generateDummyData() {
    let endDate = Date.now();
    let data = Array.from({length: 1000}, () => ({
        id: uid(),
        date: new Date(endDate - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        amount: Number((Math.random() * 100).toFixed(2)),
        categoryId: categories[Math.floor(Math.random() * categories.length)].id,
        description: 'Lorem ipsum dolor sit amet.'
    }));
    saveBudgetEntries(data);
    return data;
}

export function loadBudgetEntries() {
    let data = JSON.parse(localStorage.homeBudgetEntries || '[]');
    if (data.length > 0)
        return data;

    return generateDummyData();
}

export function saveBudgetEntries(entries) {
    localStorage.homeBudgetEntries = JSON.stringify(entries);
}
```

`loadBudgetEntries` function first checks if there are already saved entries in the browser's `localstorage`, before calling the data generator and returning the data.

`saveBudgetEntries` receives the the updated list of entries and saves it to the `localstorage`. This function will be called each time we make a change to to the list of entries (remove or change some of the existing, or add new entries to the list).

## Loading data to the Store

The commont use pattern in Cx is to use one of the Controllers to load the data into the Store and then to have widgets access it thorugh data binding.

Since we are going to use the entries list in all parts of the application, it makes sense to load the data inside a top level Controller, that will be initialized as soon as the app is loaded.

In our case, the Controller inside the `layout` folder is the top level controller in our app, so we load the data in its `onInit` method:

### app/layout/Controller.js
```jsx
import { Controller } from 'cx/ui';
import { loadBudgetEntries, saveBudgetEntries } from '../data/entries';

export default class extends Controller {
    onInit() {
        this.store.init("layout.aside.open", window.innerWidth >= 800);

        this.addTrigger('navigation', ['url'], () => {
            if (window.innerWidth < 800)
                this.store.set('layout.aside.open', false);
        });

        this.store.init('entries', loadBudgetEntries());
        this.addTrigger('entries', ['entries'], saveBudgetEntries);
    }

    onMainClick(e, {store}) {
        if (window.innerWidth < 800)
            store.set('layout.aside.open', false);
    }
}
```
In the code snippet above, we import `loadBudetEntries` and `saveBudgetEntries` functions so we can call them in our Controller. Inside the `onInit` method, we use the `Store.init` method to load the entries into the Store, under the `entries` binding. 

Finally, we add a trigger that will monitor the `entries` inside the Store, and each time they are modified, it will call the `saveBudgetEntries` function, passing it the new `entries` as an argument.

Now if we start our app with `yarn start` and open up the browser console, we should see inside the `app-data` that our entries have been loaded successfully:

<a href="https://github.com/codaxy/cxjs-home-expenses-app-tutorial/blob/master/tutorial/screenshots/entries-loaded.PNG">
    <img src="https://github.com/codaxy/cxjs-home-expenses-app-tutorial/blob/master/tutorial/screenshots/entries-loaded.PNG" alt="Console screenshot" />
</a>


## Grid widget

Once we have our data source ready, we can proceed with creating a table to display it. 

#### app/routes/log/index.js

```jsx
import { HtmlElement, Grid, Section } from 'cx/widgets';
import { computable } from 'cx/ui';
import {categoryNames} from '../../data/categories';

export default <cx>
    <h2 putInto="header">Log</h2>
    <Section
        mod="card"
        style="height: 100%"
        bodyStyle="display: flex; flex-orientation: column"
    >
        <Grid
            records-bind="entries"
            lockColumnWidths
            scrollable
            buffered
            style="flex: 1 0 0%"
            columns={[
                {
                    field: 'date',
                    header: 'Date',
                    format: 'date',
                    sortable: true
                },
                {
                    field: 'description',
                    header: 'Description',
                    style: 'width: 50%'
                },
                {
                    header: 'Category',
                    sortable: true,
                    value: computable("$record.categoryId", id => categoryNames[id])
                },
                {
                    field: 'amount',
                    header: 'Amount',
                    format: "currency;;2",
                    align: 'right',
                    sortable: true
                }
            ]}
        />
    </Section>
</cx>
```

Let's analyse the code above. As mentioned earlier, the `putInto` property in `h3` widget tells Cx to place that widget inside the `header` area in our application layout.
We are using a Section widget with `mod` property set to `card`. That means the Section widget will be assigned the `cxm-card` css class which is predefined for the material theme. This will apply borders and shadows to the Section widget and give it a more distinctive look. Also, notice how we are defining both `style` and `bodyStyle` properties. As explained in [Cx docs](https://docs.cxjs.io/widgets/sections#configuration), `style` rules will be applied to the wrapper div and `bodyStyle` to the body of the Section widget.

To see how each of the mentioned properties actually affect the look of the Section widget, simply comment them out one at the time and observe the changes. 

Grid widget is pretty straight-forward to use. We'll go through the list of properties we are using:
* `records` - Store binding for the list of entries.
* `scrollable` - Set to true to add a vertical scroll and a fixed header to the grid. Scrollable grids shoud have height or max-height set. Otherwise, the grid will grow to accomodate all rows.
* `buffered` - Set to true to render only visible rows on the screen. This greatly improves performance for grids with a lot of data. Works only if the grid is scrollable.
* `lockColumnWidths` - When set to true, column widths are locked after the first render. This is useful when we are buffering the records, since the Grid would constantly adjust column widths to the records currently in the buffer, which would cause it to twitch while scrolling. Comment this property out to see for yourself.
* `style` - By applying `flex: 1 0 0%` rure, we ensure the Grid will take up the available screen height.
* `columns` - An array of configuration objects that define the columns for the Grid. Below we'll go through the column properties used and explain what they do:
    * `field` - Name of the property inside the record to be displayed. Used for displaying or sorting.
    * `header` - Text to be shown in the column header.
    * `format` - Template used to format the value. Cx offers rich support for value formatting. Here we are applying the currency format, which means all the values will be prefixed with a dollar sign and rounded to two decimal places. To learn more about the formatting rules, check the [docs](https://docs.cxjs.io/concepts/formatting#formatting).
    * `sortable` - Set to true if the column is sortable.
    * `value` - Column value to be displayed. By default, this is the value contained in the record field. The `field` property is not necessary when using the `value` property. Since our entries don't store the actual category names, but rather their ids, this enables us to use the `computable` function and get the category name from the `categoryNames` map.
    
The above example shows how `computable` utility function enables us to use local variables in combination with the values from the Store, which would not be possible if we used expressions or templates.
First argument for the `computable` function is the binding under which our category id is available (`$record.categoryId`). As the Grid widget iterates through the list of records, each record is made available inside the Store under that record alias (`$record`). It is interesting to notice how we can use the dot notation to acces just a single field within the record. This line does the same: 

`computable("$record", entry => categoryNames[entry.categoryId ? entry.categoryId : undefined])`

As you can see, when using the dot notation withind the binding, we get free safety checks against undefined property errors (for any depth level!), which is a really cool Cx feature.

A complete list of available Grid and Column properties can be found [here](https://docs.cxjs.io/widgets/grids#configuration).


There is one more thing we need to do to complete this part of the tutorial. To support minimal application shells, culture-sensitive number and date formats are not automatically registered. Formatting is auto-enabled if `NumberField`, `DateField` or any other culture dependent widget is used, otherwise it needs to be enabled using the `enableCultureSensitiveFormatting`:

#### app/index.js

```jsx
import { HtmlElement, Grid, Section } from 'cx/widgets';
import { computable, enableCultureSensitiveFormatting } from 'cx/ui';
import {categoryNames} from '../../data/categories';

enableCultureSensitiveFormatting();

export default <cx>
    <h2 putInto="header">Log</h2>
    <Section
        mod="card"
        style="height: 100%"
        bodyStyle="display: flex; flex-orientation: column"
    >
...
```
**Note:** If culture sensitive formatting is used in more than one part of the application, we can also place the `enableCultureSensitiveFormatting` call into the main index file (`app/index.js`).

Our Log page should now look something like this:

<a href="https://github.com/codaxy/cxjs-home-expenses-app-tutorial/blob/master/tutorial/screenshots/basic-grid.PNG">
    <img src="https://github.com/codaxy/cxjs-home-expenses-app-tutorial/blob/master/tutorial/screenshots/basic-grid.PNG" alt="Grid showing list of entries" />
</a>

## Adding custom widgets to Grid rows

In order to be able to edit and remove a single entry, we need to add Actions column to the Grid. Inside it, we'll place two buttons: Edit and Remove. Let's examine the code for that:

#### app/routes/log/index.js
```jsx
import { HtmlElement, Grid, Section, Button, LinkButton } from 'cx/widgets';
import { computable, enableCultureSensitiveFormatting } from 'cx/ui';
import { enableMsgBoxAlerts } from 'cx/widgets';
import { categoryNames } from '../../data/categories';

import Controller from './Controller';

enableCultureSensitiveFormatting();
enableMsgBoxAlerts();

export default <cx>
    <h2 putInto="header">Log</h2>
    <Section
        mod="card"
        style="height: 100%"
        bodyStyle="display: flex; flex-orientation: column"
    >
        <Grid
            records-bind="entries"
            lockColumnWidths
            scrollable
            buffered
            style="flex: 1 0 0%"
            columns={[
                {
                    field: 'date',
                    header: 'Date',
                    format: 'date',
                    sortable: true
                },
                {
                    field: 'description',
                    header: 'Description',
                    style: 'width: 50%'
                },
                {
                    header: 'Category',
                    sortable: true,
                    value: computable("$record.categoryId", id => categoryNames[id])
                },
                {
                    field: 'amount',
                    header: 'Amount',
                    format: "currency;;2",
                    align: 'right',
                    sortable: true
                },
                {
                    header: 'Actions',
                    align: 'center',
                    items: <cx>
                        <LinkButton mod="hollow" href-tpl="~/entry/{$record.id}">
                            Edit
                        </LinkButton>
                        <Button mod="hollow" 
                            onClick="remove"
                            confirm="Are you sure you want to delete this entry?">
                            Remove
                        </Button>
                    </cx>
                }
            ]}
        />
    </Section>
</cx>
```

For the Actions column, instead of `value` and `field`, we are using the `items` property to define the column content. Here we can define a custom widget tree enclosed inside the pair of `cx` tags. This allows easy composition of other Cx widgets within the Grid row. 

Here we are using a `LinkButton` for the Edit action and a `Button` widget for the Remove action.
The `LinkButton` requires a `href` property containing the target URL. In this case, we are using a template to define a custom URL for each entry. We have yet to create a target route for these URLs.

As for the Button widget, we are passing the name of the `Controller` method as an `onClick` property. In order for this to work, there are two things we need to do:
* import the Controller and pass it to one of the parent components so it gets initilized.
* define the `remove` method inside the Controller.

We already have a Controller created and imported as part of the route template. Now we just need to pass it to the `Section` widget:

#### app/routes/log/index.js
#### app/routes/log/index.js
```jsx
import { HtmlElement, Grid, Section, Button, LinkButton } from 'cx/widgets';
import { computable, enableCultureSensitiveFormatting } from 'cx/ui';
import { enableMsgBoxAlerts } from 'cx/widgets';
import { categoryNames } from '../../data/categories';

import Controller from './Controller';

enableCultureSensitiveFormatting();
enableMsgBoxAlerts();

export default <cx>
    <h2 putInto="header">Log</h2>
    <Section
        mod="card"
        style="height: 100%"
        bodyStyle="display: flex; flex-orientation: column"
        controller={Controller}
    >
    ...
```

 and define the `remove` method inside it:

```js
import { Controller } from 'cx/ui';

export default class extends Controller {
    onInit() {

    }

    remove(e, {store}) {
        let id = store.get('$record.id');

        this.store.update('entries', entries => entries.filter(e => e.id !== id));
    }
}
```


