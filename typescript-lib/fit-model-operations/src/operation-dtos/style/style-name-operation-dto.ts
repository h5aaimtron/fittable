import {
  Table,
  CellRange,
  TableStyles,
  Style,
  createDto4CellRangeList,
  Cell,
  asCellStyle,
  CellStyle,
} from 'fit-core/model/index.js';
import {
  OperationDto,
  OperationDtoFactory,
  Id,
} from 'fit-core/operations/index.js';

import { CellRangeAddressObjects } from '../../utils/cell/cell-range-address-objects.js';
import { countAllCellStyleNames } from '../../utils/style/style-functions.js';
import { StyleOperationStepDto } from '../../operation-steps/style/style-operation-step.js';

export type StyleNameOperationDtoArgs = Id<'style-name'> & {
  selectedCells: CellRange[];
  styleName?: string;
};

export class StyleNameOperationDtoBuilder {
  public readonly styleStepDto: StyleOperationStepDto = {
    id: 'style',
    createStyles: [],
    updateStyles: [],
    removeStyles: [],
    cellStyleNames: [],
  };
  public readonly undoStyleStepDto: StyleOperationStepDto = {
    id: 'style',
    createStyles: [],
    updateStyles: [],
    removeStyles: [],
    cellStyleNames: [],
  };
  private readonly operationDto: OperationDto;

  private oldStyleNames: CellRangeAddressObjects<string | undefined>;

  constructor(
    private readonly table: Table & TableStyles,
    private readonly args: StyleNameOperationDtoArgs
  ) {
    this.operationDto = {
      id: this.args.id,
      steps: [this.styleStepDto],
      undoOperation: { steps: [this.undoStyleStepDto] },
    };
    this.oldStyleNames = new CellRangeAddressObjects();
  }

  public build(): OperationDto {
    this.markOldStyleNames();
    this.updateCellStyleNames();
    this.updateStyles();
    return this.operationDto;
  }

  private markOldStyleNames(): void {
    for (const cellRange of this.args.selectedCells) {
      cellRange.forEachCell((rowId: number, colId: number) => {
        const cell: Cell | undefined = this.table.getCell(rowId, colId);
        const sCell: CellStyle | undefined = asCellStyle(cell);
        const oldStyleName: string | undefined = sCell?.getStyleName();
        oldStyleName !== this.args.styleName &&
          this.oldStyleNames.set(oldStyleName, rowId, colId);
      });
    }
  }

  private updateCellStyleNames(): void {
    const cellRanges: CellRange[] = this.oldStyleNames.getAllAddresses();
    this.styleStepDto.cellStyleNames.push({
      updatableCellRanges: createDto4CellRangeList(cellRanges),
      styleName: this.args.styleName,
    });
    this.oldStyleNames.forEach(
      (styleName: string | undefined, address: CellRange[]) => {
        this.undoStyleStepDto.cellStyleNames.push({
          updatableCellRanges: createDto4CellRangeList(address),
          styleName,
        });
      }
    );
  }

  private updateStyles(): void {
    const allCellsCnt: Map<string, number> = countAllCellStyleNames(this.table);
    this.oldStyleNames.forEach(
      (styleName: string | undefined, updatableCells: CellRange[]) => {
        if (styleName) {
          const numOfUndoCells: number =
            this.calculateNumberOfCells(updatableCells);
          const numOfAllCells: number | undefined = allCellsCnt.get(styleName);
          if (numOfUndoCells >= (numOfAllCells ?? 0)) {
            this.styleStepDto.removeStyles.push(styleName);
            const style: Style | undefined = this.table.getStyle(styleName);
            if (style) {
              this.undoStyleStepDto.createStyles.push({
                styleName,
                style: style.getDto(),
              });
            }
          }
        }
      }
    );
  }

  private calculateNumberOfCells(cellRanges: CellRange[]): number {
    let numberOfCells = 0;
    cellRanges.forEach((cellRange: CellRange) => {
      numberOfCells += this.calculateNumberOfExistingCells(cellRange);
    });
    return numberOfCells;
  }

  private calculateNumberOfExistingCells(cellRange: CellRange): number {
    let numberOfCells = 0;
    cellRange.forEachCell((rowId: number, colId: number) => {
      const cell: Cell | undefined = this.table.getCell(rowId, colId);
      cell && numberOfCells++;
    });
    return numberOfCells;
  }
}

export class StyleNameOperationDtoFactory implements OperationDtoFactory {
  public createOperationDto(
    table: Table & TableStyles,
    args: StyleNameOperationDtoArgs
  ): OperationDto | Promise<OperationDto> {
    return new StyleNameOperationDtoBuilder(table, args).build();
  }
}
