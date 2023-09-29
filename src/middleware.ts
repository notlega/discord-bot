import type { NextRequest } from 'next/server';
import { verifyKey } from 'discord-interactions';

import { jsonResponse } from '@/libs';

export const middleware = async (req: NextRequest) => {
  const signature = req.headers.get('X-Signature-Ed25519');
  const timestamp = req.headers.get('X-Signature-Timestamp');

  if (!signature || !timestamp) {
    return jsonResponse(400, {
      status: 'error',
      message: 'Invalid request signature or timestamp',
    });
  }

  const isValidDiscordReq = verifyKey(
    await req.text(),
    signature,
    timestamp,
    process.env.DISCORD_PUBLIC_KEY!,
  );

  if (!isValidDiscordReq) {
    return jsonResponse(401, {
      status: 'error',
      message: 'Invalid Discord request',
    });
  }
};

export const config = {
  matcher: '/api/interactions',
};
