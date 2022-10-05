import {
  Inject,
  Injectable,
  forwardRef,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { AuthService } from 'src/auth/auth.service';
import { v4 } from 'uuid';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CONSTANTS } from 'src/shared/constants';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly dataSource: DataSource,
    @Inject(CloudinaryService) private cloudinaryService: CloudinaryService,
  ) {}

  async findAll(
    paginationQuery: PaginationQueryDto,
  ): Promise<{ users: UserEntity[]; total: number }> {
    const { limit, offset } = paginationQuery;

    const [users, total] = await this.userRepository.findAndCount({
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'phone',
        'address',
        'birthdate',
        'avatarPath',
      ],
      relations: {
        wallets: true,
      },
      take: limit,
      skip: offset,
    });

    return {
      users,
      total,
    };
  }

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      select: [
        'id',
        'email',
        'firstName',
        'lastName',
        'phone',
        'address',
        'birthdate',
        'avatarPath',
      ],
      relations: {
        wallets: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getUserProfile(id: number): Promise<UserEntity> {
    const userProfile = await this.userRepository.findOne({
      where: {
        id,
      },
      select: [
        'email',
        'firstName',
        'lastName',
        'phone',
        'address',
        'birthdate',
        'avatarPath',
      ],
    });

    return userProfile;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    if (updateUserDto.password) {
      updateUserDto.password = await this.authService.hashPassword(
        updateUserDto.password,
      );
    }

    if (updateUserDto.email) {
      const activationLink = v4();
      updateUserDto.activationLink = activationLink;
      updateUserDto.isVerified = false;

      // add implementation of email sending

      // await this.authService.sendActivationLink(
      //   updateUserDto.email,
      //   activationLink,
      // );
    }

    const updatedUser = await this.userRepository.save({
      ...user,
      ...updateUserDto,
    });

    const userProfile = await this.getUserProfile(updatedUser.id);

    return userProfile;
  }

  async updateAvatar(id: number, file: Express.Multer.File) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      select: ['avatarPath'],
    });

    if (user !== null) {
      const avatarPublicId = user.avatarPath.split('/').pop().split('.')[0];

      await this.cloudinaryService.destroyImage(
        `${CONSTANTS.CLOUDINARY_FOLDER}/${avatarPublicId}`,
      );
    }

    const avatar = await this.cloudinaryService.uploadAvatar(file);
    const avatarUrl = `/v${avatar.version}/${avatar.public_id}.${avatar.format}`;

    const updatedUser = await this.update(id, {
      ...user,
      avatarPath: avatarUrl,
    });
    return updatedUser;
  }

  async remove(id: number, userData: { password: string }) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    const validateUser = await this.authService.validateUser({
      ...user,
      email: user.email,
      password: userData.password,
    });

    return this.userRepository.delete(validateUser.id);
  }
}
