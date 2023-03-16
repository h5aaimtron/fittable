import { Observable } from 'rxjs';

import {
  registerModelConfig,
  Value,
  Table,
  createTable,
  Style,
  createStyle,
  TableStyles,
  TableRows,
  createLineRange,
  CellRangeList,
  LineRangeList,
  CellRange,
  LineRange,
  createCellRange,
  createCellCoord,
  TableCols,
} from 'fit-core/model/index.js';
import {
  OperationExecutor,
  createOperationExecutor,
  registerOperationConfig,
  OperationDto,
} from 'fit-core/operations/index.js';

import { FIT_MODEL_CONFIG } from '../../../fit-model/dist/index.js';

import {
  FIT_OPERATION_CONFIG,
  FitOperationDtoArgs,
  BorderStyle,
} from '../../dist/index.js';

export type TstTable = Table & TableStyles & TableRows & TableCols;

export class TableOperationExecutor {
  private table: TstTable;
  private readonly executor: OperationExecutor;
  private readonly selectedCells: CellRangeList;
  private readonly selectedRows: LineRangeList;
  private readonly selectedCols: LineRangeList;

  constructor() {
    registerModelConfig(FIT_MODEL_CONFIG);
    registerOperationConfig(FIT_OPERATION_CONFIG);
    this.table = createTable<TstTable>();
    this.executor = createOperationExecutor().setTable(this.table);
    this.selectedCells = new CellRangeList();
    this.selectedRows = new LineRangeList();
    this.selectedCols = new LineRangeList();
  }

  public createTable(numberOfRows: number, numberOfCols: number): this {
    this.table = createTable()
      .setNumberOfRows(numberOfRows)
      .setNumberOfCols(numberOfCols) as TstTable;
    this.executor.setTable(this.table);
    return this;
  }

  public getTable(): Table {
    return this.table;
  }

  public addStyle(
    name: string,
    properties: { [name in string]?: string | number }
  ): this {
    const style: Style = createStyle();
    for (const name of Reflect.ownKeys(properties)) {
      style.set(name as string, Reflect.get(properties, name));
    }
    this.table.addStyle(name, style);
    return this;
  }

  public getStyle(styleName: string): Style | undefined {
    return this.table.getStyle(styleName);
  }

  public setCellStyleName(
    rowId: number,
    colId: number,
    styleName: string
  ): this {
    this.table.setCellStyleName(rowId, colId, styleName);
    return this;
  }

  public getCellStyleName(rowId: number, colId: number): string | undefined {
    return this.table.getCellStyleName(rowId, colId);
  }

  public getNumberOfStyles(): number {
    return this.table.getStyleNames ? this.table.getStyleNames().length : 0;
  }

  public setCellValue(rowId: number, colId: number, value: Value): this {
    this.table.setCellValue(rowId, colId, value);
    return this;
  }

  public getCellValue(rowId: number, colId: number): Value | undefined {
    return this.table.getCellValue(rowId, colId);
  }

  public selectCell(rowId: number, colId: number): this {
    this.selectedCells.addCell(rowId, colId);
    this.selectedRows.add(createLineRange(rowId));
    this.selectedCols.add(createLineRange(colId));
    return this;
  }

  public getNumberOfRows(): number {
    return this.table.getNumberOfRows();
  }

  public getNumberOfCols(): number {
    return this.table.getNumberOfCols();
  }

  public getRowHeight(rowId: number): number {
    return this.table.getRowHeight(rowId) ?? 0;
  }

  public getColWidth(colId: number): number {
    return this.table.getColWidth(colId) ?? 0;
  }

  public canUndo(): boolean {
    return this.executor.canUndo();
  }

  public runUndo(): this {
    this.executor.undo();
    return this;
  }

  public onAfterUndo$(): Observable<OperationDto> {
    return this.executor.onAfterUndo$();
  }

  public canRedo(): boolean {
    return this.executor.canRedo();
  }

  public runRedo(): this {
    this.executor.redo();
    return this;
  }

  public onAfterRedo$(): Observable<OperationDto> {
    return this.executor.onAfterRedo$();
  }

  public runFontBold(isBold: boolean): this {
    const styleSnippet: Style = isBold
      ? createStyle().set('font-weight', 'bold')
      : createStyle().set('font-weight', undefined);
    const args: FitOperationDtoArgs = {
      id: 'style-update',
      selectedCells: this.getSelectedCells(),
      styleSnippet,
    };
    this.executor.run(args);
    return this;
  }

  public runPaintBorder(borderStyle: BorderStyle): this {
    const args: FitOperationDtoArgs = {
      id: 'style-border',
      selectedCells: this.getSelectedCells(),
      borderStyle,
    };
    this.executor.run(args);
    return this;
  }

  public runRemoveCells(): this {
    const args: FitOperationDtoArgs = {
      id: 'cell-remove',
      selectedCells: this.getSelectedCells(),
    };
    this.executor.run(args);
    return this;
  }

  public runInsertRowsBefore(numberOfRows: number): this {
    const args: FitOperationDtoArgs = {
      id: 'row-insert',
      selectedLines: this.getSelectedRows(),
      numberOfNewLines: numberOfRows,
    };
    this.executor.run(args);
    return this;
  }

  public runInsertRowsAfter(numberOfRows: number): this {
    const args: FitOperationDtoArgs = {
      id: 'row-insert',
      selectedLines: this.getSelectedRows(),
      numberOfNewLines: numberOfRows,
      insertAfter: true,
    };
    this.executor.run(args);
    return this;
  }

  public runRemoveRows(): this {
    const args: FitOperationDtoArgs = {
      id: 'row-remove',
      selectedLines: this.getSelectedRows(),
    };
    this.executor.run(args);
    return this;
  }

  public runResizeRows(height: number): this {
    const args: FitOperationDtoArgs = {
      id: 'row-height',
      selectedLines: this.getSelectedRows(),
      dimension: height,
    };
    this.executor.run(args);
    return this;
  }

  public runInsertColsBefore(numberOfCols: number): this {
    const args: FitOperationDtoArgs = {
      id: 'column-insert',
      selectedLines: this.getSelectedCols(),
      numberOfNewLines: numberOfCols,
    };
    this.executor.run(args);
    return this;
  }

  public runInsertColsAfter(numberOfCols: number): this {
    const args: FitOperationDtoArgs = {
      id: 'column-insert',
      selectedLines: this.getSelectedCols(),
      numberOfNewLines: numberOfCols,
      insertAfter: true,
    };
    this.executor.run(args);
    return this;
  }

  public runRemoveCols(): this {
    const args: FitOperationDtoArgs = {
      id: 'column-remove',
      selectedLines: this.getSelectedCols(),
    };
    this.executor.run(args);
    return this;
  }

  public runResizeCols(width: number): this {
    const args: FitOperationDtoArgs = {
      id: 'column-width',
      selectedLines: this.getSelectedCols(),
      dimension: width,
    };
    this.executor.run(args);
    return this;
  }

  public runRemoveCellStyles(): this {
    const args: FitOperationDtoArgs = {
      id: 'style-remove',
      selectedCells: this.getSelectedCells(),
    };
    this.executor.run(args);
    return this;
  }

  public runCellValue(
    rowId: number,
    colId: number,
    value: string | number | undefined
  ): this {
    const args: FitOperationDtoArgs = {
      id: 'cell-value',
      selectedCells: [createCellRange(createCellCoord(rowId, colId))],
      value,
    };
    this.executor.run(args);
    return this;
  }

  public runCellCopyValue(): this {
    const args: FitOperationDtoArgs = {
      id: 'cell-copy',
      selectedCells: this.getSelectedCells(),
    };
    this.executor.run(args);
    return this;
  }

  public runCellPasteValue(): this {
    const args: FitOperationDtoArgs = {
      id: 'cell-paste',
      selectedCells: this.getSelectedCells(),
    };
    this.executor.run(args);
    return this;
  }

  public runPaintFormat(sourceStyleName?: string): this {
    const args: FitOperationDtoArgs = {
      id: 'style-name',
      selectedCells: this.getSelectedCells(),
      styleName: sourceStyleName,
    };
    this.executor.run(args);
    return this;
  }

  public onAfterRun$(): Observable<OperationDto> {
    return this.executor.onAfterRun$();
  }

  private getSelectedCells(): CellRange[] {
    return this.selectedCells.getRanges();
  }

  private getSelectedRows(): LineRange[] {
    return this.selectedRows.getRanges();
  }

  private getSelectedCols(): LineRange[] {
    return this.selectedCols.getRanges();
  }
}
