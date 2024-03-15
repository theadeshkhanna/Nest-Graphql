import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreatePostInput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  content: string;

  @Field(() => Int)
  userId: number;

  @Field(() => Boolean, { nullable: true })
  isPublished: boolean;
}
