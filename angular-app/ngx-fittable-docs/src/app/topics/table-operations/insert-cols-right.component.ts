import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';

import {
  createLineRange,
  createTable,
  registerModelConfig,
  Table,
} from 'fit-core/model';
import { OperationDto, registerOperationConfig } from 'fit-core/operations';
import {
  createFittableDesigner,
  FittableDesigner,
  registerViewModelConfig,
} from 'fit-core/view-model';
import { FIT_MODEL_CONFIG } from 'fit-model';
import {
  FitOperationDtoArgs,
  FIT_OPERATION_CONFIG,
} from 'fit-model-operations';
import { createFitViewModelConfig } from 'fit-view-model';

import { TopicTitle } from '../../common/topic-title.model';
import { CodeSnippet } from '../common/code-snippet.model';
import { ConsoleTopic } from './common/console-topic.model';

@Component({
  selector: 'insert-columns-right',
  templateUrl: './common/console-topic.html',
  styleUrls: ['./common/console-topic.css', '../common/common.css'],
})
export class InsertColsRightComponent
  extends ConsoleTopic
  implements OnInit, OnDestroy
{
  public readonly title: TopicTitle = 'Insert columns right';
  public readonly htmlCode: CodeSnippet[] = [
    { image: 'fittable-component-html.jpg' },
  ];
  public readonly typescriptCode: CodeSnippet[] = [
    { image: 'insert-columns-right-ts-01.jpg' },
    { image: 'insert-columns-right-ts-02.jpg' },
    { image: 'insert-columns-right-ts-03.jpg' },
  ];
  public readonly buttonText = 'Insert 2 columns after column B';
  public fit!: FittableDesigner;
  public consoleText = '';
  private subscription?: Subscription;

  public ngOnInit(): void {
    // The register functions should be called, in most cases, from the Angular main module.
    registerModelConfig(FIT_MODEL_CONFIG);
    registerOperationConfig(FIT_OPERATION_CONFIG);
    registerViewModelConfig(
      createFitViewModelConfig({ rowHeader: true, colHeader: true })
    );

    const table: Table = createTable(); // FitTable default: 5 rows, 5 cols
    table.forEachCell((rowId: number, colId: number): void => {
      table.setCellValue(rowId, colId, '[' + rowId + ',' + colId + ']');
    });
    this.fit = createFittableDesigner(table);

    this.subscription = this.writeToConsole$();
  }

  private writeToConsole$(): Subscription {
    return this.fit
      .operationExecutor!.onAfterRun$()
      .subscribe((operationDto: OperationDto): void => {
        this.consoleText = 'Operation id: ' + operationDto.id + '\n';
        this.consoleText +=
          'Operation steps: ' + JSON.stringify(operationDto.steps, null, 2);
      });
  }

  public runOperation(): void {
    const args: FitOperationDtoArgs = {
      id: 'column-insert',
      selectedLines: [createLineRange(1)],
      numberOfNewLines: 2,
      insertAfter: true,
    };
    this.fit.operationExecutor?.run(args);
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
