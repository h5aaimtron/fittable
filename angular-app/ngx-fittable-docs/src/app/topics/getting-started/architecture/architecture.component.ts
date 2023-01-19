import { Component } from '@angular/core';
import { TopicTitle } from 'src/app/common/topic-title.model';

@Component({
  selector: 'architecture',
  template:
    '<div class="topic"><h1 class="title">{{title}}</h1><img src="../../../assets/code-snippets/fittable-component-diagram.jpg" /></div>',
  styleUrls: ['../../common/common.css'],
})
export class ArchitectureComponent {
  public readonly title: TopicTitle = 'Architecture';
}
