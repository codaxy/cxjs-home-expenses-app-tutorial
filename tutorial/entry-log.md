# Entry log page - simple grid showing all of the entries

* Grid widget   
* Connect view components to the store

In this part of the tutorila we will generate fake data for our app and display it in a table.

<a href="https://github.com/codaxy/cxjs-home-expenses-app-tutorial/blob/master/tutorial/screenshots/log.PNG">
    <img src="https://github.com/codaxy/cxjs-home-expenses-app-tutorial/blob/master/tutorial/screenshots/log.PNG" alt="Log page" />
</a>


## Fake data generator

First, let's add the list of expenses categories to the `data` folder:

#### app/data/categories.js
```
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
```

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

To avoid generating a new set of entries every time we use the app, We'll use `localstorage` to save the data between sessions. For this purpose, we'll add the two helper functions just below the data generator:

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

`loadBudgetEntries` function first checks if there are already saved entries in the browser's `localstorage`, before executing the data generator and returning the data.

`saveBudgetEntries` receives the the new or changed entries and saves them to the `localstorage`. This function will be called each time we make a change to to the list of entries (remove or change some of the existing, or add new ones to the list).

## Grid widget

