import type ApiResponse from '@/types/ApiResponse';

export default interface ApiErrorResponse extends ApiResponse {
  Error: string;
}
