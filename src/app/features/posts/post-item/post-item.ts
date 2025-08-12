import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Post } from '../../../models';
import { TimeAgoPipe } from '../../../shared/pipes';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-item',
  imports: [RouterLink, TimeAgoPipe],
  templateUrl: './post-item.html',
  styleUrl: './post-item.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostItem {
  @Input() post!: Post;
  @Output() postChangedEvent = new EventEmitter<Post>();
}