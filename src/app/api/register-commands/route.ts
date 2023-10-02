import type { ServerRuntime } from 'next';
import type { NextRequest } from 'next/server';

import { jsonResponse, rest } from '@/libs';
import type { Command } from '@/types';
import * as commandModules from '@/commands';

export const POST = async (req: NextRequest) => {
  if (!process.env.CHALLENGE_KEY) {
    return jsonResponse(500, {
      status: 'error',
      message: 'Challenge key is not set',
    });
  }

  if (!req.body) {
    return jsonResponse(400, {
      status: 'error',
      message: 'Bad request',
    });
  }

  const { CHALLENGE_KEY } = await req.json();

  if (CHALLENGE_KEY !== process.env.CHALLENGE_KEY) {
    return jsonResponse(401, {
      status: 'error',
      message: 'Unauthorized',
    });
  }

  const commands = Object.values<Command>(commandModules).map(
    (commandModule) => commandModule.data,
  );

  try {
    await rest.put(
      `/applications/${process.env.DISCORD_APPLICATION_ID}/guilds/${process.env.DISCORD_GUILD_ID}/commands`,
      {
        body: commands,
      },
    );

    return jsonResponse(200, {
      status: 'success',
      message: 'Commands registered successfully!',
    });
  } catch (error) {
    return jsonResponse(500, {
      status: 'error',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      message: (error as any).message,
    });
  }
};

export const runtime: ServerRuntime = 'edge';
