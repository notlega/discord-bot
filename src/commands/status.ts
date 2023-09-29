import { NextResponse } from 'next/server';
import { SlashCommandBuilder } from '@discordjs/builders';
import { DescribeInstancesCommand } from '@aws-sdk/client-ec2';
import {
  type APIApplicationCommandInteraction,
  InteractionResponseType,
} from 'discord-api-types/v10';

import { ec2Client } from '@/libs';
import { Command } from '@/types';

const data = new SlashCommandBuilder()
  .setName('status')
  .setDescription('Get the status of the Java Server');

const execute = async (interaction: APIApplicationCommandInteraction) => {
  // check if user has permission to run this command
  if (!interaction.member?.roles?.includes(process.env.DISCORD_ROLE_ID!)) {
    return NextResponse.json({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: { content: 'You do not have permission to run this command' },
      ephermeral: true,
    });
  }

  const javaInstanceCommand = new DescribeInstancesCommand({
    Filters: [
      {
        Name: 'tag:Name',
        Values: ['java-minecraft-server'],
      },
    ],
  });

  try {
    const { Reservations } = await ec2Client.send(
      javaInstanceCommand,
    );

    if (!Reservations) {
      return NextResponse.json({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: { content: 'No Java Reservations found' },
      });
    }

    if (!Reservations[0]?.Instances) {
      return NextResponse.json({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: { content: 'No Java Instances found' },
      });
    }

    if (!Reservations[0].Instances[0]?.State) {
      return NextResponse.json({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: { content: 'No Java Instance State found' },
      });
    }

    return NextResponse.json({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: `Java Server is ${
          Reservations[0].Instances[0].State.Name
        }${
          Reservations[0].Instances[0].State.Name === 'running'
            ? ` at ${Reservations[0].Instances[0].PublicIpAddress}`
            : ''
        }`,
      },
    });
  } catch (error) {
    return NextResponse.json({
      type: InteractionResponseType.ChannelMessageWithSource,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: { content: (error as any).message },
    });
  }
};

export default {
  data,
  execute,
} as Command;
