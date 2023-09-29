import { jsonResponse } from '@/libs';

export const GET = async () =>
  jsonResponse(200, {
    status: 'success',
    message: 'Hello world!',
  });
