import { categoryNames } from '../../../data/categories';

export function entriesSum(entries) {
    if (entries) {
        return entries.reduce((sum, e) => sum + e.amount, 0);
    }
    return 0;
}

export function toMonthly(months, e, catId) {
    let date = new Date(e.date);
    let month = date.toLocaleString('en-us', { month: "short" })
    let year = date.getFullYear();
    let id = `${month}${year}`
    let cat = months[id];
    if (cat) {
        cat.total += e.amount;
        cat.subCategory += e.categoryId === catId ? e.amount : 0;
    }
    return months;
}

// Histogram months map
export function getMonthsMap(range, catId) {
    let from = new Date(range.from);
    let to = new Date(range.to);
    let months = {};
    let month = new Date(from);
    let id, numOfDays;
    while (true) {
        if (month >= to)
            break;
        let monthName = month.toLocaleString('en-us', { month: "short" })
        let year = month.getFullYear();
        let id = `${monthName}${year}`
        numOfDays = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
        months[id] = {
            id,
            date: new Date(month),
            total: 0,
            subCategory: 0,
            width: numOfDays * 24 * 60 * 60 * 1000,
            label: `${monthName} ${year}`
        };
        if (catId) months[id].categoryName = categoryNames[catId];
        month.setMonth(month.getMonth() + 1);
    }
    return months;
}