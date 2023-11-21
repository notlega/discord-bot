import { NextResponse } from 'next/server';
import { SlashCommandBuilder } from '@discordjs/builders';
import {
  APIApplicationCommandInteractionDataBasicOption,
  InteractionResponseType,
} from 'discord-api-types/v10';

import type { Command } from '@/types';

const data = new SlashCommandBuilder()
  .setName('twitter')
  .setDescription('edits twitter or x url to embed')
  .addStringOption((option) => {
    option.setName('url').setDescription('the url to embed').setRequired(true);
    return option;
  });

// TODO: fix type for interaction
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const execute = (interaction: any) => {
  const url: string = interaction.data.options.find(
    (option: APIApplicationCommandInteractionDataBasicOption) =>
      option.name === 'url',
  ).value;

  const isValidUrl = url.match(
    /^((?:http:\/\/)?|(?:https:\/\/)?)?(?:www\.)?(twitter|x)\.com\/?(\S+)?$/i,
  );

  if (!isValidUrl) {
    return NextResponse.json({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: 'invalid url',
      },
      ephermeral: true,
    });
  }

  const embedUrl = url.replace(/(twitter.com)|(x.com)/i, 'fxtwitter.com');

  return NextResponse.json({
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: `<@${interaction.member.user.id}> ${embedUrl}`,
    },
  });
};

export default {
  data,
  execute,
} as Command;
