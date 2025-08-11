import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemesService } from '../../../core/services/themes.service';
import { Comment } from '../../../models/comment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-theme-content',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './theme-content.html',
  styleUrls: ['./theme-content.css']
})
export class ThemeContent implements OnInit {
  private route = inject(ActivatedRoute);
  private themesService = inject(ThemesService);
  protected authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  themeId!: string;
  themeTitle = '';
  themeDate = '';
  subscribersCount = 0;
  isSubscribed = false;

  comments: Comment[] = [];

  newComment = '';
  commentError = false;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.themeId = params['id'];

      this.themesService.getThemeById(this.themeId).subscribe(themeData => {
        this.themeTitle = themeData.themeName;
        this.themeDate = new Date(themeData.created_at).toLocaleString();
        this.subscribersCount = themeData.subscribers.length;

        const currentUser = this.authService.currentUser();
        this.isSubscribed = currentUser
          ? themeData.subscribers.includes(currentUser.id)
          : false;

        this.comments = themeData.comments || [];

        this.cdr.detectChanges();
      });
    });
  }

  toggleSubscribe(): void {
    const currentUser = this.authService.currentUser();
    if (!currentUser) return;

    if (this.isSubscribed) {
      // Отписване - намаляваме брояча и сменяме флага
      this.subscribersCount = Math.max(0, this.subscribersCount - 1);
      this.isSubscribed = false;
    } else {
      // Абониране - увеличаваме брояча и сменяме флага
      this.subscribersCount++;
      this.isSubscribed = true;
    }

    this.cdr.detectChanges();
    console.log(`${this.isSubscribed ? 'Subscribed' : 'Unsubscribed'} locally to theme ${this.themeId}`);
  }

  likeComment(commentId: string): void {
    const comment = this.comments.find(c => c.id === commentId);
    if (!comment) return;

    if (comment.liked) {
      comment.likes--;
      comment.liked = false;
    } else {
      comment.likes++;
      comment.liked = true;
      if (comment.disliked) {
        comment.disliked = false;
      }
    }
  }

  dislikeComment(commentId: string): void {
    const comment = this.comments.find(c => c.id === commentId);
    if (!comment) return;

    if (comment.disliked) {
      comment.disliked = false;
    } else {
      comment.disliked = true;
      if (comment.liked) {
        comment.likes--;
        comment.liked = false;
      }
    }
  }

  isCommentValid(): boolean {
    return this.newComment.trim().length >= 10;
  }

  addComment(): void {
    if (!this.isCommentValid()) {
      this.commentError = true;
      return;
    }

    this.commentError = false;

    const newComment: Comment = {
      id: Date.now().toString(),
      text: this.newComment,
      author: this.authService.currentUser()?.username || 'Anonymous',
      date: new Date().toLocaleString(),
      likes: 0,
      liked: false,
      disliked: false
    };

    this.comments.unshift(newComment);
    this.newComment = '';
    this.cdr.detectChanges();
  }

  trackByCommentId(index: number, comment: Comment): string {
    return comment.id;
  }
}