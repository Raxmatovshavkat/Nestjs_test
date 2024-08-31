import { PartialType } from '@nestjs/mapped-types';
import { RefreshTokenDto } from './create-refresh-token.dto';

export class UpdateRefreshTokenDto extends PartialType(RefreshTokenDto) {}
