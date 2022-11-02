import * as request from 'supertest';
import { InvoiceEntity } from './entities/invoice.entity';
import { UserEntity } from '../user/entities/user.entity';
import { PageMetaDto } from '../pagination/dto/page-meta.dto';
import { PageDto } from '../pagination/dto/page.dto';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { InvoicesModule } from './invoices.module';
import { InvoicesService } from './invoices.service';

const invoiceTest: InvoiceEntity = {
    createdBy: new UserEntity(),
    billedTo: new UserEntity,
    items: [],
    paid: false,
    discount: 0,
    dueDate: new Date('2022-30-10T22:30:00'),
    invoiceDate: new Date('2022-28-10T22:30:00'),
    invoiceDetails: "test",
    category: "other",
    total: 0,
    displayForUsers: [],
    id: 1,
    createdAt: new Date('2022-28-10T22:30:00'),
    updatedAt: new Date('2022-28-10T22:30:00')
}
const pageMetaDto = new PageMetaDto({
    pageOptionsDto: {take: 10, page: 1, skip: 0},
    itemCount: 1,
  });
const pageDto = new PageDto([{...invoiceTest, id: 1}, {...invoiceTest, id: 2}], pageMetaDto);

describe('Cats', () => {
  let app: INestApplication;
  let invoicesService = { getAllInvoices: () => pageDto };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [InvoicesModule],
    })
      .overrideProvider(InvoicesService)
      .useValue(invoicesService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET invoices`, () => {
    return request(app.getHttpServer())
      .get('/invoices')
      .expect(200)
      .expect({
        data: invoicesService.getAllInvoices(),
      });
  });

  afterAll(async () => {
    await app.close();
  });
});