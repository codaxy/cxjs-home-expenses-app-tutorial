import { Controller } from 'cx/ui';
import { categoryNames } from '../../data/categories';

import { entriesSum, toMonthly, getMonthsMap } from './util';

export default class extends Controller {
   onInit() {
      // get range for current year
      let currentYear = new Date().getFullYear();
      this.store.init('range', {
         from: new Date(currentYear, 0, 1).toISOString(),
         to: new Date(currentYear + 1, 0, 1).toISOString()
      });

       this.addTrigger('$page.entries', ['entries', 'range', '$page.selectedCatId'], (entries, range, selCatId) => {
           let from = new Date(range.from);
           let to = new Date(range.to);
           let monthly = {};

           let activeEntries = (entries || []).filter(e => {
               // filter by date
               let date = new Date(e.date);
               let monthKey = date.getFullYear() * 100 + date.getMonth();
               let m = monthly[monthKey];
               if (!m)
                   m = monthly[monthKey] = {
                       total: 0,
                       catTotal: 0,
                       date: new Date(date.getFullYear(), date.getMonth(), 1).toISOString()
                   };
               m.total += e.amount;
               if (e.categoryId == selCatId)
                   m.catTotal += e.amount;

               return (date >= from && date < to);
           });

           let monthlyData = Object.keys(monthly).map(m=>monthly[m]);

           this.store.set('$page.entries', activeEntries);
           this.store.set('$page.monthlyData', monthlyData);
       }, true);

       this.addComputable('$page.pie', ['$page.entries'], (entries) => {
           let category = {};
           if (entries) {
               entries.forEach(e => {
                   let cat = category[e.categoryId];
                   if (!cat)
                       cat = category[e.categoryId] = {
                           id: e.categoryId,
                           name: categoryNames[e.categoryId],
                           amount: 0
                       };
                   cat.amount += e.amount;
               });
           }
           return Object.keys(category).map(k => category[k]);
       });

       // get total amount
       this.addComputable('$page.total', ['$page.entries'], entriesSum);

       // Expenses per subcategory
       // this.addComputable('$page.bars', ['$page.entries', '$page.selectedCatId'], (entries, catId) => {
       //     let subcats = (entries || [])
       //         .filter(e => catId ? e.categoryId === catId : true)
       //         .reduce((subcats, e) => {
       //             let cat = subcats[e.subCategoryId];
       //             if (!cat)
       //                 cat = subcats[e.subCategoryId] = {
       //                     id: e.subCategoryId,
       //                     //name: subCategoryNames[e.subCategoryId],
       //                     categoryName: categoryNames[e.categoryId],
       //                     amount: 0
       //                 };
       //             cat.amount += e.amount;
       //             return subcats;
       //         }, {});
       //
       //     return Object.keys(subcats).map(k => subcats[k]);
       // });

       // Expenses per month over time
       // this.addComputable('$page.histogram', ['$page.entries', '$page.selectedCatId', 'range'], (entries, catId, range) => {
       //     let months = (entries || [])
       //         .reduce((monthsMap, e) => toMonthly(monthsMap, e, catId), getMonthsMap(range, catId));
       //     return Object.keys(months).map(k => months[k]);
       // });
   }

   clearSelection() {
      this.store.delete('$page.selectedCatId');
   }
}