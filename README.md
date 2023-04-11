# Fittable

## Introduction

<p>
  Fittable is a flexible and easy-to-use software component optimized for handling large table structures with spreadsheet-like capabilities. Built using Angular and TypeScript, it offers a dynamic table model, a robust operation execution mechanism, and an adjustable user interface that can be easily customized to meet your specific needs.
</p>
<p>
  The main module of Fittable is developed in Angular, which presents a responsive and interactive view for the application. The view model and other essential modules are written in TypeScript without any dependency on a GUI framework, making it possible to use the component on the server-side as well.
</p>
<p>
  Fittable's modules are highly adaptable, with a range of configurable options that allow you to customize each functionality to match your application's requirements.
</p>

## Preview

<div align="center">
  <img src="https://github.com/ionutkosteea/fittable/blob/main/fittable-preview.jpg" alt="Preview" width="800" />
</div>

## Documentation

- [User Docs](https://fittable-499b2.web.app)

## Installation

```bash
npm install @fittable/ngx-fit-view
```

## API Overview

### HTML

```html
<!-- Angular component -->
<fittable [designer]="fit"></fittable>
```

### TypeScript

```typescript
// TypeScript modules
import {
  registerModelConfig,
  Table,
  createTable,
  CellRange,
} from 'fit-core/model';
import { registerOperationConfig } from 'fit-core/operations';
import {
  registerViewModelConfig,
  FittableDesigner,
  createFittableDesigner,
} from 'fit-core/view-model';
import { FIT_MODEL_CONFIG, FitTable, FitStyle } from 'fit-model';
import { FIT_OPERATION_CONFIG, FitOperationArgs } from 'fit-model-operations';
import { FIT_VIEW_MODEL_CONFIG } from 'fit-view-model';

// Register functionalities
registerModelConfig(FIT_MODEL_CONFIG);
registerOperationConfig(FIT_OPERATION_CONFIG);
registerViewModelConfig(FIT_VIEW_MODEL_CONFIG);

// Build table model
const table: Table = createTable<FitTable>()
  .setNumberOfRows(100)
  .setNumberOfCols(10)
  .setRowHeight(0, 42)
  .setColWidth(0, 50)
  .addStyle('s0', createStyle<FitStyle>().set('font-weight', 'bold'))
  .setCellStyleName(0, 0, 's0')
  .setCellValue(0, 0, 1000)
  .setRowSpan(0, 0, 2)
  .setColSpan(0, 0, 3);

// Create table designer
const fit: FittableDesigner = createFittableDesigner(table);

// Access view model
const selectedCells: CellRange[] | undefined =
  fit.viewModel.cellSelection?.body.getRanges();

// Run operations
if (selectedCells) {
  const args: FitOperationArgs = {
    id: 'cell-value',
    selectedCells,
    value: 100,
  };
  fit.operationExecutor?.run(args);
}
```
