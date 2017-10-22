import {HtmlElement, Link, LookupField} from 'cx/widgets';
import {ContentPlaceholder, bind} from 'cx/ui';
import Controller from "./Controller";

export default <cx>
   <div
      controller={Controller}
      class={{
         "layout": true,
         "nav": {bind: "layout.aside.open"}
      }}
   >
      <main class="main" onMouseDownCapture="onMainClick">
         <ContentPlaceholder />
      </main>
      <header class="header">
         <i
            class={{
               hamburger: true,
               open: {bind: 'layout.aside.open'}
            }}
            onClick={(e, {store}) => {
               store.toggle('layout.aside.open');
            }}
         />
         <ContentPlaceholder name="header"/>
         <div style="flex: 1;" />
      </header>
      <aside class="aside">
         <h1>Home Expenses</h1>
         <dl>
            <dt>
               <Link href="~/dashboard" match="prefix" url={bind("url")}>
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
   </div>
</cx>
