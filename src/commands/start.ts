import { NextResponse } from 'next/server';
import { SlashCommandBuilder } from '@discordjs/builders';
import {
  DescribeInstancesCommand,
  StartInstancesCommand,
} from '@aws-sdk/client-ec2';
import {
  type APIApplicationCommandInteraction,
  InteractionResponseType,
} from 'discord-api-types/v10';

import { ec2Client } from '@/libs';
import { Command } from '@/types';

const data = new SlashCommandBuilder()
  .setName('start')
  .setDescription('Start Terraria Vanilla Server');

const execute = async (interaction: APIApplicationCommandInteraction) => {
  // check if user has permission to run this command
  if (!interaction.member?.roles?.includes(process.env.DISCORD_ROLE_ID!)) {
    return NextResponse.json({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: { content: 'You do not have permission to run this command' },
      ephermeral: true,
    });
  }

  let instanceId: string;

  const describeInstancesCommand = new DescribeInstancesCommand({
    Filters: [
      {
        Name: 'tag:Name',
        Values: ['terraria-vanilla'],
      },
    ],
  });

  try {
    const { Reservations } = await ec2Client.send(describeInstancesCommand);

    if (!Reservations) {
      return NextResponse.json({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: { content: 'No reservations found' },
      });
    }

    if (!Reservations[0]?.Instances) {
      return NextResponse.json({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: { content: 'No instances found' },
      });
    }

    if (
      Reservations[0].Instances[0]?.State?.Code === 16 ||
      Reservations[0].Instances[0]?.State?.Name === 'running'
    ) {
      return NextResponse.json({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: `Terraria Vanilla Server is already running at ${Reservations[0].Instances[0]?.PublicIpAddress}`,
        },
      });
    }

    instanceId = Reservations[0].Instances[0]?.InstanceId as string;
  } catch (error) {
    return NextResponse.json({
      type: InteractionResponseType.ChannelMessageWithSource,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: { content: (error as any).message },
    });
  }

  const startInstancesCommand = new StartInstancesCommand({
    InstanceIds: [instanceId],
  });

  let newInstanceId: string;

  try {
    const { StartingInstances } = await ec2Client.send(startInstancesCommand);

    if (!StartingInstances) {
      return NextResponse.json({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: { content: 'No instances found' },
      });
    }

    if (!StartingInstances[0]?.CurrentState) {
      return NextResponse.json({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: { content: 'No current state found' },
      });
    }

    newInstanceId = StartingInstances[0]?.InstanceId as string;
  } catch (error) {
    return NextResponse.json({
      type: InteractionResponseType.ChannelMessageWithSource,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: { content: (error as any).message },
    });
  }

  const describeInstancesCommand2 = new DescribeInstancesCommand({
    InstanceIds: [newInstanceId],
  });

  try {
    const { Reservations } = await ec2Client.send(describeInstancesCommand2);

    if (!Reservations) {
      return NextResponse.json({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: { content: 'No reservations found' },
      });
    }

    if (!Reservations[0]?.Instances) {
      return NextResponse.json({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: { content: 'No instances found' },
      });
    }
  } catch (error) {
    return NextResponse.json({
      type: InteractionResponseType.ChannelMessageWithSource,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: { content: (error as any).message },
    });
  }

  return NextResponse.json({
    type: InteractionResponseType.ChannelMessageWithSource,
    data: { content: 'Started Terraria Vanilla Server' },
  });
};

export default {
  data,
  execute,
} as Command;
