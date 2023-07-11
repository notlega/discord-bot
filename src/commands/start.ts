import {
    CommandInteraction,
    GuildMemberRoleManager,
    SlashCommandBuilder,
} from 'discord.js';
import {
    DescribeInstancesCommand,
    StartInstancesCommand,
} from '@aws-sdk/client-ec2';
import { ec2Client, loggers } from '../utils';
import { Command } from '../types';

const data = new SlashCommandBuilder()
    .setName('start')
    .setDescription('Start Java Server');

const execute = async (interaction: CommandInteraction) => {
    // check if user has permission to run this command
    if (
        !(interaction.member?.roles as GuildMemberRoleManager).cache.has(
            process.env.DISCORD_ROLE_ID as string,
        )
    ) {
        loggers.warn(
            `${interaction.user.username} does not have permission to run this command`,
        );
        interaction.reply({
            content: 'You do not have permission to run this command',
            ephemeral: true,
        });
        return;
    }

    loggers.info(`Starting Java Server...`);

    let instanceId: string;

    const describeInstancesCommand = new DescribeInstancesCommand({
        Filters: [
            {
                Name: 'tag:Name',
                Values: ['java-minecraft-server'],
            },
        ],
    });

    try {
        const { Reservations } = await ec2Client.send(describeInstancesCommand);

        if (!Reservations) {
            loggers.error('No reservations found');
            interaction.reply({
                content: 'something broke, ask hinjourn to fix',
            });
            return;
        }

        if (!Reservations[0]?.Instances) {
            loggers.error('No instances found');
            interaction.reply({
                content: 'something broke, ask hinjourn to fix',
            });
            return;
        }

        if (
            Reservations[0].Instances[0]?.State?.Code === 16 ||
            Reservations[0].Instances[0]?.State?.Name === 'running'
        ) {
            loggers.info(`Java Server is already running`);
            interaction.reply({
                content: `Java Server is already running at ${Reservations[0].Instances[0]?.PublicIpAddress}`,
            });
            return;
        }

        instanceId = Reservations[0].Instances[0]?.InstanceId as string;
    } catch (error) {
        loggers.error(`Error retrieving data from AWS: ${error}`);
        interaction.reply({
            content: 'something broke, ask hinjourn to fix',
        });
        return;
    }

    const startInstancesCommand = new StartInstancesCommand({
        InstanceIds: [instanceId],
    });

    let newInstanceId: string;

    try {
        const { StartingInstances } = await ec2Client.send(
            startInstancesCommand,
        );

        if (!StartingInstances) {
            loggers.error('No instances found');
            interaction.reply({
                content: 'something broke, ask hinjourn to fix',
            });
            return;
        }

        if (!StartingInstances[0]?.CurrentState) {
            loggers.error('No current state found');
            interaction.reply({
                content: 'something broke, ask hinjourn to fix',
            });
            return;
        }

        newInstanceId = StartingInstances[0]?.InstanceId as string;
    } catch (error) {
        loggers.error(`Error starting instance: ${error}`);
        interaction.reply({
            content: 'something broke, ask hinjourn to fix',
        });
        return;
    }

    const describeInstancesCommand2 = new DescribeInstancesCommand({
        InstanceIds: [newInstanceId],
    });

    let serverIp: string;

    try {
        const { Reservations } = await ec2Client.send(describeInstancesCommand2);

        if (!Reservations) {
            loggers.error('No reservations found');
            interaction.reply({
                content: 'something broke, ask hinjourn to fix',
            });
            return;
        }

        if (!Reservations[0]?.Instances) {
            loggers.error('No instances found');
            interaction.reply({
                content: 'something broke, ask hinjourn to fix',
            });
            return;
        }
    } catch (error) {
        loggers.error(`Error retrieving data from AWS: ${error}`);
        interaction.reply({
            content: 'something broke, ask hinjourn to fix',
        });
        return;
    }

    loggers.info('Started Java Server');
    interaction.reply({
        content: 'Started Java Server',
    });
};

export default {
    data,
    execute,
} as Command;
