import { CryptoPortfolioEntity } from "../crypto/cryptoPortfolio/entities/cryptoPortfolio.entity";
import { PageMetaDto } from "../pagination/dto/page-meta.dto";
import { PageDto } from "../pagination/dto/page.dto";
import { UserEntity } from "../user/entities/user.entity";
import { InvoiceEntity } from "./entities/invoice.entity";
import { InvoicesController } from "./invoices.controller";
import { InvoicesService } from "./invoices.service";
import { Test } from '@nestjs/testing';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';

const moduleMocker = new ModuleMocker(global);


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

describe('InvoiceController', () => {
    let controller: InvoicesController;
    let service: InvoicesService
  
    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [InvoicesController],
          })
          .useMocker((token) => {
            const results = pageDto;
            if (token === InvoicesService) {
              return { getAllInvoicesForUser: jest.fn().mockResolvedValue(results) };
            }
            if (typeof token === 'function') {
              const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
              const Mock = moduleMocker.generateFromMetadata(mockMetadata);
              return new Mock();
            }
          })
          .compile();
          
          controller = moduleRef.get(InvoicesController);
    });
  
    describe('getAllInvoices', () => {
      it('should return an array of invoices', async () => {
        const result = pageDto;
        // jest.spyOn(InvoicesService, 'getAllInvoicesForUser').mockImplementation(async () => result);
  
        expect(await controller.getAllInvoices({
            id: 1,
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            address: "",
            phone: "",
            birthdate: undefined,
            isVerified: false,
            avatarPath: "",
            wallets: [],
            hasCryptoWallet: false,
            invoice: new InvoiceEntity,
            income_transactions: [],
            costs_transactions: [],
            cryptoPortfolio: new CryptoPortfolioEntity,
            displayInvoices: [],
            messages: [],
            createdAt: undefined,
            updatedAt: undefined
        }, {})).toBe(result);
      });
    });

    // describe('getOneById', () => {
    //   it('should return one invoice', async () => {
    //     const result = pageDto;
    //     // jest.spyOn(InvoicesService, 'getAllInvoicesForUser').mockImplementation(async () => result);
  
    //     expect(await service.getOneById(false, 1,{
    //         id: 1,
    //         firstName: "",
    //         lastName: "",
    //         email: "",
    //         password: "",
    //         address: "",
    //         phone: "",
    //         birthdate: undefined,
    //         isVerified: false,
    //         avatarPath: "",
    //         wallets: [],
    //         hasCryptoWallet: false,
    //         invoice: new InvoiceEntity,
    //         income_transactions: [],
    //         costs_transactions: [],
    //         cryptoPortfolio: new CryptoPortfolioEntity,
    //         displayInvoices: [],
    //         messages: [],
    //         createdAt: undefined,
    //         updatedAt: undefined
    //     })).toBe(result.data.filter((invoice) => invoice.id === 1));
    //   });
    // });
  });