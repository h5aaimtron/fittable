import { Component, Input } from '@angular/core';

import { CssStyle } from 'fittable-core/model';
import {
  ViewModel,
  CellSelectionRanges,
  CellSelectionListener,
} from 'fittable-core/view-model';

import { TableCommon } from '../common/table-common.model';

@Component({
  selector: 'fit-table-left-top-corner',
  templateUrl: './table-left-top-corner.component.html',
  styleUrls: [
    '../common/css/table-common.css',
    './table-left-top-corner.component.css',
  ],
})
export class TableLeftTopCornerComponent extends TableCommon {
  @Input() override viewModel!: ViewModel;
  @Input() cellSelectionListener?: CellSelectionListener;

  public readonly getTableOffset = (): CssStyle =>
    this.viewModel.mobileLayout.pageHeaderOffset;

  public readonly getCellSelectionRanges = ():
    | CellSelectionRanges
    | undefined => this.viewModel.cellSelection?.pageHeader;

  public readonly getCellSelectionRectangles = (): CssStyle[] =>
    this.viewModel.mobileLayout.pageHeaderSelectionRectangles;
}
