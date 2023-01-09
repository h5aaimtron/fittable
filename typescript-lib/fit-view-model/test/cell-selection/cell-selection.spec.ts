import {} from 'jasmine';

import {
  registerModelConfig,
  Table,
  createCellCoord,
  CellCoord,
  CellRange,
  unregisterModelConfig,
} from 'fit-core/model/index.js';
import {
  CellSelection,
  createCellSelection,
  createTableViewer,
  registerViewModelConfig,
  unregisterViewModelConfig,
} from 'fit-core/view-model/index.js';

import { fitModelConfig, FitTable } from '../../../fit-model/dist/index.js';
import { fitViewModelConfig } from '../../dist/index.js';

const table: Table = new FitTable({
  numberOfRows: 2,
  numberOfColumns: 2,
  rowHeader: { numberOfColumns: 1 },
  columnHeader: { numberOfRows: 1 },
  styles: {},
  rows: [],
  columns: [],
  mergedRegions: [],
});

let cellSelection: CellSelection;

describe('Test CellSelection', () => {
  beforeAll(() => {
    registerModelConfig(fitModelConfig);
    registerViewModelConfig(fitViewModelConfig);
    const tableViewer = createTableViewer(table);
    cellSelection = createCellSelection(tableViewer);
  });
  afterAll(() => {
    unregisterModelConfig();
    unregisterViewModelConfig();
  });

  it('body selection', () => {
    const selectedCell: CellCoord = createCellCoord(1, 1);
    cellSelection.clear().body.createRange().addCell(selectedCell).end();
    const headerRowId: number =
      cellSelection.rowHeader?.getFirstCell()?.getRowId() ?? 0;
    expect(headerRowId === selectedCell.getRowId()).toBeTruthy();
    const headerColId: number =
      cellSelection.columnHeader?.getFirstCell()?.getColId() ?? 0;
    expect(headerColId === selectedCell.getColId()).toBeTruthy();
  });

  it('row header selection', () => {
    cellSelection
      .clear()
      .rowHeader?.createRange()
      .addCell(createCellCoord(1, 0))
      .end();
    const bodySelection: CellRange[] = cellSelection.body.getRanges();
    expect(bodySelection.length === 1).toBeTruthy();
    expect(bodySelection[0]?.getFrom().getRowId() === 1).toBeTruthy();
    expect(bodySelection[0]?.getFrom().getColId() === 0).toBeTruthy();
    expect(bodySelection[0]?.getTo().getRowId() === 1).toBeTruthy();
    expect(bodySelection[0]?.getTo().getColId() === 1).toBeTruthy();
  });

  it('column header selection', () => {
    cellSelection
      .clear()
      .columnHeader?.createRange()
      .addCell(createCellCoord(0, 1))
      .end();
    const bodySelection: CellRange[] = cellSelection.body.getRanges();
    expect(bodySelection.length === 1).toBeTruthy();
    expect(bodySelection[0]?.getFrom().getRowId() === 0).toBeTruthy();
    expect(bodySelection[0]?.getFrom().getColId() === 1).toBeTruthy();
    expect(bodySelection[0]?.getTo().getRowId() === 1).toBeTruthy();
    expect(bodySelection[0]?.getTo().getColId() === 1).toBeTruthy();
  });

  it('page header selection', () => {
    cellSelection
      .clear()
      .pageHeader?.createRange()
      .addCell(createCellCoord(0, 0))
      .end();
    const bodySelection: CellRange[] = cellSelection.body.getRanges();
    expect(bodySelection.length === 1).toBeTruthy();
    expect(bodySelection[0]?.getFrom().getRowId() === 0).toBeTruthy();
    expect(bodySelection[0]?.getFrom().getColId() === 0).toBeTruthy();
    expect(bodySelection[0]?.getTo().getRowId() === 1).toBeTruthy();
    expect(bodySelection[0]?.getTo().getColId() === 1).toBeTruthy();
  });
});
