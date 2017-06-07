import { Directive, ElementRef, Input } from '@angular/core';

/*
  Generated class for the Hightlight directive.

  See https://angular.io/docs/ts/latest/api/core/index/DirectiveMetadata-class.html
  for more info on Angular 2 Directives.
*/
@Directive({
  selector: '[hightlight]' // Attribute selector
})
export class Hightlight {

  @Input() hightlightColor: string;

  constructor(el: ElementRef) {
    console.log('Hello Hightlight Directive: ');
    el.nativeElement.style.backgroundColor = 'orange';
    console.log(this.hightlightColor);
  }
}
