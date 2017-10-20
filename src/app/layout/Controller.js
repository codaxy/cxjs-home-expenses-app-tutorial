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
