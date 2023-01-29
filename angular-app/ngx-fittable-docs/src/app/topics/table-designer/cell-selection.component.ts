import { Subject, Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';

import {
  CellRange,
  createCellCoord,
  createTable,
  registerModelConfig,
  Table,
} from 'fit-core/model';
import { registerOperationConfig } from 'fit-core/operations';
import {
  createFittableDesigner,
  FittableDesigner,
  registerViewModelConfig,
} from 'fit-core/view-model';
import { FIT_MODEL_CONFIG } from 'fit-model';
import { FIT_OPERATION_CONFIG } from 'fit-model-operations';
import { createFitViewModelConfig } from 'fit-view-model';

import { TopicTitle } from '../../common/topic-title.model';
import { Button, ConsoleTopic } from './common/console-topic.model';
import { CodeSnippet } from '../common/code-snippet.model';

@Component({
  selector: 'cell-selection',
  templateUrl: './common/console-topic.html',
  styleUrls: ['./common/console-topic.css', '../common/common.css'],
})
export class CellSelectionComponent implements ConsoleTopic, OnInit, OnDestroy {
  public readonly title: TopicTitle = 'Cell selection';
  public readonly htmlCode: CodeSnippet[] = [
    { image: 'fittable-component-html.jpg' },
  ];
  public readonly typescriptCode: CodeSnippet[] = [
    { image: 'cell-selection-ts-01.jpg' },
    { image: 'cell-selection-ts-02.jpg' },
    { image: 'cell-selection-ts-03.jpg' },
  ];
  public readonly buttons: Button[] = [];
  public fit!: FittableDesigner;
  private consoleText = '';
  private subscription?: Subscription;

  public ngOnInit(): void {
    // The register functions should be called, in most cases, from the Angular main module.
    registerModelConfig(FIT_MODEL_CONFIG);
    registerOperationConfig(FIT_OPERATION_CONFIG);
    registerViewModelConfig(
      createFitViewModelConfig({
        rowHeader: true,
        colHeader: true,
        cellSelection: true,
      })
    );

    const table: Table = createTable(); // FitTable default: 5 rows, 5 cols
    table.forEachCell((rowId: number, colId: number): void => {
      table.setCellValue(rowId, colId, '[' + rowId + ',' + colId + ']');
    });
    this.fit = createFittableDesigner(table);

    this.createCellSelectionButton();
    this.writeCellSelectionToConsole();
  }

  private createCellSelectionButton(): void {
    this.buttons.push({
      getLabel: (): string => 'Select cell ranges: A1:B2, B2:D4',
      run: (): void => {
        this.fit.viewModel.cellSelection?.body
          .removeRanges()
          .addRange(createCellCoord(0, 0), createCellCoord(1, 1))
          .addRange(createCellCoord(1, 1), createCellCoord(3, 3))
          .end();
      },
    });
  }

  private writeCellSelectionToConsole(): void {
    const onEnd$: Subject<CellRange[]> = new Subject();
    this.subscription = onEnd$.subscribe((cellRanges: CellRange[]): void => {
      this.consoleText = '';
      for (const cellRange of cellRanges) {
        this.consoleText += JSON.stringify(cellRange.getDto(), null, 2) + '\n';
      }
    });
    this.fit.viewModel.cellSelection?.body.addOnEnd$(onEnd$);
  }

  public getConsoleText(): string {
    return this.consoleText;
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
