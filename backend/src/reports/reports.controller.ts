import { SkipThrottle } from '@nestjs/throttler';
import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';

@SkipThrottle()
@Controller('overview')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('search?')
  getReportOfPeriod(
    @Query('walletId') walletId: number | string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const report = this.reportsService.getReportOfPeriod(
      walletId,
      startDate,
      endDate,
    );

    return report;
  }

  @Get('s?')
  getLatestOperations(@Query('walletId') walletId: number) {
    const latestOperations =
      this.reportsService.getWalletRelatedOperations(walletId);

    return latestOperations;
  }
}
