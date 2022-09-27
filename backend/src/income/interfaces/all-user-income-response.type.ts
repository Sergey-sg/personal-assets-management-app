import { AllUserIncomeResponseDto } from '../dto/all-user-income-response.dto';

export type AllUserIncomeResponseType = Omit<
  AllUserIncomeResponseDto,
  'hashPassword'
>;
