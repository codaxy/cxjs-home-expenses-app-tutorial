import { Controller } from 'cx/ui';
import { categoryNames } from '../../data/categories';

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
           let monthly = {}, total = 0;

           let activeEntries = (entries || []).filter(e => {
               // filter by date
               let date = new Date(e.date);
               let monthKey = date.getFullYear() * 100 + date.getMonth();
               let m = monthly[monthKey];
               if (!m) {
                   let monthDate = new Date(date.getFullYear(), date.getMonth(), 1);
                   let nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
                   m = monthly[monthKey] = {
                       total: 0,
                       catTotal: 0,
                       date: monthDate.toISOString(),
                       width: nextMonth.getTime() - monthDate.getTime()
                   };
               }
               m.total += e.amount;
               if (e.categoryId == selCatId)
                   m.catTotal += e.amount;

               let active = (date >= from && date < to);
               if (active)
                   total += e.amount;

               return active;
           });

           let monthlyData = Object.keys(monthly).map(m=>monthly[m]);

           this.store.set('$page.entries', activeEntries);
           this.store.set('$page.monthlyData', monthlyData);
           this.store.set('$page.total', total);
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
   }

   clearSelection() {
      this.store.delete('$page.selectedCatId');
   }
}