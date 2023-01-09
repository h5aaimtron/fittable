import { Subscription } from 'rxjs';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

import { CssStyle, Style, createStyle, Value } from 'fit-core/model';
import {
  CellEditor,
  CellEditorListener,
  InputControl,
  Rectangle,
} from 'fit-core/view-model';

@Component({
  selector: 'fit-cell-editor',
  templateUrl: './cell-editor.component.html',
  styleUrls: ['./cell-editor.component.css'],
})
export class CellEditorComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() cellEditorListener!: CellEditorListener;
  @Input() cellStyle?: Style;
  @ViewChild('textArea') textAreaRef!: ElementRef;

  private readonly subscriptions: Subscription[] = [];

  public ngOnInit(): void {
    this.createSubscriptions();
  }

  public ngAfterViewInit(): void {
    this.cellEditorListener.onInit();
  }

  private createSubscriptions(): void {
    const inputControl: InputControl = this.getInputControl();
    this.subscriptions.push(
      inputControl.focus$.subscribe((enable: boolean): void => {
        this.focus(enable);
      })
    );
    inputControl.scrollToEnd$ &&
      this.subscriptions.push(
        inputControl.scrollToEnd$.subscribe((): void => this.scrollToEnd())
      );
    inputControl.ctrlEnter$ &&
      this.subscriptions.push(
        inputControl.ctrlEnter$.subscribe((): void => this.ctrlEnter())
      );
    inputControl.forceValue$ &&
      this.subscriptions.push(
        inputControl.forceValue$.subscribe((value?: Value): void => {
          this.forceValue(value);
        })
      );
  }

  private focus(enable: boolean): void {
    const textArea: HTMLTextAreaElement = this.getTextArea();
    if (enable) return textArea.focus({ preventScroll: true });
    else return textArea.blur();
  }

  private scrollToEnd(): void {
    const textArea: HTMLTextAreaElement = this.getTextArea();
    textArea.scrollTop = textArea.scrollHeight;
    textArea.scrollLeft = textArea.scrollWidth;
  }

  private ctrlEnter(): void {
    const textArea: HTMLTextAreaElement = this.getTextArea();
    const textCursor: number = textArea.selectionStart;
    const start: string = textArea.value.slice(0, textCursor);
    const end: string = textArea.value.slice(textCursor);
    textArea.value = start + '\n' + end;
    textArea.selectionEnd = textCursor + 1;
  }

  private forceValue(value?: Value): void {
    this.getTextArea().value = value ? '' + value : '';
  }

  private getTextArea(): HTMLTextAreaElement {
    return this.textAreaRef.nativeElement as HTMLTextAreaElement;
  }

  public getStyle(): CssStyle {
    const cellEditor: CellEditor = this.cellEditorListener.getCellEditor();
    const display: string = cellEditor.isVisible() ? 'block' : 'none';
    const hasPointer: string = cellEditor.hasPointerEvents() ? 'auto' : 'none';
    let style: Style = createStyle()
      .set('display', display)
      .set('pointerEvents', hasPointer);
    style = style.append(this.createCellRectangleStyle());
    return style.toCss();
  }

  private createCellRectangleStyle(): Style {
    const style: Style = createStyle();
    const cellEditor: CellEditor = this.cellEditorListener.getCellEditor();
    const rect: Rectangle | undefined = cellEditor.getCellRectangle();
    rect &&
      style
        .set('left.px', rect.left)
        .set('top.px', rect.top)
        .set('width.px', rect.width)
        .set('height.px', rect.height);
    return style;
  }

  public getTextAreaStyle(): CssStyle {
    const hasTextCursor: string = this.getInputControl().hasTextCursor()
      ? 'auto'
      : 'transparent';
    let style: Style = createStyle().set('caretColor', hasTextCursor);
    if (this.cellStyle) style = style.append(this.cellStyle);
    return style.toCss();
  }

  public getTextAreaValue(): string {
    const value: Value | undefined = this.getInputControl().getValue();
    return value ? '' + value : '';
  }

  private readonly getInputControl = (): InputControl =>
    this.cellEditorListener.getCellEditor().getCellControl();

  public readonly onTextAreaMouseEnter = (event: MouseEvent): void =>
    this.cellEditorListener.onMouseEnter(event);

  public readonly onTextAreaMouseDown = (event: MouseEvent): void =>
    this.cellEditorListener.onMouseDown(event);

  public readonly onGlobalMouseDown = (): void =>
    this.cellEditorListener.onGlobalMouseDown();

  public readonly onGlobalMouseUp = (): void =>
    this.cellEditorListener.onGlobalMouseUp();

  public readonly onTextAreaKeyDown = (event: KeyboardEvent): void =>
    this.cellEditorListener.onKeyDown(event);

  public readonly onGlobalKeyDown = (event: KeyboardEvent): void =>
    this.cellEditorListener.onGlobalKeyDown(event);

  public readonly onTextAreaInput = (event: Event): void =>
    this.cellEditorListener.onInput(event);

  public readonly onGlobalKeyUp = (): void =>
    this.cellEditorListener.onGlobalKeyUp();

  public readonly onTextAreaContextMenu = (event: MouseEvent): void =>
    this.cellEditorListener.onContextMenu(event);

  public ngOnDestroy(): void {
    this.subscriptions.forEach((s: Subscription): void => s.unsubscribe());
  }
}
