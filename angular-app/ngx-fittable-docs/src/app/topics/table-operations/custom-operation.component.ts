import { Component, OnInit } from '@angular/core';

import {
  CellCoord,
  createCellCoord,
  createTable,
  registerModelConfig,
  Table,
  Value,
} from 'fittable-core/model';
import {
  OperationId,
  OperationDto,
  OperationDtoFactory,
  OperationStep,
  OperationStepFactory,
  registerOperationConfig,
} from 'fittable-core/operations';
import {
  createFittableDesigner,
  registerViewModelConfig,
} from 'fittable-core/view-model';
import { FIT_MODEL_CONFIG } from 'fittable-model';
import { FIT_OPERATION_CONFIG } from 'fittable-model-operations';
import { createFitViewModelConfig } from 'fittable-view-model';

import { TopicTitle } from '../../common/topic-title.model';
import { ConsoleTopic } from './common/console-topic.model';

@Component({
  selector: 'custom-operation',
  templateUrl: './common/console-topic.html',
  styleUrls: ['../common/common.css'],
})
export class CustomOperationComponent extends ConsoleTopic implements OnInit {
  public readonly title: TopicTitle = 'Custom operation';
  public readonly buttonText = 'Add value to cell B2';

  constructor() {
    super();
    this.typescriptCode = [
      { image: 'custom-operation-ts-01.jpg' },
      { image: 'custom-operation-ts-02.jpg' },
      { image: 'custom-operation-ts-03.jpg' },
      { image: 'custom-operation-ts-04.jpg' },
    ];
  }

  public override ngOnInit(): void {
    // The register functions should be called, in most cases, from the Angular main module.
    registerModelConfig(FIT_MODEL_CONFIG);
    registerOperationConfig(FIT_OPERATION_CONFIG);
    registerViewModelConfig(
      createFitViewModelConfig({ rowHeader: true, colHeader: true })
    );

    this.fit = createFittableDesigner(createTable()); // FitTable default: 5 rows, 5 cols

    this.fit.operationExecutor
      ?.bindOperationStepFactory('dummy-step', DummyOperationStepFactory)
      .bindOperationDtoFactory('dummy-operation', DummyOperationDtoFactory);
  }

  public runOperation(): void {
    const args: DummyOperationDtoArgs = {
      id: 'dummy-operation',
      cellCoord: createCellCoord(1, 1),
      value: 'Dummy value',
    };
    const operationDto: OperationDto = this.fit.operationExecutor //
      ?.createOperationDto(args) as OperationDto;
    this.consoleText = JSON.stringify(operationDto, null, 2);
    this.fit.operationExecutor?.runOperationDto(operationDto);
  }
}

type DummyOperationStepDto = OperationId<'dummy-step'> & {
  rowId?: number;
  colId?: number;
  value?: Value;
};
class DummyOperationStep implements OperationStep {
  constructor(private table: Table, private stepDto: DummyOperationStepDto) {}
  run(): void {
    const rowId: number | undefined = this.stepDto.rowId;
    const colId: number | undefined = this.stepDto.colId;
    if (!rowId || !colId) return;
    this.table.setCellValue(rowId, colId, this.stepDto.value);
  }
}
class DummyOperationStepFactory implements OperationStepFactory {
  public createStep(
    table: Table,
    stepDto: DummyOperationStepDto
  ): OperationStep {
    return new DummyOperationStep(table, stepDto);
  }
}

type DummyOperationDtoArgs = OperationId<'dummy-operation'> & {
  cellCoord: CellCoord;
  value: Value;
};
class DummyOperationDtoBuilder {
  private dummyOperationStepDto: DummyOperationStepDto = {
    id: 'dummy-step',
  };
  private undoDummyOperationStepDto: DummyOperationStepDto = {
    id: 'dummy-step',
  };
  private operationDto: OperationDto;
  constructor(private table: Table, private args: DummyOperationDtoArgs) {
    this.operationDto = {
      id: args.id,
      steps: [this.dummyOperationStepDto],
      undoOperation: { steps: [this.undoDummyOperationStepDto] },
    };
  }
  build(): OperationDto {
    if (this.getOldValue() !== this.args.value) {
      this.prepareUpdate();
      this.prepareUndo();
    }
    return this.operationDto;
  }
  private prepareUpdate(): void {
    this.dummyOperationStepDto.rowId = this.args.cellCoord.getRowId();
    this.dummyOperationStepDto.colId = this.args.cellCoord.getColId();
    this.dummyOperationStepDto.value = this.args.value;
  }
  private prepareUndo(): void {
    const rowId: number = this.args.cellCoord.getRowId();
    const colId: number = this.args.cellCoord.getColId();
    this.undoDummyOperationStepDto.rowId = rowId;
    this.undoDummyOperationStepDto.colId = colId;
    this.undoDummyOperationStepDto.value = this.getOldValue();
  }
  private getOldValue(): Value | undefined {
    const rowId: number = this.args.cellCoord.getRowId();
    const colId: number = this.args.cellCoord.getColId();
    return this.table.getCellValue(rowId, colId);
  }
}
class DummyOperationDtoFactory implements OperationDtoFactory {
  createOperationDto(
    table: Table,
    args: DummyOperationDtoArgs
  ): OperationDto | Promise<OperationDto> {
    return new DummyOperationDtoBuilder(table, args).build();
  }
}
