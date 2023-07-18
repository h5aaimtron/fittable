import { Observable, Subject } from 'rxjs';

import { CellRange, CellCoord } from 'fittable-core/model';
import {
  TableViewer,
  CellSelectionRanges,
  Rectangle,
  CellSelectionRectangles,
  ScrollContainer,
} from 'fittable-core/view-model';

abstract class FitCellSelectionRectangles implements CellSelectionRectangles {
  protected rectangles: Rectangle[] = [];
  private afterPaint$: Subject<void> = new Subject();

  constructor(
    protected readonly tableViewer: TableViewer,
    protected readonly tableScrollContainer: ScrollContainer
  ) {}

  protected abstract calcLeft(cellRange: CellRange): number;
  protected abstract calcTop(cellRange: CellRange): number;
  protected abstract calcWidth(cellRange: CellRange): number;
  protected abstract calcHeight(cellRange: CellRange): number;

  public paint(cellSelection: CellSelectionRanges): this {
    this.createRectangles(cellSelection);
    this.afterPaint$.next();
    return this;
  }

  private createRectangles(cellSelection: CellSelectionRanges): void {
    this.rectangles = [];
    for (const cellRange of cellSelection.getRanges()) {
      const rect: Rectangle = this.createRectangle(cellRange);
      !this.hasRectangle(rect) && this.rectangles.push(rect);
    }
  }

  private createRectangle(cellRange: CellRange): Rectangle {
    const left: number = this.calcLeft(cellRange);
    const top: number = this.calcTop(cellRange);
    const width: number = this.calcWidth(cellRange);
    const height: number = this.calcHeight(cellRange);
    return { left, top, width, height };
  }

  private hasRectangle(rect: Rectangle): boolean {
    for (const r of this.rectangles) {
      if (
        r.left === rect.left &&
        r.top === rect.top &&
        r.width === rect.width &&
        r.height === rect.height
      ) {
        return true;
      }
    }
    return false;
  }

  public onAfterPaint$(): Observable<void> {
    return this.afterPaint$.asObservable();
  }

  public getRectangles(): Rectangle[] {
    return this.rectangles;
  }
}

export class BodySelectionRectangles extends FitCellSelectionRectangles {
  protected calcLeft(cellRange: CellRange): number {
    return (
      this.tableViewer.getRowHeaderWidth() +
      this.tableViewer.getColPosition(cellRange.getFrom().getColId())
    );
  }
  protected calcTop(cellRange: CellRange): number {
    return (
      this.tableViewer.getColHeaderHeight() +
      this.tableViewer.getRowPosition(cellRange.getFrom().getRowId())
    );
  }
  protected calcWidth(cellRange: CellRange): number {
    let width = 0;
    const from: CellCoord = cellRange.getFrom();
    const to: CellCoord = cellRange.getTo();
    for (let colId: number = from.getColId(); colId <= to.getColId(); colId++) {
      width += this.tableViewer.getColWidth(colId);
    }
    return width;
  }
  protected calcHeight(cellRange: CellRange): number {
    let height = 0;
    const from: CellCoord = cellRange.getFrom();
    const to: CellCoord = cellRange.getTo();
    for (let rowId: number = from.getRowId(); rowId <= to.getRowId(); rowId++) {
      height += this.tableViewer.getRowHeight(rowId);
    }
    return height;
  }
}

export class PageHeaderCellSelectionRectangles extends FitCellSelectionRectangles {
  protected calcLeft(): number {
    return 0;
  }
  protected calcTop(): number {
    return 0;
  }
  protected calcWidth(): number {
    return this.tableViewer.getRowHeaderWidth();
  }
  protected calcHeight(): number {
    return this.tableViewer.getColHeaderHeight();
  }
}

export class ColHeaderSelectionRectangles extends FitCellSelectionRectangles {
  protected calcLeft(cellRange: CellRange): number {
    return (
      this.tableViewer.getRowHeaderWidth() +
      this.tableViewer.getColPosition(cellRange.getFrom().getColId())
    );
  }
  protected calcTop(): number {
    return 0;
  }
  protected calcWidth(cellRange: CellRange): number {
    let width = 0;
    const from: CellCoord = cellRange.getFrom();
    const to: CellCoord = cellRange.getTo();
    for (let colId: number = from.getColId(); colId <= to.getColId(); colId++) {
      width += this.tableViewer.getColWidth(colId);
    }
    return width;
  }
  protected calcHeight(): number {
    return this.tableViewer.getColHeaderHeight();
  }
}
export class RowHeaderSelectionRectangles extends FitCellSelectionRectangles {
  protected calcLeft(): number {
    return 0;
  }
  protected calcTop(cellRange: CellRange): number {
    return (
      this.tableViewer.getColHeaderHeight() +
      this.tableViewer.getRowPosition(cellRange.getFrom().getRowId())
    );
  }
  protected calcWidth(): number {
    return this.tableViewer.getRowHeaderWidth();
  }
  protected calcHeight(cellRange: CellRange): number {
    let height = 0;
    const from: CellCoord = cellRange.getFrom();
    const to: CellCoord = cellRange.getTo();
    for (let rowId: number = from.getRowId(); rowId <= to.getRowId(); rowId++) {
      height += this.tableViewer.getRowHeight(rowId);
    }
    return height;
  }
}
