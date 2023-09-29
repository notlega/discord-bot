import { NextResponse } from 'next/server';
import { SlashCommandBuilder } from '@discordjs/builders';
import {
  InteractionResponseType,
} from 'discord-api-types/v10';

import { Command } from '@/types';

const data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('replies with pong');

const execute = () =>
  NextResponse.json({
    type: InteractionResponseType.ChannelMessageWithSource,
    data: { content: 'pong' },
  });

export default {
  data,
  execute,
} as Command;
