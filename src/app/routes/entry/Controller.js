import { Controller, History } from 'cx/ui';
import { append, updateArray } from 'cx/data';
import uid from 'uid';

export default class extends Controller {
    onInit() {
        const id = this.store.get('$route.id');

        this.addTrigger('load', ['entries'], entries => {

            let entry;
            if (id == 'new') {
                entry = {
                    date: new Date().toISOString()
                };
            } else if (entries) {
                entry = entries.find(e => e.id == id);
                if (!entry) {
                    throw new Error('Entry could not be found.')
                }
            }

            this.store.set('$page.entry', entry);
        }, true);
    }

    save() {
        const id = this.store.get('$route.id');

        let entry = this.store.get('$page.entry');

        if (id == 'new') {
            this.store.update('entries', append, {
                ...entry,
                id: uid()
            });
        }
        else {
            this.store.update('entries', updateArray, e => entry, e => e.id == id);
            History.pushState(null, '', '~/log');
        }
    }

    back() {
        let id = this.store.get('$route.id');
        if (id == 'new')
            this.store.delete('$page.entry.categoryId');
        else window.history.back();
    }

    selectCategory(e, {store}) {
        let catId = store.get('$record.id');
        this.store.set('$page.entry.categoryId', catId);
    }
}


