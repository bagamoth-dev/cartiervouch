const { Client, GatewayIntentBits, EmbedBuilder, SlashCommandBuilder, REST, Routes } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
let vouchCount = 0;

const commands = [
    new SlashCommandBuilder()
        .setName('vouch')
        .setDescription('Create a new customer review / vouch')
        .addIntegerOption(option =>
            option.setName('stars')
                .setDescription('Rating (1-5 stars)')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(5))
        .addStringOption(option =>
            option.setName('comment')
                .setDescription('Your review or feedback')
                .setRequired(true))
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken('BOT_TOKENED_HELYE');

client.once('ready', async () => {
    console.log(`Bot is online: ${client.user.tag}`);
    try {
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands },
        );
        console.log('Slash commands registered successfully!');
    } catch (error) {
        console.error(error);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'vouch') {
        const stars = interaction.options.getInteger('stars');
        const comment = interaction.options.getString('comment');
        
        vouchCount++;
        const starEmoji = '⭐'.repeat(stars);
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

        const vouchEmbed = new EmbedBuilder()
            .setColor('#00E5FF')
            .setTitle('New vouch created!')
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: '\u200B', value: `${starEmoji}` },
                { name: 'Vouch:', value: comment },
                { name: 'Vouch Nº:', value: `${vouchCount}`, inline: true },
                { name: 'Vouched by:', value: `<@${interaction.user.id}>`, inline: true },
                { name: 'Vouched at:', value: timestamp, inline: true }
            )
            .setFooter({ 
                text: `${client.user.username}`, 
                iconURL: client.user.displayAvatarURL() 
            })
            .setTimestamp();

        await interaction.reply({ embeds: [vouchEmbed] });
    }
});

client.login('BOT_TOKENED_HELYE');