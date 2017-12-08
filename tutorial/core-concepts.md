# Core concepts

Before continuing with the application, it is useful to familiarize ourselves with core Cx concepts:
* [Application state (Store)](#application-state-store)
* [Data-binding](#data-binding)
* [Controllers](#controllers)

**TODO:** Add examples from the application to explore core concepts
* Don't forget to mention the `cx` wrappers (`<cx></cx>`).
* Show the app state in console, so we can referr to it when explaining the Sandbox

## Application state (Store)

Cx widgets are tightly connected to a central data repository called the `Store`.
* Widgets access stored data to calculate data required for rendering (data binding process).
* Widgets react on user inputs and update the Store either directly (two-way bindings) or by dispatching actions which are translated into new application state.
* Store sends change notifications which produce a new rendering of the widget tree and DOM update.

### Principles

* The state of the entire application is stored in an object tree within a single Store.
* The state is immutable. On every change, a new copy of the state is created containing the updated values.
* The only way to change the state is through Store methods or with the use of two-way data binding.

Again, don't worry if this seems too abstract at the moment. As soon as we start working with the Store in our app, we will revisit them in more depth and it will begin to make more sense what these principles actually mean, how they are enforced and why they are so important.

If you would like to know more, check out the Cx documentation for the [Store](https://docs.cxjs.io/concepts/store).

### Store initialization

The Store is initialized inside the main `index.js` file:

#### app/index.js
```
import { Store } from 'cx/data';
import { Url, History, Widget, startAppLoop, enableCultureSensitiveFormatting } from 'cx/ui';
...

//material theme
...

//store
const store = new Store();

//webpack (HMR)
...

//routing
...

//debug
...

//app loop
import Routes from './routes';

let stop = startAppLoop(document.getElementById('app'), store, Routes);
```

The Store initialization is already taken care of as part of the project scaffold, so there is nothing else we need to do, but it's good to know where and how it's done.

As we continue below, we'll explore the most common ways to use the Store inside Cx:

* through two-way data binding
* inside Controllers (store is available via this.store)
* inside event handlers (as will be shown later)

## Data-binding

Data binding is a process of connecting the application state to the UI. If the connection is successful, state changes will be reflected in the UI and user actions will be properly translated into state changes. There are multiple ways of applying data to the widgets. 
Here we'll briefly explore the ones we will be using most often. For more, check out the docs on [Data Binding](https://docs.cxjs.io/concepts/data-binding).

### Two-way Data Binding (bind)

Two-way data binding is commonly used in forms, as it supports both read and write operations. Let's use a checkbox for illustration. To display a checkbox, we need to know whether it's checked or not. That's the read operation. If the user clicks the checkbox, the corresponding value needs to be changed, and that's the write operation.

```
<Checkbox value-bind='intro.core.cb1'>Checkbox</Checkbox>
```
By appending a `-bind` suffix to the `value` property, we are basically telling Cx to create a two-way data binding between the Checkbox and the Store. In this case, instead of assigning `true` or `false` to the `value` property, we are entering a string that represents a path inside the Store where that value will be kept. 
The default value for the Checkbox state in this case would be `false`. If we want to make it `true` instead, we would need to use the functional synthax for creating a binding:

```
<Checkbox value={bind('intro.core.cb2', true)}>Checkbox</Checkbox>
```
In this example, instead of using the suffix, we are calling a `bind` function and passing it two parameters, the path, and the default value.

Another way to do this would be to assign an object literal with `bind` and `defaultValue` properties to the `value` attribute:

```
<Checkbox value={{ bind: 'intro.core.cb3', defaultValue: true }}>Checkbox</Checkbox>
```

### Data Expressions (expr)

Data expressions are string attributes that are compiled to JavaScript methods and used to calculate dynamic values at runtime. Let's add a new textfield control and use a data expression for its enabled property.

```
<TextField value-bind='intro.core.text' enabled-expr='!{intro.core.cb1}' />
```

Note that now the text field and the checkbox from the previous section are both relying on the value of `intro.core.cb1`. 

* Suffix `-expr` is used on attributes to define a data expression.

* Curly brackets denote data bindings.

* Data bindings pointing to invalid locations will be reported as undefined.

### Templates (tpl)

Templates are data expressions which return strings. They are a convenient option to avoid using both types of quotes within data expressions. Another advantage that they can be used to easily apply formatting to the output, which will be demonstrated later.

```
<TextField value-bind='intro.core.firstName' label="First Name" />
<TextField value-bind='intro.core.lastName' label="Last Name" />
<TextField value-tpl='Hello {intro.core.firstName} {intro.core.lastName}!' label="Template" mode="view" />
<TextField value-expr='"Hello "+{intro.core.firstName:s}+" "+{intro.core.lastName:s}+"!"' label="Expression" mode="view" />
```

### Computables (computable)

Computables are somewhat simillar to expressions and templates, since they also make it possible to calculate dynamic values at runtime. 

```
<div preserveWhitespace>
   <NumberField value-bind='intro.core.a' placeholder="A" />
   +
   <NumberField value-bind='intro.core.b' placeholder="B" />
   =
   <Text value={computable('intro.core.a', 'intro.core.b', (a, b) => a==null || b==null ? "ERR" : a + b )} />
</div>
```
`computable` is a function that takes in one or more Store paths and a callback function that will be called to perform a certain operation with these values, each time any one of them is changed. The callback function has to be passed in as the last parameter, and its number of arguments should be equal to the number of Store paths that are passed in before the callback function itself. In the above example, first two parameters are paths inside the Store that hold the values of `a` and `b`, and the third parameter is a callback function that will receive these two values as its arguments. The return value of that function will be the value of that `computable`.

One huge advantage of computables over expressions and templates is that we can combine them with any other external functions or variables with the use of JavaScript closure, which will be demonstrated later on in this tutorial.

## Controllers

Controllers are used to concentrate business logic required for views. This includes preparing data for rendering purposes, calculating values, reacting on changes, defining callbacks, etc. Controllers are assigned to widgets using the `controller` attribute. 

#### Controller initialization example

```
import { Controller } from "cx/ui";
import { HtmlElement } from "cx/widgets";

class SimpleController extends Controller {
  onInit() {
    this.store.set("count", 0);
  }
}

export const App = (
  <cx>
    <div controller={SimpleController}>
      Count: <span text-bind="count" />
    </div>
  </cx>
);
```
[See live example](https://fiddle.cxjs.io/?f=SufJMlDZ)

Let's quickly go through this simple example. Our `SimpleController` is created by extending the Cx Controller. Upon initialization, Cx will automatically check for and run the `onInit` method, so it is a good place to initialize application state, fetch data from an external source or set triggers and computables. 

In the example above, we are simply setting the `count` value inside the Store to zero. A reference to the Store is made available to each Controller via the `this.store` property.
We are then assigning our `SimpleController` to a `div` element, which ensures our SimpleController is initialized before the element is rendered. Inside the `div`, with the use of data-binding, we are displaying the `count` value as a simple text.

For more information and examples, check out the docs page on [Controllers](https://docs.cxjs.io/concepts/controllers).





