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

import { categoryNames } from '../../data/categories';

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
                }
            ]}
        />
    </Section>
</cx>
```

Let's analyse the code above. As mentioned earlier, the `putInto` property in `h3` widget tells Cx to place that widget inside the `header` area in our application layout.
We are using a Section widget with `mod` property set to `card`. That means the Section widget will be assigned the `cxm-card` css class which is predefined for the material theme. This will apply borders and shadows to the Section widget and give it a more distinctive look. Notice how we are defining both `style` and `bodyStyle` properties. As explained in [Cx docs](https://docs.cxjs.io/widgets/sections#configuration), `style` rules will be applied to the wrapper div and `bodyStyle` to the body of the Section widget.
To see how each of the mentioned properties actually affect the look of the Section widget, simply comment them out one at the time, and observe the changes. It's much more effective then to bore you with long textual explenations.

Grid widget is pretty straight-forward to use. We pass it the list of entries via a Store binding, and define the columns that will be shown.

