# Entry log page - simple grid showing all of the entries

* Grid widget   
* Fake data generator
* Loading data to the Store
* Connect view components to the store

In this part of the tutorila we will generate fake data for our app and display it in a table.

<a href="https://github.com/codaxy/cxjs-home-expenses-app-tutorial/blob/master/tutorial/screenshots/log.PNG">
    <img src="https://github.com/codaxy/cxjs-home-expenses-app-tutorial/blob/master/tutorial/screenshots/log.PNG" alt="Log page" />
</a>


## Fake data generator

First, let's add the list of expenses categories to the `data` folder:

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
```
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

The commont use pattern in Cx is to use one of the Controllers to load the data into the Store and then to have widgets access it though data binding.

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

Now if we start our app with `yarn start` and open up the browser console, we should see inside the `app-data` that our entries have been loaded successfully:

<a href="https://github.com/codaxy/cxjs-home-expenses-app-tutorial/blob/master/tutorial/screenshots/entries-loaded.PNG">
    <img src="https://github.com/codaxy/cxjs-home-expenses-app-tutorial/blob/master/tutorial/screenshots/entries-loaded.PNG" alt="Console screenshot" />
</a>



## Grid widget

Once we have our data source ready, we can proceed with creating a table to display it. First we'll just display the data, and then we'll add `Edit` and `Remove` actions.

```jsx
import {HtmlElement, Grid, Button, LinkButton, Section} from 'cx/widgets';
import {computable} from 'cx/ui';

import {categoryNames} from '../../data/categories';

export default <cx>
    <h2 putInto="header">Log</h2>
    <Section
        mod="card"
        controller={Controller}
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
                    field: 'categoryId',
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