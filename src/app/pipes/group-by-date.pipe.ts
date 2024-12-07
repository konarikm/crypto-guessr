import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'groupByDate',
  standalone: true,
  pure: false,
})
export class GroupByDatePipe implements PipeTransform {

  transform(value: any) {
    const items: any[] = [];
    const groupedElements: any = {};
    value.forEach((obj: any) => {
      let dateValue = obj["date"].toISOString().split("T")[0];
      if (!(dateValue in groupedElements)) {
        groupedElements[dateValue] = [];
      }
      groupedElements[dateValue].push(obj);
    });
    for (let prop in groupedElements) {
      // console.log(prop);
      if (groupedElements.hasOwnProperty(prop)) {
        items.push({
          key: prop,
          list: groupedElements[prop],
        });
      }
    }
    // console.log(items)
    return items;
  }

}
