import { Component, inject } from '@angular/core';
import { AuthService, PostsService, ThemesService } from '../../../core/services';
import { Post, Theme } from '../../../models';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PostItem } from "../../posts";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-post-board',
  imports: [CommonModule, RouterLink, PostItem],
  templateUrl: './post-board.html',
  styleUrl: './post-board.css'
})
export class PostBoard {
  private authService = inject(AuthService);
  readonly isLoggedIn = this.authService.isLoggedIn;

  posts$: Observable<Post[]>;

  constructor(
    private postsService: PostsService) {
    this.posts$ = this.postsService.getPosts();
  }

  trackById(index: number, post: Post): string {
  return post._id;
}
}
