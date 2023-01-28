import { Subject, Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';

import {
  createLineRange,
  createTable,
  registerModelConfig,
} from 'fit-core/model';
import { Operation, registerOperationConfig } from 'fit-core/operations';
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
  selector: 'resize-rows',
  templateUrl: './common/console-topic.html',
  styleUrls: ['./common/console-topic.css', '../common/common.css'],
})
export class ResizeRowsComponent
  extends ConsoleTopic
  implements OnInit, OnDestroy
{
  public readonly title: TopicTitle = 'Resize rows';
  public readonly htmlCode: CodeSnippet[] = [
    { image: 'fittable-component-html.jpg' },
  ];
  public readonly typescriptCode: CodeSnippet[] = [
    { image: 'resize-rows-ts-01.jpg' },
    { image: 'resize-rows-ts-02.jpg' },
  ];
  public readonly buttonText = 'Resize rows 2, 3';
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

    this.fit = createFittableDesigner(createTable());
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
      id: 'row-height',
      selectedLines: [createLineRange(1, 2)],
      dimension: 60,
    };
    this.fit.operationExecutor?.run(args);
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
