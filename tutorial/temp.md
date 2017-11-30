## Links

We use the [`Link`](https://docs.cxjs.io/widgets/links) Widget to define our links. `href` attribute represents the Url to the link's target location. Since we are using relative paths, the Url begins with the `~/` prefix which will in our current local setup automatically get replaced with the app's root url: `http://localhost:8088/`.

The following code-changes to the sidebar will define the links for our app and set the new sidebar header text to "Home Expenses":

```
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

We import the `bind` function from `cx/ui`, so we can use functional binding sintax as described in [Core concepts](https://github.com/codaxy/cxjs-home-expenses-app-tutorial/blob/master/tutorial/core-concepts.md#two-way-data-binding-bind).

We set the `url` attribute as a binding to the `'url'` value available in the Store. If `href` matches `url`, additional CSS class `active` is applied to indicate the link that is currently active. If you are wondering where did this `'url'` value inside the Store come from, the answer lies in this piece of code:

#### app/index.js
```
...
//routing
Url.setBaseFromScript('app.js');
History.connect(store, 'url');
...
```
The `History` module is used for working with HTML5 `pushState` navigation. It basically keeps track of the user's navigation history, which enables the use of browser's `back` and `forward` commands.

`History.connect(store, 'url');` makes sure that, as the user navigates the site, the current Url is always kept up to date with the Store value called `'url'`. Mistery solved!




Next, let's change the default header color:

#### app/layout/index.scss

```
$header-color: #0d8aee;
```

Cx uses Sass preprocessor for styling. For more info on styling Cx apps, checkout the [docs page](https://docs.cxjs.io/concepts/css).

Our app should now like like this:

<a href="https://github.com/codaxy/cxjs-home-expenses-app-tutorial/blob/master/tutorial/screenshots/add-links.PNG">
    <img src="https://github.com/codaxy/cxjs-home-expenses-app-tutorial/blob/master/tutorial/screenshots/add-links.PNG" alt="Added links" />
</a>