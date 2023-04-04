import { Component, OnInit } from '@angular/core';

import { createTable, registerModelConfig, Table } from 'fit-core/model';
import { registerOperationConfig } from 'fit-core/operations';
import {
  createFittableDesigner,
  FittableDesigner,
  getViewModelConfig,
  registerViewModelConfig,
  Scrollbar,
  ScrollContainer,
  ViewModelConfig,
} from 'fit-core/view-model';
import { FIT_MODEL_CONFIG } from 'fit-model';
import { FIT_OPERATION_CONFIG } from 'fit-model-operations';
import { createFitViewModelConfig } from 'fit-view-model';

import { TopicTitle } from '../../common/topic-title.model';
import { CodeSnippet } from '../common/code-snippet.model';
import { Button, ConsoleTopic } from './common/console-topic.model';

@Component({
  selector: 'table-scroller',
  templateUrl: './common/console-topic.html',
  styleUrls: ['./common/console-topic.css', '../common/common.css'],
})
export class TableScrollerComponent implements ConsoleTopic, OnInit {
  public readonly title: TopicTitle = 'Table scroller';
  public readonly htmlCode: CodeSnippet[] = [
    { image: 'fittable-component-html.jpg' },
  ];
  public readonly typescriptCode: CodeSnippet[] = [
    { image: 'table-scroller-ts-01.jpg' },
    { image: 'table-scroller-ts-02.jpg' },
    { image: 'table-scroller-ts-03.jpg' },
    { image: 'table-scroller-ts-04.jpg' },
    { image: 'table-scroller-ts-05.jpg' },
    { image: 'table-scroller-ts-06.jpg' },
    { image: 'table-scroller-ts-07.jpg' },
    { image: 'table-scroller-ts-08.jpg' },
    { image: 'table-scroller-ts-09.jpg' },
    { image: 'table-scroller-ts-10.jpg' },
  ];
  public readonly buttons: Button[] = [];
  public fit!: FittableDesigner;
  private virtualRowsButton?: Button;
  private virtualColsButton?: Button;
  private verticalScrollbar?: Scrollbar;
  private horizontalScrollbar?: Scrollbar;

  public ngOnInit(): void {
    // The register functions should be called, in most cases, from the Angular main module.
    registerModelConfig(FIT_MODEL_CONFIG);
    registerOperationConfig(FIT_OPERATION_CONFIG);
    registerViewModelConfig(
      createFitViewModelConfig({
        rowHeader: true,
        colHeader: true,
        cellSelection: true,
        statusbar: true,
      })
    );

    const table: Table = createTable()
      .setNumberOfRows(1000)
      .setNumberOfCols(1000);
    table.forEachCell((rowId: number, colId: number): void => {
      table.setCellValue(rowId, colId, '[' + rowId + ',' + colId + ']');
    });
    this.fit = createFittableDesigner(table);

    const tableScroller: ScrollContainer = this.fit.viewModel.tableScroller;
    this.verticalScrollbar = tableScroller.getVerticalScrollbar();
    this.horizontalScrollbar = tableScroller.getHorizontalScrollbar();
    this.createButtons();
  }

  private createButtons(): void {
    this.virtualRowsButton = this.createVirtualRowsButton();
    this.buttons.push(this.virtualRowsButton);
    this.virtualColsButton = this.createVirtualColsButton();
    this.buttons.push(this.virtualColsButton);
    this.buttons.push(this.createScrollToTopButton());
  }

  private createVirtualRowsButton = (): Button => {
    return {
      getLabel: (): string => {
        return getViewModelConfig().disableVirtualRows
          ? 'Enable virtual rows'
          : 'Disable virtual rows';
      },
      run: (): void => {
        if (!this.virtualColsButton) throw new Error('Button is not defined.');
        const config: ViewModelConfig = getViewModelConfig();
        config.disableVirtualRows = !config.disableVirtualRows;
        const tableScroller: ScrollContainer = this.fit.viewModel.tableScroller;
        if (config.disableVirtualRows) {
          tableScroller.setVerticalScrollbar();
          this.virtualColsButton.disabled = 'disabled';
        } else {
          tableScroller.setVerticalScrollbar(this.verticalScrollbar);
          this.virtualColsButton.disabled = undefined;
        }
      },
    };
  };

  private createVirtualColsButton = (): Button => {
    return {
      getLabel: (): string => {
        return getViewModelConfig().disableVirtualCols
          ? 'Enable virtual columns'
          : 'Disable virtual columns';
      },
      run: (): void => {
        if (!this.virtualRowsButton) throw new Error('Button is not defined.');
        const config: ViewModelConfig = getViewModelConfig();
        config.disableVirtualCols = !config.disableVirtualCols;
        const tableScroller: ScrollContainer = this.fit.viewModel.tableScroller;
        if (config.disableVirtualCols) {
          tableScroller.setHorizontalScrollbar();
          this.virtualRowsButton.disabled = 'disabled';
        } else {
          tableScroller.setHorizontalScrollbar(this.horizontalScrollbar);
          this.virtualRowsButton.disabled = undefined;
        }
      },
    };
  };

  private createScrollToTopButton = (): Button => {
    return {
      getLabel: (): string => 'Scroll to top',
      run: (): void => this.fit.viewModel.tableScroller.scrollTo(0, 0),
    };
  };

  public getConsoleText(): string {
    let consoleText = '';
    consoleText +=
      'Total number of rows: ' + this.fit.table.getNumberOfRows() + '\n';
    const firstRow: number = this.getFirstRenderableRow();
    const lastRow: number = this.getLastRenderableRow();
    consoleText += 'Rendered rows: [' + firstRow + ',' + lastRow + ']\n';
    consoleText +=
      'Total number of columns: ' + this.fit.table.getNumberOfCols() + '\n';
    const firstCol: number = this.getFirstRenderableCol();
    const lastCol: number = this.getLastRenderableCol();
    consoleText += 'Rendered columns: [' + firstCol + ',' + lastCol + ']\n';
    consoleText +=
      'Scroll left: ' + this.fit.viewModel.tableScroller.getLeft() + '\n';
    consoleText +=
      'Scroll top: ' + this.fit.viewModel.tableScroller.getTop() + '\n';
    return consoleText;
  }

  private getFirstRenderableCol(): number {
    return (
      this.fit.viewModel.tableScroller
        .getHorizontalScrollbar()
        ?.getFirstRenderableLine() ?? 0
    );
  }

  private getLastRenderableCol(): number {
    const colId: number =
      this.fit.viewModel.tableScroller
        .getHorizontalScrollbar()
        ?.getLastRenderableLine() ?? 0;
    const numberOfCols: number = this.fit.table.getNumberOfCols();
    return colId > 0 ? colId : numberOfCols > 0 ? numberOfCols - 1 : 0;
  }

  private getFirstRenderableRow(): number {
    return (
      this.fit.viewModel.tableScroller
        .getVerticalScrollbar()
        ?.getFirstRenderableLine() ?? 0
    );
  }

  private getLastRenderableRow(): number {
    const rowId: number =
      this.fit.viewModel.tableScroller
        .getVerticalScrollbar()
        ?.getLastRenderableLine() ?? 0;
    const numberOfRows: number = this.fit.table.getNumberOfRows();
    return rowId > 0 ? rowId : numberOfRows > 0 ? numberOfRows - 1 : 0;
  }
}
