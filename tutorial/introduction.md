# Introduction

Here is a quick introduction to our tutorial
* What are we going to build
* Data model
* Fake data

## What are we going to build

We are going to build a simple app that helps keep track of home expenses. The app consists of three pages: Each expense is assigned to an appropriate category. 

In this process, we will explore some of the most frequently used Cx features and components. After finishig this tutorial, you should be able to create some medium complex Cx applications and it should serve as a solid fondation to further improve your knowledge.

Cx features covered in this tutorial:
* Layouts
* Routing
* Application state management (Store)

Some of the Cx components covered in this tutorial:
* Forms
    * TextField
    * DateField
    * LookupField
    * MonthField
    * NumberField
    * ValidationGroup
* Button
* Link
* Grid
* Charts
    * PieChart
    * Rows
    * Columns
    * Legend

The app was made using Cx material theme and out of the box components, with minimum effort, but enogh to explore styling workflow.

Here are a couple of screenshots of our finished app with descriptions.

<a href="https://github.com/codaxy/cxjs-home-expenses-app-tutorial/blob/master/tutorial/screenshots/dashboard.PNG">
    <img src="https://github.com/codaxy/cxjs-home-expenses-app-tutorial/blob/master/tutorial/screenshots/dashboard.PNG" alt="Dashboard" />
</a>

Dashboard


<a href="https://github.com/codaxy/cxjs-home-expenses-app-tutorial/blob/master/tutorial/screenshots/add-expense.PNG">
    <img src="https://github.com/codaxy/cxjs-home-expenses-app-tutorial/blob/master/tutorial/screenshots/add-expense.PNG" alt="Add expense" />
</a>

Log

## Data model

The entries are stored as an array of objects with its properties holding the entry information: 

```
entries = [
    {
        id: "99yu38b",
        date: "2017-06-22T17:17:57.442Z",
        amount: 17.39,
        categoryId: "home",
        description: "Lorem ipsum dolor sit amet."
    },
    {
        id: "21uvm14"
        date: "2017-07-21T14:24:37.490Z",
        amount: 31.54,
        categoryId: "health",
        description: "Lorem ipsum dolor sit amet."
    },
    ...
];
```

This model lets us easilty perform queris and filter entries by different parameters (category, date, amount...).
The categories will be stored in a seperate array, inside `./src/app/data/categories.js`:

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

## Fake data

For testing purposes, we will use a function that generates an array of 1000 fake entries, randomly picking a category, an amount and a date within the last year. `uid` package is used to generate uniqe ids. 

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