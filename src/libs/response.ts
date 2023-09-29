import { NextResponse } from 'next/server';
import type { BaseResponse, LegalStatusCodes } from '@/types';

/**
 * A helper function to send a json response
 *
 * @param res a next response object
 * @param statusCode a legal status code
 * @param baseResponse a response object that implements the BaseResponse interface
 * @returns a json response
 */
export const jsonResponse = (
  statusCode: LegalStatusCodes,
  { status, message, data }: BaseResponse,
) =>
  NextResponse.json(
    {
      status,
      code: statusCode,
      message,
      data,
    },
    {
      status: statusCode,
    },
  );
