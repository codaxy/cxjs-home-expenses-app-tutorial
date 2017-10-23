import { Route, RedirectRoute, PureContainer, Section, Sandbox } from 'cx/widgets';
import { FirstVisibleChildLayout, bind, expr } from 'cx/ui'

import AppLayout from '../layout';

import Dashboard from './dashboard';
import Entry from './entry';
import Log from './log';


export default <cx>
    <PureContainer layout={FirstVisibleChildLayout}>
        <Sandbox
            key={bind("url")}
            storage={bind("pages")}
            outerLayout={AppLayout}
            layout={FirstVisibleChildLayout}
        >
            <RedirectRoute
                route="~/"
                url={bind("url")}
                    redirect="~/log"
            />

            <Route route="~/entry/:id" url={bind("url")}>
                <Entry />
            </Route>

            <Route route="~/log" url={bind("url")}>
                <Log />
            </Route>

            <Route route="~/dashboard" url={bind("url")}>
                <Dashboard />
            </Route>

            <Section title="Page Not Found" mod="card">
                This page doesn't exists. Please check your URL.
            </Section>

        </Sandbox>
    </PureContainer>
</cx>

