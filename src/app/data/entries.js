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