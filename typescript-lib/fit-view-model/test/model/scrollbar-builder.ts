import {
  Table,
  asTableRows,
  asTableCols,
  createTable,
} from 'fit-core/model/index.js';
import { TableViewer, createTableViewer } from 'fit-core/view-model/index.js';

import {
  VirtualScroller,
  VerticalScrollbar,
  HorizontalScrollbar,
} from '../../dist/model/table-scroller/fit-scrollbar.js';

export type ScrollbarType = 'vertical' | 'horizontal';

export class ScrollbarBuilder {
  private viewport = 0;
  private numberOfTableLines = 0;
  private tableLineDimensions: Map<number, number> = new Map();

  constructor(private readonly type: ScrollbarType = 'vertical') {}

  public setViewport(viewport = 0): this {
    this.viewport = viewport;
    return this;
  }

  public setNumberOfTableLines(numberOfLines = 0): this {
    this.numberOfTableLines = numberOfLines;
    return this;
  }

  public setTableLineDimension(lineId: number, dimension: number): this {
    this.tableLineDimensions.set(lineId, dimension);
    return this;
  }

  public build(): VirtualScroller {
    return this.createScrollbar();
  }

  private createTable(): Table {
    const table: Table = createTable().setNumberOfRows(1).setNumberOfCols(1);
    if (this.type === 'vertical') {
      table.setNumberOfRows(this.numberOfTableLines);
      this.tableLineDimensions.forEach(
        (height: number, rowId: number): void => {
          asTableRows(table)?.setRowHeight(rowId, height);
        }
      );
    } else {
      table.setNumberOfCols(this.numberOfTableLines);
      this.tableLineDimensions.forEach((width: number, colId: number): void => {
        asTableCols(table)?.setColWidth(colId, width);
      });
    }
    return table;
  }

  private createScrollbar(): VirtualScroller {
    const table: Table = this.createTable();
    const tableCache: TableViewer = createTableViewer(table);
    const scrollbar: VirtualScroller =
      this.type === 'vertical'
        ? new VerticalScrollbar(tableCache)
        : new HorizontalScrollbar(tableCache);
    scrollbar.setViewport(this.viewport);
    return scrollbar;
  }
}
