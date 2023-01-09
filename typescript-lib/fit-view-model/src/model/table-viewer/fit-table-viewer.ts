import {
  DoubleKeyMap,
  incrementLetter,
  incrementNumber,
  RangeIterator,
} from 'fit-core/common/index.js';
import {
  Value,
  Table,
  asTableColumnHeader,
  asTableRowHeader,
  Cell,
  asCellStyle,
  asTableStyles,
  Style,
  TableRows,
  TableColumns,
  TableRowHeader,
  TableColumnHeader,
  TableMergedRegions,
  asTableRows,
  asTableColumns,
  asTableMergedRegions,
  Column,
  asColumnWidth,
  Row,
  asRowHeight,
  MergedRegion,
} from 'fit-core/model/index.js';
import {
  getViewModelConfig,
  TableViewer,
  TableViewerFactory,
  ViewModelConfig,
} from 'fit-core/view-model/index.js';

export class FitTableViewer implements TableViewer {
  private width?: number;
  private height?: number;
  private rowPositions?: number[];
  private columnPositions?: number[];
  private rowSpans?: DoubleKeyMap<number>;
  private colSpans?: DoubleKeyMap<number>;
  private hiddenCells?: DoubleKeyMap<boolean>;

  private config: ViewModelConfig;
  private rowTable?: TableRows;
  private columnTable?: TableColumns;
  private rowHeaderTable?: TableRowHeader;
  private columnHeaderTable?: TableColumnHeader;
  private mergedRegionsTable?: TableMergedRegions;

  constructor(public readonly table: Table) {
    this.config = getViewModelConfig();
    this.rowTable = asTableRows(table);
    this.columnTable = asTableColumns(table);
    this.rowHeaderTable = asTableRowHeader(table);
    this.columnHeaderTable = asTableColumnHeader(table);
    this.mergedRegionsTable = asTableMergedRegions(table);
  }

  public getColumnWidth(colId: number): number {
    const col: Column | undefined = this.columnTable?.getColumn(colId);
    return asColumnWidth(col)?.getWidth() ?? this.config.columnWidth;
  }

  public getRowHeaderWidth(): number {
    let width = 0;
    if (this.config.showRowHeader) {
      const numberOfColumns: number =
        this.rowHeaderTable?.getRowHeader().getNumberOfColumns() ?? 0;
      for (let colId = 0; colId < numberOfColumns; colId++) {
        width += this.getRowHeaderColumnWidth(colId);
      }
    }
    return width;
  }

  public getRowHeaderColumnWidth(colId: number): number {
    return this.config.showRowHeader
      ? this.config.rowHeaderColumnWidth ?? 0
      : 0;
  }

  public getBodyWidth(): number {
    if (!this.width) this.width = this.calculateBodyWidth();
    return this.width;
  }

  private calculateBodyWidth(): number {
    let width = 0;
    for (let i = 0; i < this.table.getNumberOfColumns(); i++) {
      width += this.getColumnWidth(i);
    }
    return width;
  }

  public getRowHeight(rowId: number): number {
    const row: Row | undefined = this.rowTable?.getRow(rowId);
    return asRowHeight(row)?.getHeight() ?? this.config.rowHeight;
  }

  public getColumnHeaderRowHeight(rowId: number): number {
    return this.config.columnHeaderRowHeight ?? 0;
  }

  public getColumnHeaderHeight(): number {
    let height = 0;
    if (this.config.showColumnHeader) {
      const numberOfRows: number =
        this.columnHeaderTable?.getColumnHeader().getNumberOfRows() ?? 0;
      for (let rowId = 0; rowId < numberOfRows; rowId++) {
        height += this.getColumnHeaderRowHeight(rowId);
      }
    }
    return height;
  }

  public getBodyHeight(): number {
    if (!this.height) this.height = this.calculateBodyHeight();
    return this.height;
  }

  private calculateBodyHeight(): number {
    let height = 0;
    for (let i = 0; i < this.table.getNumberOfRows(); i++) {
      height += this.getRowHeight(i);
    }
    return height;
  }

  public getRowPosition(rowId: number): number {
    return this.getRowPositions()[rowId];
  }

  private getRowPositions(): number[] {
    if (!this.rowPositions) this.rowPositions = this.calculateRowPositions();
    return this.rowPositions;
  }

  private calculateRowPositions(): number[] {
    const positions: number[] = [];
    let position = 0;
    for (let i = 0; i < this.table.getNumberOfRows(); i++) {
      positions.push(position);
      position += this.getRowHeight(i);
    }
    return positions;
  }

  public getColumnPosition(colId: number): number {
    return this.getColumnPositions()[colId];
  }

  private getColumnPositions(): number[] {
    if (!this.columnPositions) {
      this.columnPositions = this.calculateColumnPositions();
    }
    return this.columnPositions;
  }

  private calculateColumnPositions(): number[] {
    const positions: number[] = [];
    let position = 0;
    for (let i = 0; i < this.table.getNumberOfColumns(); i++) {
      positions.push(position);
      position += this.getColumnWidth(i);
    }
    return positions;
  }

  public getRowSpan(rowId: number, colId: number): number {
    if (!this.rowSpans) this.calculateMergedRegions();
    return this.rowSpans!.get(rowId, colId) ?? 1;
  }

  public getMaxRowSpan(rowId: number): number {
    if (!this.rowSpans) this.calculateMergedRegions();
    const values: number[] | undefined = this.rowSpans!.getAll(rowId);
    return values ? Math.max(...values) : 1;
  }

  public getColSpan(rowId: number, colId: number): number {
    if (!this.colSpans) this.calculateMergedRegions();
    return this.colSpans!.get(colId, rowId) ?? 1;
  }

  public getMaxColSpan(colId: number): number {
    if (!this.colSpans) this.calculateMergedRegions();
    const values: number[] | undefined = this.colSpans!.getAll(colId);
    return values ? Math.max(...values) : 1;
  }

  public isHiddenCell(rowId: number, colId: number): boolean {
    if (!this.hiddenCells) this.calculateMergedRegions();
    return this.hiddenCells!.get(rowId, colId) ?? false;
  }

  public hasHiddenCells4Row(rowId: number): boolean {
    if (!this.hiddenCells) this.calculateMergedRegions();
    return this.hiddenCells?.getAll(rowId) !== undefined;
  }

  public hasHiddenCells4Column(colId: number): boolean {
    if (!this.hiddenCells) this.calculateMergedRegions();
    for (const key of this.hiddenCells!.keys()) {
      const rowId: number = key as unknown as number;
      const value: boolean | undefined = this.hiddenCells!.get(rowId, colId);
      if (value) return true;
    }
    return false;
  }

  private calculateMergedRegions(): void {
    this.rowSpans = new DoubleKeyMap();
    this.colSpans = new DoubleKeyMap();
    this.hiddenCells = new DoubleKeyMap();
    this.mergedRegionsTable
      ?.getMergedRegions()
      .forEachRegion((region: MergedRegion): void => {
        const rowSpan: number = region.getRowSpan();
        const colSpan: number = region.getColSpan();
        const rowId: number = region.getFrom().getRowId();
        const colId: number = region.getFrom().getColId();
        rowSpan > 1 && this.rowSpans!.set(rowId, colId, rowSpan);
        colSpan > 1 && this.colSpans!.set(colId, rowId, colSpan);
        let isFirstCell = true;
        region.forEachCell((rowId: number, colId: number): void => {
          if (isFirstCell) isFirstCell = false;
          else this.hiddenCells!.set(rowId, colId, true);
        });
      });
  }

  public resetRowProperties(): this {
    this.height = undefined;
    this.rowPositions = undefined;
    return this;
  }

  public resetColumnProperties(): this {
    this.width = undefined;
    this.columnPositions = undefined;
    return this;
  }

  public resetMergedRegions(): this {
    this.rowSpans = undefined;
    this.colSpans = undefined;
    this.hiddenCells = undefined;
    return this;
  }

  public hasColumnHeader(): boolean {
    return this.config.showColumnHeader ?? false;
  }

  public getColumnHeaderRowIds(): RangeIterator {
    return new RangeIterator(0, this.getColumnHeaderRowNumber());
  }

  private getColumnHeaderRowNumber(): number {
    return (
      asTableColumnHeader(this.table)?.getColumnHeader().getNumberOfRows() ?? 0
    );
  }

  public getColumnHeaderCellValue(
    rowId: number,
    colId: number
  ): Value | undefined {
    return incrementLetter(colId);
  }

  public hasRowHeader(): boolean {
    return this.config.showRowHeader ?? false;
  }

  public getRowHeaderColIds(): RangeIterator {
    return new RangeIterator(0, this.getRowHeaderColumnNumber());
  }

  private getRowHeaderColumnNumber(): number {
    return (
      asTableRowHeader(this.table)?.getRowHeader().getNumberOfColumns() ?? 0
    );
  }

  public getRowHeaderCellValue(
    rowId: number,
    colId: number
  ): Value | undefined {
    return incrementNumber(rowId);
  }

  public getCellStyle(rowId: number, colId: number): Style | undefined {
    const cell: Cell | undefined = this.table.getCell(rowId, colId);
    let styleName: string | undefined = asCellStyle(cell)?.getStyleName();
    if (styleName) return asTableStyles(this.table)?.getStyle(styleName);
    else return undefined;
  }

  public getCellValue(rowId: number, colId: number): Value | undefined {
    return this.table.getCell(rowId, colId)?.getValue();
  }
}

export class FitTableViewerFactory implements TableViewerFactory {
  public createTableViewer(table: Table): TableViewer {
    return new FitTableViewer(table);
  }
}
