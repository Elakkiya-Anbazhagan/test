/* tslint:disable */
import { NgModule } from '@angular/core';

export { SelectGuruOptionData, SelectGuruTemplateFunction } from '../interface/ISelect';
import { SelectGuruComponent } from './select.guru.component';

@NgModule({
    declarations: [SelectGuruComponent],
    exports: [SelectGuruComponent]
})
export class SelectGuruModule { }
