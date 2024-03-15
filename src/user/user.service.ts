import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  create(createUserInput: CreateUserInput) {
    return this.userRepository.save(createUserInput);
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  update(user: User, updateUserInput: UpdateUserInput) {
    if (updateUserInput.name) {
      user.name = updateUserInput.name;
    }

    if (updateUserInput.email) {
      user.email = updateUserInput.email;
    }

    return this.userRepository.save(user);
  }

  remove(id: number) {
    return this.userRepository.delete({ id });
  }
}
