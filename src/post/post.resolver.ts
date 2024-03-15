import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PostService } from './post.service';
import { Post } from './entities/post.entity';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Resolver(() => Post)
export class PostResolver {
  constructor(
    private readonly postService: PostService,
    private readonly userService: UserService,
  ) {}

  @Mutation(() => Post)
  async createPost(@Args('createPostInput') createPostInput: CreatePostInput) {
    const user = await this.userService.findOne(createPostInput.userId);
    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    }
    return this.postService.create(user, createPostInput);
  }

  @Query(() => [Post], { name: 'posts' })
  findAll() {
    return this.postService.findAll();
  }

  @Query(() => Post, { name: 'post' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    const post = await this.postService.findOne(id);
    if (!post) {
      throw new HttpException('Post does not exist', HttpStatus.NOT_FOUND);
    }
    return post;
  }

  @Query(() => [Post], { name: 'usersPost' })
  async findPostsByUserId(@Args('userId', { type: () => Int }) userId: number) {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    }

    return this.postService.findPostsByUserId(userId);
  }

  @Mutation(() => Post)
  async updatePost(@Args('updatePostInput') updatePostInput: UpdatePostInput) {
    const post = await this.postService.findOne(updatePostInput.id);
    if (!post) {
      throw new HttpException('Post does not exist', HttpStatus.NOT_FOUND);
    }
    return this.postService.update(post, updatePostInput);
  }

  @Mutation(() => Post)
  async makePostPublished(@Args('id', { type: () => Int }) id: number) {
    const post = await this.postService.findOne(id);
    if (!post) {
      throw new HttpException('Post does not exist', HttpStatus.NOT_FOUND);
    }

    if (post.isPublished) {
      throw new HttpException('Post is already published', HttpStatus.CONFLICT);
    }

    return this.postService.update(post, { id: id, isPublished: true });
  }

  @Mutation(() => Post)
  async makePostUnpublished(@Args('id', { type: () => Int }) id: number) {
    const post = await this.postService.findOne(id);
    if (!post) {
      throw new HttpException('Post does not exist', HttpStatus.NOT_FOUND);
    }

    if (!post.isPublished) {
      throw new HttpException(
        'Post is already unpublished',
        HttpStatus.CONFLICT,
      );
    }

    return this.postService.update(post, { id: id, isPublished: false });
  }

  @Mutation(() => Post)
  async removePost(@Args('id', { type: () => Int }) id: number) {
    const post = await this.postService.findOne(id);
    if (!post) {
      throw new HttpException('Post does not exist', HttpStatus.NOT_FOUND);
    }
    return this.postService.remove(id);
  }
}
