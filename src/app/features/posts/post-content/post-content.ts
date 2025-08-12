import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService, PostsService } from '../../../core/services';
import { Post } from '../../../models';


@Component({
  selector: 'app-post-content',
  imports: [CommonModule, FormsModule],
  templateUrl: './post-content.html',
  styleUrls: ['./post-content.css']
})
export class PostContent implements OnInit {
  private route = inject(ActivatedRoute);
  private postsService = inject(PostsService);
  protected authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  postId!: string;
  postText = '';
  postDate = '';

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.postId = params['id'];

      // Взимаме всички постове
     this.postsService.getAllPosts().subscribe({
  next: posts => {
   const post = posts.find(p => p._id === this.postId);
    if (post) {
      this.postText = post.text;
      this.postDate = new Date(post.created_at).toLocaleString();
      this.cdr.detectChanges();
    }
  },
  error: err => {
    console.error('Error loading posts:', err);
  }
});
      });
  }
}
