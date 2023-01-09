import {} from 'jasmine';
import {
  createCellCoord,
  createTable,
  createCell,
  createLineRange,
  createRow,
  createColumn,
  createStyle,
  createMergedRegions,
  createRowHeader,
  createColumnHeader,
} from '../../dist/model/index.js';

type FunctionType = (...args: any[]) => any;

function throwsError(fnct: FunctionType, ...args: any[]): boolean {
  let isError = false;
  try {
    fnct(args);
  } catch {
    isError = true;
  }
  return isError;
}

describe('Test create functions', () => {
  it('createTable', () => expect(throwsError(createTable, 0, 0)).toBeTruthy());
  it('createCell', () => expect(throwsError(createCell)).toBeTruthy());
  it('createCellCoord', () =>
    expect(throwsError(createCellCoord, 0, 0)).toBeTruthy());
  it('createLineRange', () =>
    expect(throwsError(createLineRange, 0, 0)).toBeTruthy());
  it('createRow', () => expect(throwsError(createRow)).toBeTruthy());
  it('createColumn', () => expect(throwsError(createColumn)).toBeTruthy());
  it('createRowHeader', () =>
    expect(throwsError(createRowHeader, 0)).toBeTruthy());
  it('createColumnHeader', () =>
    expect(throwsError(createColumnHeader, 0)).toBeTruthy());
  it('createStyle', () => expect(throwsError(createStyle, 0)).toBeTruthy());
  it('createMergedRegions', () =>
    expect(throwsError(createMergedRegions, 0)).toBeTruthy());
});
