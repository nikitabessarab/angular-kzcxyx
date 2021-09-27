import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'my-app',
  template: `
    <p>Custom values are <strong>enabled</strong>. Type a custom value.</p>
    <p>MultiSelect value: {{ sizes|json }}</p>

    <kendo-multiselect
        [allowCustom]="true"
        [data]="listItems"
        textField="text"
        valueField="value"
        [valueNormalizer]="valueNormalizer"
        [(ngModel)]="sizes"
        [kendoDropDownFilter]="dropDownFilterSettings"
    >
    </kendo-multiselect>
  `,
})
export class AppComponent {
  public listItems: Array<{ text: string; value: number }> = [
    { text: 'Small', value: 1 },
    { text: 'Medium', value: 2 },
    { text: 'Large', value: 3 },
  ];

  public dropDownFilterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };

  public sizes: Array<{ text: string; value: number }> = [
    { text: 'Medium', value: 2 },
  ];

  /*
        The component will emit custom text, which is typed by the user, and pass it to the `valueNormalizer` method.
        You can process the custom text, create a single custom object that represents the normalized value,
        and pass it back wrapped as an Observable.

        This example uses the `map` operator to transform text into a normalized value object.

        For more information on the `map` operator, refer to
        http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-map
    */
  public valueNormalizer = (text$: Observable<string>) =>
    text$.pipe(
      map((text: string) => {
        // search for matching item to avoid duplicates

        // search in values
        const matchingValue: any = this.sizes.find((item: any) => {
          return item['text'].toLowerCase() === text.toLowerCase();
        });

        if (matchingValue) {
          return matchingValue; // return the already selected matching value and the component will remove it
        }

        // search in data
        const matchingItem: any = this.listItems.find((item: any) => {
          return item['text'].toLowerCase() === text.toLowerCase();
        });

        if (matchingItem) {
          return matchingItem;
        } else {
          return {
            value: Math.random(), // generate unique value for the custom item
            text: text,
          };
        }
      })
    );
}
