export type FitImageId =
  | 'alignBottom'
  | 'alignCenter'
  | 'alignLeft'
  | 'alignMiddle'
  | 'alignRight'
  | 'alignTop'
  | 'arrowDown'
  | 'arrowRight'
  | 'backgroundColor'
  | 'boldBlue'
  | 'bold'
  | 'borderAll'
  | 'borderAround'
  | 'borderBottom'
  | 'borderCenter'
  | 'borderColor'
  | 'borderCross'
  | 'borderLeft'
  | 'borderMiddle'
  | 'borderNone'
  | 'borderRight'
  | 'borderTop'
  | 'borderType'
  | 'clear'
  | 'color'
  | 'colorNone'
  | 'copy'
  | 'cut'
  | 'height'
  | 'insertAbove'
  | 'insertBelow'
  | 'insertLeft'
  | 'insertRight'
  | 'italicBlue'
  | 'italic'
  | 'paintFormatBlue'
  | 'paintFormat'
  | 'paste'
  | 'redoBlue'
  | 'redo'
  | 'remove'
  | 'strikeBlue'
  | 'strike'
  | 'underlineBlue'
  | 'underline'
  | 'undoBlue'
  | 'undo'
  | 'width'
  | 'merge'
  | 'unmerge'
  | 'settings'
  | 'check'
  | 'filter'
  | 'filterBlue'
  | 'search'
  | 'automatic'
  | 'text'
  | 'number'
  | 'date';

export type FitImages = { [id in FitImageId]?: string };
