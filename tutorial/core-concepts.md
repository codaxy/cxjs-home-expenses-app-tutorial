# Core concepts

Before continuing with the application, it is useful to familiarize ourselves with core Cx concepts:
* Application state (Store)
* Data-binding
* Controllers


## Application state (Store)

Cx widgets are tightly connected to a central data repository called the `Store`.
* Widgets access stored data to calculate data required for rendering (data binding process).
* Widgets react on user inputs and update the Store either directly (two-way bindings) or by dispatching actions which are translated into new application state.
* Store sends change notifications which produce a new rendering of the widget tree and DOM update.

### Principles

* The state of the entire application is stored in an object tree within a single Store.
* The state is immutable. On every change, a new copy of the state is created containing the updated values.
* The only way to change the state is through Store methods or with the use of two-way data binding.

### Store initialization

The Store is initialized inside the main `index.js` file:

#### app/index.js
```
import { Store } from 'cx/data';
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


## Data-binding


## Controllers

