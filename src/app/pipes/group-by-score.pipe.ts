import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'groupByScore',
  standalone: true,
  pure: false,
})
export class GroupByScorePipe implements PipeTransform {

  transform(value: any) {
    const items: any[] = [];
    const groupedElements: any = {};

    value.forEach((obj: any) => {
      let scoreValue = obj["score"];
      if (!(scoreValue in groupedElements)) {
        groupedElements[scoreValue] = [];
      }
      groupedElements[scoreValue].push(obj);
    });

    const sortedKeys = Object.keys(groupedElements).sort((a, b) => Number(b) - Number(a));

    sortedKeys.forEach((key) => {
      items.push({
        key: key,
        list: groupedElements[key],
      });
    });

    return items;
  }

}
