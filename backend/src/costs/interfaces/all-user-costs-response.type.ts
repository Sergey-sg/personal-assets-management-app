import { AllUserCostsResponseDto } from '../dto/all-user-costs-response.dto';

export type AllUserCostsResponseType = Omit<
  AllUserCostsResponseDto,
  'hashPassword'
>;
