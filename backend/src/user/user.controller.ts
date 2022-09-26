import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  OmitType,
} from '@nestjs/swagger';
import { REGEX } from 'src/common/constants/regexp';

import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users and return an array of them.' })
  @ApiOkResponse({
    description: 'All users have been successfully returned in array',
    type: [
      OmitType(UserEntity, ['password', 'refreshTokenHash', 'activationLink']),
    ],
  })
  async findAll(@Query() paginationQuery: PaginationQueryDto) {
    return await this.userService.findAll(paginationQuery);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id and return it.' })
  @ApiOkResponse({
    description: 'User has been successfully returned',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          example: 1,
        },
        email: {
          type: 'string',
          example: 'johndoe@gmail.com',
        },
        firstName: {
          type: 'string',
          example: 'John',
        },
        lastName: {
          type: 'string',
          example: 'Doe',
        },
        phone: {
          type: 'string',
          example: '+380000000000',
        },
        address: {
          type: 'string',
          example: 'Kyiv, Ukraine',
        },
        birthdate: {
          type: 'string',
          example: '2000-01-01',
        },
        avatarPath: {
          type: 'string',
          example:
            'http://res.cloudinary.com/myfinance/image/upload/v1663852314/MyFinance/yx5xzpm6ivnjjarg9cj3.webp',
        },
        wallet: {
          type: 'object',
          properties: {
            id: {
              type: 'number',
            },
            sum: {
              type: 'number',
            },
            name: {
              type: 'string',
            },
          },
        },
      },
    },
  })
  async findOne(@Param('id') id: number) {
    return await this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user by id.' })
  @ApiOkResponse({
    description: 'User with specified id has been successfully updated',
    type: OmitType(UserEntity, [
      'password',
      'refreshTokenHash',
      'activationLink',
    ]),
  })
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Patch('avatar/:id')
  @ApiOperation({ summary: 'Update a user avatar by id.' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Avatar file',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'User avatar with specified id has been successfully updated',
    type: OmitType(UserEntity, [
      'password',
      'refreshTokenHash',
      'activationLink',
    ]),
  })
  @UseInterceptors(FileInterceptor('file'))
  async updateAvatar(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5000000 }),
          new FileTypeValidator({
            fileType: REGEX.FILE_TYPE_RULE,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.userService.updateAvatar(id, updateUserDto, file);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user profile by id and password.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        password: {
          type: 'string',
          example: 'John@123',
        },
      },
    },
  })
  @ApiNoContentResponse()
  async remove(
    @Param('id') id: number,
    @Body() userData: { password: string },
  ) {
    return this.userService.remove(id, userData);
  }
}
