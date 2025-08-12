import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  private router = inject(Router);
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

  themeAuthorId = '';  // ще пазим id на автора

  // За inline редакция на тема
  isEditingTheme = false;
  editedThemeName = '';

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.themeId = params['id'];

      this.themesService.getThemeById(this.themeId).subscribe(themeData => {
        console.log('themeData.userId:', themeData.userId);
        this.themeTitle = themeData.themeName;
        this.themeDate = new Date(themeData.created_at).toLocaleString();
        this.subscribersCount = themeData.subscribers.length;

        this.themeAuthorId = themeData.userId;  // Взимаме id на автора
        this.editedThemeName = this.themeTitle;

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
      this.subscribersCount = Math.max(0, this.subscribersCount - 1);
      this.isSubscribed = false;
    } else {
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

  // Inline редакция на тема

  startEditTheme(): void {
  this.isEditingTheme = true;
  this.editedThemeName = this.themeTitle;
}

cancelEditTheme(): void {
  this.isEditingTheme = false;
}

saveTheme(): void {
  const trimmedName = this.editedThemeName.trim();
  if (!trimmedName) {
    alert('Theme name cannot be empty');
    return;
  }

  this.themesService.updateTheme(this.themeId, { themeName: trimmedName }).subscribe({
    next: (updatedTheme: any) => {
      this.themeTitle = updatedTheme.themeName;
      this.isEditingTheme = false;
      this.cdr.detectChanges();
      console.log('Theme updated successfully');
    },
    error: (err) => {
      console.error('Update failed', err);
      alert('Failed to update theme. Please try again.');
    }
  });
}

  // Изтриване на тема

  onDeleteTheme(): void {
    if (!confirm('Are you sure you want to delete this theme?')) return;

    this.themesService.deleteTheme(this.themeId).subscribe(() => {
      console.log(`Theme ${this.themeId} deleted`);
      this.router.navigate(['/themes']);
    });
  }
}