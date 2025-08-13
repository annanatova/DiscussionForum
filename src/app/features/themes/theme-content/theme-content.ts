import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemesService } from '../../../core/services/themes.service';
import { Comment } from '../../../models/comment';
import { Theme } from '../../../models/theme.model';
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
  theme?: Theme;
  comments: Comment[] = [];
  newComment = '';
  commentError = false;

  isEditingTheme = false;
  editedThemeName = '';
  currentUserId?: string;

  ngOnInit(): void {
    const user = this.authService.currentUser();
    this.currentUserId = user?.id;

    this.route.params.subscribe(params => {
      this.themeId = params['id'];

      this.themesService.getThemeById(this.themeId).subscribe(themeData => {
        this.theme = themeData;
        this.editedThemeName = this.theme.themeName;
        this.comments = this.theme.comments || [];
        this.cdr.detectChanges();
      });
    });
  }

  toggleSubscribe(): void {
    if (!this.currentUserId || !this.theme) return;

    const isSubscribed = this.theme.subscribers.includes(this.currentUserId);
    if (isSubscribed) {
      this.theme.subscribers = this.theme.subscribers.filter(id => id !== this.currentUserId);
    } else {
      this.theme.subscribers.push(this.currentUserId);
    }

    this.cdr.detectChanges();
  }

  public likeComment(commentId: string): void {
    const comment = this.comments.find(c => c.id === commentId);
    if (!comment) return;

    if (comment.liked) {
      comment.likes--;
      comment.liked = false;
    } else {
      comment.likes++;
      comment.liked = true;
      if (comment.disliked) comment.disliked = false;
    }
  }

  public dislikeComment(commentId: string): void {
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

  startEditTheme(): void {
    this.isEditingTheme = true;
    this.editedThemeName = this.theme?.themeName || '';
  }

  cancelEditTheme(): void {
    this.isEditingTheme = false;
  }

  saveTheme(): void {
    if (!this.theme) return;

    const trimmedName = this.editedThemeName.trim();
    if (!trimmedName) {
      alert('Theme name cannot be empty');
      return;
    }

    this.themesService.updateTheme(this.themeId, trimmedName).subscribe({
      next: (updatedTheme) => {
        this.theme!.themeName = updatedTheme.themeName;
        this.isEditingTheme = false;
        this.cdr.detectChanges();
        console.log('Theme updated successfully');
      },
      error: (err) => {
        console.error('Failed to update theme:', err);
        alert('Failed to update theme. Please try again.');
      }
    });
  }
onDeleteTheme(): void {
  if (!this.theme) return;
  if (!confirm('Are you sure you want to delete this theme?')) return;

  this.themesService.deleteTheme(this.themeId).subscribe({
    next: (response) => {
      console.log('Theme deleted successfully:', response);
      this.router.navigate(['/themes']);
    },
    error: (err) => {
      console.error('Error deleting theme:', err);
      alert('Failed to delete theme. Please try again.');
    }
  });
}

}