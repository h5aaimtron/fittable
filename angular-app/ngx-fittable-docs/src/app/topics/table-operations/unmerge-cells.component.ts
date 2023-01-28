import { Subject, Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';

import {
  createCellCoord,
  createCellRange,
  createTable,
  registerModelConfig,
} from 'fit-core/model';
import { Operation, registerOperationConfig } from 'fit-core/operations';
import {
  createFittableDesigner,
  FittableDesigner,
  registerViewModelConfig,
} from 'fit-core/view-model';
import { FitTable, FIT_MODEL_CONFIG } from 'fit-model';
import {
  FitOperationDtoArgs,
  FIT_OPERATION_CONFIG,
} from 'fit-model-operations';
import { createFitViewModelConfig } from 'fit-view-model';

import { TopicTitle } from '../../common/topic-title.model';
import { CodeSnippet } from '../common/code-snippet.model';
import { ConsoleTopic } from './common/console-topic.model';

@Component({
  selector: 'unmerge-cells',
  templateUrl: './common/console-topic.html',
  styleUrls: ['./common/console-topic.css', '../common/common.css'],
})
export class UnmergeCellsComponent
  extends ConsoleTopic
  implements OnInit, OnDestroy
{
  public readonly title: TopicTitle = 'Unmerge cells';
  public readonly htmlCode: CodeSnippet[] = [
    { image: 'fittable-component-html.jpg' },
  ];
  public readonly typescriptCode: CodeSnippet[] = [
    { image: 'unmerge-cells-ts-01.jpg' },
    { image: 'unmerge-cells-ts-02.jpg' },
  ];
  public readonly buttonText = 'Unmerge cells B2:C3';
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

    this.fit = createFittableDesigner(
      createTable<FitTable>().setRowSpan(1, 1, 2).setColSpan(1, 1, 2)
    );
    const afterRun$: Subject<Operation> = new Subject();
    this.subscription = afterRun$.subscribe((operation: Operation): void => {
      this.consoleText += 'Operation id: ' + operation.id + '\n';
    });
    this.fit.operationExecutor?.addListener({
      onAfterRun$: (): Subject<Operation> => afterRun$,
    });
  }

  public runOperation(): void {
    const args: FitOperationDtoArgs = {
      id: 'cell-unmerge',
      selectedCells: [createCellRange(createCellCoord(1, 1))],
    };
    this.fit.operationExecutor?.run(args);
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
