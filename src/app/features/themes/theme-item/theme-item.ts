import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { Theme } from '../../../models';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services';
import { RouterLink } from '@angular/router';
import { SliceTitlePipe } from '../../../shared/pipes';

@Component({
  selector: 'app-theme-item',
  standalone: true,
  imports: [CommonModule, RouterLink, SliceTitlePipe],
  templateUrl: './theme-item.html',
  styleUrls: ['./theme-item.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThemeItem {
  @Input() theme!: Theme;

  private authService = inject(AuthService);
  subscribed = false;

  ngOnInit() {
    this.subscribed = this.isSubscribed(this.theme._id);
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get currentUserId(): string | null {
    return this.authService.getCurrentUserId();
  }

  isSubscribed(themeId: string): boolean {
    return this.theme.subscribers.some(sub => sub === this.currentUserId);
  }

  toggleSubscribe(themeId: string): void {
    if (!this.isLoggedIn) return;

    if (this.subscribed) {
      const index = this.theme.subscribers.indexOf(this.currentUserId!);
      if (index > -1) this.theme.subscribers.splice(index, 1);
    } else {
      this.theme.subscribers.push(this.currentUserId!);
    }

    this.subscribed = !this.subscribed;
    console.log(`${this.subscribed ? 'Subscribed' : 'Unsubscribed'} to theme ${themeId}`);
  }
}