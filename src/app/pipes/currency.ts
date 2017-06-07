import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: "mycurrency"
})
export class Currency implements PipeTransform {
    
    transform(value: string): string {
        if (value == 'bob') {
            return 'Bs.'
        }
        return 'US$';
    }
}