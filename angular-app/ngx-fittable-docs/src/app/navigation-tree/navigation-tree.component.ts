import { Subject, Subscription } from 'rxjs';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { TopicTitle } from '../common/topic-title.model';

export interface Composite {
  label: string;
  isExpended: boolean;
  leafs: TopicTitle[];
}

@Component({
  selector: 'navigation-tree',
  templateUrl: './navigation-tree.component.html',
  styleUrls: ['./navigation-tree.component.css'],
})
export class NavigationTreeComponent implements OnInit, OnDestroy {
  @Input() clickedLeaf$: Subject<TopicTitle> = new Subject();
  public tree: Composite[] = createTree();
  public clickedLeaf: TopicTitle = 'Introduction';
  private subscription?: Subscription;

  public ngOnInit(): void {
    this.subscription = this.clickedLeaf$.subscribe(
      (leaf: TopicTitle): void => {
        this.clickedLeaf = leaf;
      }
    );
  }

  public onCompositeClick(composite: Composite): void {
    composite.isExpended = !composite.isExpended;
  }

  public onLeafClick(leaf: TopicTitle): void {
    this.clickedLeaf$.next(leaf);
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}

function createTree(): Composite[] {
  return [
    {
      label: 'Getting started',
      isExpended: true,
      leafs: ['Introduction', 'Architecture', 'Installation'],
    },
    {
      label: 'Table model',
      isExpended: false,
      leafs: [
        'Row header',
        'Row height',
        'Column header',
        'Column width',
        'Cell value',
        'Cell style',
        'Cell merge',
        'Table DTO',
        'Custom table',
      ],
    },
    {
      label: 'Table operations',
      isExpended: false,
      leafs: [
        'Update style',
        'Paint format',
        'Resize rows',
        'Insert rows above',
        'Insert rows below',
        'Remove rows',
        'Resize columns',
        'Insert columns left',
        'Insert columns right',
        'Remove columns',
        'Cell values',
        'Clear cells',
        'Remove cells',
        'Cut / Paste cells',
        'Copy / Paste cells',
        'Merge cells',
        'Unmerge cells',
        'Operation DTO',
        'Custom operation',
      ],
    },
    {
      label: 'Table designer',
      isExpended: false,
      leafs: [
        'Table scroller',
        'Cell selection',
        'Cell editor',
        'Language dictionary',
        'Image registry',
        'Theme switcher',
        'Settings bar',
        'Toolbar',
        'Context menu',
        'Statusbar',
        'Custom view model',
      ],
    },
  ];
}
