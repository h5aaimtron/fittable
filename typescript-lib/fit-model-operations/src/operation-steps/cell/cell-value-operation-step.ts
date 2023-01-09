import {
  Table,
  Cell,
  createCell,
  Value,
  CellRange,
  createCellRange4Dto,
} from 'fit-core/model/index.js';
import {
  OperationStep,
  OperationStepFactory,
  Id,
} from 'fit-core/operations/index.js';

export type CellValueDto = {
  updatableCellRanges: unknown[];
  value?: Value;
};

export type CellValueOperationStepDto = Id<'cell-value'> & {
  values: CellValueDto[];
};

export class CellValueOperationStep implements OperationStep {
  constructor(
    private readonly table: Table,
    private readonly stepDto: CellValueOperationStepDto
  ) {}

  public run(): void {
    return this.updateCells();
  }

  private updateCells(): void {
    for (let cellValueDto of this.stepDto.values) {
      for (let cellRangeDto of cellValueDto.updatableCellRanges) {
        const cellRange: CellRange = createCellRange4Dto(cellRangeDto);
        cellRange.forEachCell((rowId: number, colId: number) => {
          this.updateCellValue(rowId, colId, cellValueDto.value);
          this.removeCellIfNoProperties(rowId, colId);
        });
      }
    }
  }

  private updateCellValue(rowId: number, colId: number, value?: Value): void {
    let cell: Cell | undefined = this.table.getCell(rowId, colId);
    if (cell) cell.setValue(value);
    else this.table.addCell(rowId, colId, createCell().setValue(value));
  }

  private removeCellIfNoProperties(rowId: number, colId: number): void {
    let cell: Cell | undefined = this.table.getCell(rowId, colId);
    if (cell?.hasProperties()) return;
    this.table.removeCell(rowId, colId);
  }
}

export class CellValueOperationStepFactory implements OperationStepFactory {
  public createStep(
    table: Table,
    stepDto: CellValueOperationStepDto
  ): OperationStep {
    return new CellValueOperationStep(table, stepDto);
  }
}
