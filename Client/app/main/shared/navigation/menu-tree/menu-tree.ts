import { Component, Input } from '@angular/core';
import { TreeNode } from 'primeng/primeng';

@Component({
  selector: 'tree-view',
  //   directives: [TreeView],
  template: `
  <ul>
    <li *ngFor="let node of treeData">
      {{node.data.name}}
      <tree-view [treeData]="node.children"></tree-view>
    </li>
  </ul>
  `
})
export class TreeView_Component {
  @Input() treeData: TreeNode[];
}