import {
    CommandInteraction,
    GuildMemberRoleManager,
    SlashCommandBuilder,
} from 'discord.js';
import {
    DescribeInstancesCommand,
} from '@aws-sdk/client-ec2';
import { ec2Client, loggers } from '../utils';
import { Command } from '../types';

const data = new SlashCommandBuilder()
    .setName('status')
    .setDescription('Get the status of the Java Server')

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

    loggers.info(`Getting server statuses...`);

    const javaInstanceCommand = new DescribeInstancesCommand({
        Filters: [
            {
                Name: 'tag:Name',
                Values: ['java-minecraft-server'],
            },
        ],
    });

    try {
        const { Reservations: JavaReservations } = await ec2Client.send(javaInstanceCommand);

        if (!JavaReservations) {
            loggers.error('No Java reservations found');
            interaction.reply({
                content: 'something broke, ask hinjourn to fix',
            });
            return;
        }

        if (!JavaReservations[0]?.Instances) {
            loggers.error('No Java instances found');
            interaction.reply({
                content: 'something broke, ask hinjourn to fix',
            });
            return;
        }

        if (!JavaReservations[0].Instances[0]?.State) {
            loggers.error('No Java instance state found');
            interaction.reply({
                content: 'something broke, ask hinjourn to fix',
            });
            return;
        }
        interaction.reply({
            content: `Java Server is ${JavaReservations[0].Instances[0].State.Name} at ${JavaReservations[0].Instances[0].PublicIpAddress}`,
        });
    } catch (error) {
        loggers.error(`Error retrieving data from AWS: ${error}`);
        interaction.reply({
            content: 'something broke, ask hinjourn to fix',
        });
    }
};

export default {
    data,
    execute,
} as Command;
