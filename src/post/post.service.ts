import { Injectable } from '@nestjs/common';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}
  create(user: User, createPostInput: CreatePostInput) {
    const post = new Post();
    post.user = user;
    post.title = createPostInput.title;
    post.content = createPostInput.content;

    return this.postRepository.save(post);
  }

  findAll() {
    return this.postRepository.find({ relations: ['user'] });
  }

  findOne(id: number) {
    return this.postRepository.findOne({ where: { id }, relations: ['user'] });
  }

  findPostsByUserId(userId: number) {
    return this.postRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  update(post: Post, updatePostInput: UpdatePostInput) {
    if (updatePostInput.title) {
      post.title = updatePostInput.title;
    }

    if (updatePostInput.content) {
      post.content = updatePostInput.content;
    }

    if ('isPublished' in updatePostInput) {
      post.isPublished = updatePostInput.isPublished;
    }

    return this.postRepository.save(post);
  }

  remove(id: number) {
    return this.postRepository.delete({ id });
  }
}
