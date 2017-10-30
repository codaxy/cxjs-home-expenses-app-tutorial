import { Controller } from 'cx/ui';

export default class extends Controller {
    onInit() {

    }

    remove(e, {store}) {
        let id = store.get('$record.id');

        this.store.update('entries', entries => entries.filter(e => e.id !== id));
    }
}