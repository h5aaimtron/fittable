export type FitLanguageCode = 'en-US' | 'de-DE';

export type FitTextKey =
  | 'Resize rows'
  | 'Insert rows above'
  | 'Insert rows below'
  | 'Remove rows'
  | 'Resize columns'
  | 'Insert columns left'
  | 'Insert columns right'
  | 'Remove columns'
  | 'Clear cells'
  | 'Remove cells'
  | 'Cut cells'
  | 'Copy cells'
  | 'Paste cells'
  | 'Merge cells'
  | 'Unmerge cells'
  | 'None'
  | 'Align top'
  | 'Align middle'
  | 'Align bottom'
  | 'Align left'
  | 'Align center'
  | 'Align right'
  | 'Undo'
  | 'Redo'
  | 'Paint format'
  | 'Bold'
  | 'Italic'
  | 'Underline'
  | 'Strike'
  | 'Font size'
  | 'Font family'
  | 'Text color'
  | 'Background color'
  | 'Vertical align'
  | 'Horizontal align'
  | 'Borders'
  | 'All borders'
  | 'Inner borders'
  | 'Outer borders'
  | 'Horizontal borders'
  | 'Vertical borders'
  | 'Left borders'
  | 'Top borders'
  | 'Right borders'
  | 'Bottom borders'
  | 'Clear borders'
  | 'Border type'
  | 'Border color'
  | 'Separator'
  | 'Settings'
  | 'Languages'
  | 'en-US'
  | 'de-DE'
  | 'Color themes'
  | 'Light mode'
  | 'Dark mode'
  | 'Rows'
  | 'Columns'
  | 'Select all'
  | 'Clear'
  | 'Cancel'
  | 'Blank cells'
  | 'Filter'
  | 'Filter by value'
  | 'Search'
  | 'Ok';

export type FitDictionary = { [key in FitTextKey]?: string };
