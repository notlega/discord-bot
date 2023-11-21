import type { ServerRuntime } from 'next';
import { NextResponse, type NextRequest } from 'next/server';
import {
  type APIApplicationCommandInteraction,
  type APIInteraction,
  InteractionType,
  InteractionResponseType,
} from 'discord-api-types/v10';

import { jsonResponse } from '@/libs';
import type { Command } from '@/types';
import * as commandModules from '@/commands';

const commands: Record<string, Command> = Object(commandModules);

export const POST = async (req: NextRequest) => {
  const interactionNew = (await req.json()) as APIInteraction;

  if (interactionNew.type === InteractionType.Ping) {
    return NextResponse.json({
      type: InteractionResponseType.Pong,
    });
  }

  const interaction = interactionNew as APIApplicationCommandInteraction;

  if (interaction.type === InteractionType.ApplicationCommand) {
    return commands[interaction.data.name].execute(interaction);
  }

  return jsonResponse(400, {
    status: 'error',
    message: 'Bad request',
  });
};

export const runtime: ServerRuntime = 'edge';
