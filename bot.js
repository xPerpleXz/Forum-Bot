const { Client, GatewayIntentBits, REST, Routes, ChannelType, EmbedBuilder, ActivityType } = require('discord.js');
require('dotenv').config();

// ============================================
// KONFIGURATION - Verwendet Umgebungsvariablen
// ============================================
const CONFIG = {
    TOKEN: process.env.DISCORD_TOKEN,
    CLIENT_ID: process.env.CLIENT_ID,
    FORUM_CHANNEL_ID: process.env.FORUM_CHANNEL_ID,
    GUILD_ID: process.env.GUILD_ID || null // Optional für schnellere Command-Updates
};

// ============================================
// REGEL-KATEGORIEN
// ============================================
const REGELN = {
    '1.1': '🔫 RDM (Random Deathmatch)',
    '1.2': '🚗 VDM (Vehicle Deathmatch)',
    '1.3': '❌ Fail RP',
    '1.4': '💪 Power RP',
    '1.5': '🧠 Meta Gaming',
    '1.6': '🎭 Char Mixing',
    '2.1': '💬 Beleidigung OOC',
    '2.2': '☠️ Toxisches Verhalten',
    '2.3': '🗣️ Spam/Werbung',
    '3.1': '🚪 Combat Logging',
    '3.2': '🛡️ Safezone Missbrauch',
    '3.3': '🏃 Flucht vor RP',
    '4.1': '📻 Nicht auf Funk',
    '4.2': '🤡 Unrealistisches Verhalten',
    '4.3': '🎮 Bug Ausnutzung',
    '5.1': '💰 Scamming OOC',
    '5.2': '🎯 Stream Sniping',
    'other': '⚠️ Sonstige Regelverstöße'
};

// ============================================
// CLIENT INITIALISIERUNG
// ============================================
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ],
    presence: {
        activities: [{
            name: 'Beschwerden bearbeiten 📋',
            type: ActivityType.Watching
        }],
        status: 'online'
    }
});

// ============================================
// LOGGING SYSTEM
// ============================================
const log = {
    info: (msg) => console.log(`[INFO] ${new Date().toISOString()} - ${msg}`),
    error: (msg) => console.error(`[ERROR] ${new Date().toISOString()} - ${msg}`),
    success: (msg) => console.log(`[SUCCESS] ${new Date().toISOString()} - ${msg}`),
    warn: (msg) => console.warn(`[WARN] ${new Date().toISOString()} - ${msg}`)
};

// ============================================
// KONFIGURATION VALIDIERUNG
// ============================================
function validateConfig() {
    const required = ['TOKEN', 'CLIENT_ID', 'FORUM_CHANNEL_ID'];
    const missing = required.filter(key => !CONFIG[key]);
    
    if (missing.length > 0) {
        log.error(`Fehlende Umgebungsvariablen: ${missing.join(', ')}`);
        log.error('Bitte setze alle erforderlichen Variablen in Railway oder .env Datei');
        process.exit(1);
    }
    
    log.success('Alle Konfigurationsvariablen sind gesetzt');
}

// ============================================
// SLASH COMMAND DEFINITION
// ============================================
const commands = [
    {
        name: 'beschwerde',
        description: '📋 Erstellt eine Beschwerde gegen einen Spieler',
        options: [
            {
                name: 'spieler_id',
                description: 'Die ID des gemeldeten Spielers (z.B. 12345)',
                type: 3,
                required: true,
                min_length: 1,
                max_length: 20
            },
            {
                name: 'regelverstoß',
                description: 'Welche Regel wurde verletzt?',
                type: 3,
                required: true,
                choices: Object.entries(REGELN).map(([key, value]) => ({
                    name: `${key} - ${value}`,
                    value: key
                }))
            },
            {
                name: 'beschreibung',
                description: 'Detaillierte Beschreibung des Vorfalls',
                type: 3,
                required: true,
                min_length: 20,
                max_length: 1024
            },
            {
                name: 'beweis_link',
                description: 'Link zu Beweisen (YouTube, Medal.tv, Streamable, etc.)',
                type: 3,
                required: false,
                max_length: 500
            },
            {
                name: 'datum_uhrzeit',
                description: 'Datum und Uhrzeit (z.B. 06.11.2025 - 15:30)',
                type: 3,
                required: false,
                max_length: 50
            }
        ]
    },
    {
        name: 'status',
        description: '🔍 Zeigt den Status des Bots an',
        options: []
    }
];

// ============================================
// BOT READY EVENT
// ============================================
client.once('ready', async () => {
    log.success(`Bot ist online als ${client.user.tag}`);
    log.info(`Bot ist auf ${client.guilds.cache.size} Server(n) aktiv`);
    
    // Commands registrieren
    await registerCommands();
    
    // Heartbeat für Railway
    setInterval(() => {
        log.info(`Heartbeat - Bot läuft - Ping: ${client.ws.ping}ms`);
    }, 300000); // Alle 5 Minuten
});

// ============================================
// INTERACTION HANDLER
// ============================================
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    try {
        if (interaction.commandName === 'beschwerde') {
            await handleBeschwerde(interaction);
        } else if (interaction.commandName === 'status') {
            await handleStatus(interaction);
        }
    } catch (error) {
        log.error(`Fehler bei Command ${interaction.commandName}: ${error.message}`);
        
        const errorMsg = {
            content: '❌ Ein Fehler ist aufgetreten. Bitte versuche es erneut oder kontaktiere einen Administrator.',
            ephemeral: true
        };
        
        if (interaction.deferred || interaction.replied) {
            await interaction.editReply(errorMsg).catch(() => {});
        } else {
            await interaction.reply(errorMsg).catch(() => {});
        }
    }
});

// ============================================
// STATUS COMMAND HANDLER
// ============================================
async function handleStatus(interaction) {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    
    const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('🤖 Bot Status')
        .addFields(
            { name: '✅ Status', value: 'Online und bereit', inline: true },
            { name: '📊 Ping', value: `${client.ws.ping}ms`, inline: true },
            { name: '⏰ Uptime', value: `${hours}h ${minutes}m ${seconds}s`, inline: true },
            { name: '🖥️ Server', value: `${client.guilds.cache.size}`, inline: true },
            { name: '👥 Nutzer', value: `${client.users.cache.size}`, inline: true },
            { name: '💾 Memory', value: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`, inline: true }
        )
        .setTimestamp()
        .setFooter({ text: 'Grand RP Bot - Railway Hosting' });
    
    await interaction.reply({ embeds: [embed], ephemeral: true });
}

// ============================================
// BESCHWERDE HANDLER
// ============================================
async function handleBeschwerde(interaction) {
    await interaction.deferReply({ ephemeral: true });
    
    try {
        // Input-Daten sammeln
        const spielerId = interaction.options.getString('spieler_id').trim();
        const regelVerstoß = interaction.options.getString('regelverstoß');
        const beschreibung = interaction.options.getString('beschreibung').trim();
        const beweisLink = interaction.options.getString('beweis_link')?.trim() || 'Keine Beweise angegeben';
        const datumUhrzeit = interaction.options.getString('datum_uhrzeit')?.trim() || new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' });
        
        const ersteller = interaction.user;
        const regelName = REGELN[regelVerstoß] || '⚠️ Unbekannt';
        
        log.info(`Neue Beschwerde von ${ersteller.tag} gegen Spieler ${spielerId}`);
        
        // Forum Channel holen mit Retry-Logik
        let forumChannel;
        try {
            forumChannel = await client.channels.fetch(CONFIG.FORUM_CHANNEL_ID);
        } catch (error) {
            log.error(`Forum Channel nicht gefunden: ${error.message}`);
            return await interaction.editReply({
                content: '❌ Forum Channel konnte nicht gefunden werden. Bitte kontaktiere einen Administrator.\n\n**Fehlerdetails:** Channel-ID ist möglicherweise falsch konfiguriert.',
                ephemeral: true
            });
        }
        
        if (forumChannel.type !== ChannelType.GuildForum) {
            log.error(`Channel ${CONFIG.FORUM_CHANNEL_ID} ist kein Forum-Channel`);
            return await interaction.editReply({
                content: '❌ Der konfigurierte Channel ist kein Forum-Channel! Bitte kontaktiere einen Administrator.',
                ephemeral: true
            });
        }
        
        // Forum Post Titel
        const postTitle = `🚨 Beschwerde gegen Spieler ${spielerId} - ${regelName}`;
        
        // Embed für den Post erstellen
        const embed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('📋 Beschwerde gegen Spieler')
            .setDescription('**Offizielle Beschwerde - Bitte vom Support-Team bearbeiten**')
            .addFields(
                { name: '👤 Gemeldeter Spieler', value: `\`\`\`${spielerId}\`\`\``, inline: false },
                { name: '⚠️ Regelverstoß', value: `**${regelVerstoß}** - ${regelName}`, inline: false },
                { name: '📅 Datum & Uhrzeit', value: `\`${datumUhrzeit}\``, inline: false },
                { name: '📝 Beschreibung des Vorfalls', value: beschreibung.substring(0, 1024), inline: false },
                { name: '🔗 Beweise', value: beweisLink, inline: false },
                { name: '👮 Erstellt von', value: `<@${ersteller.id}> (\`${ersteller.tag}\`)`, inline: false },
                { name: '🆔 Beschwerde-ID', value: `\`${Date.now()}\``, inline: false }
            )
            .setThumbnail(ersteller.displayAvatarURL({ dynamic: true }))
            .setFooter({ text: 'Grand Role Play - Beschwerde System | Status: Warten auf Bearbeitung' })
            .setTimestamp();
        
        // Detaillierte Text-Nachricht
        const detailText = `
╔═══════════════════════════════════════════╗
║     📋 BESCHWERDE GEGEN SPIELER          ║
╚═══════════════════════════════════════════╝

**👤 INFORMATIONEN ZUM GEMELDETEN SPIELER**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• **Spieler-ID:** \`${spielerId}\`

**⚠️ REGELVERSTOS**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• **Regel:** ${regelVerstoß}
• **Beschreibung:** ${regelName}

**📅 ZEITPUNKT DES VORFALLS**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• ${datumUhrzeit}

**📝 DETAILLIERTE BESCHREIBUNG**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${beschreibung}

**🔗 BEWEISMATERIAL**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${beweisLink}

**👮 BESCHWERDE EINGEREICHT VON**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
<@${ersteller.id}> (\`${ersteller.tag}\`)

╔═══════════════════════════════════════════╗
║            ℹ️ WICHTIGE HINWEISE           ║
╚═══════════════════════════════════════════╝

• ⏳ Bitte warten Sie auf eine Antwort des Support-Teams
• ⚖️ Falsche Anschuldigungen können zu Sanktionen führen
• 📞 Bei Rückfragen werden Sie kontaktiert
• 🔒 Diese Beschwerde wird vertraulich behandelt

**Status:** 🟡 In Bearbeitung
**Priorität:** 🔴 Hoch
**Ticket-ID:** \`${Date.now()}\`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*Grand Role Play - Beschwerde System v2.0*
`;
        
        // Forum Post erstellen mit Retry-Logik
        let forumPost;
        try {
            forumPost = await forumChannel.threads.create({
                name: postTitle.substring(0, 100), // Max 100 Zeichen für Titel
                message: {
                    content: detailText,
                    embeds: [embed]
                },
                autoArchiveDuration: 1440, // 24 Stunden
                reason: `Beschwerde von ${ersteller.tag} gegen Spieler ${spielerId}`
            });
            
            log.success(`Forum Post erfolgreich erstellt: ${forumPost.id}`);
            
        } catch (error) {
            log.error(`Fehler beim Erstellen des Forum Posts: ${error.message}`);
            return await interaction.editReply({
                content: `❌ Fehler beim Erstellen des Forum Posts.\n\n**Fehlerdetails:** ${error.message}\n\nBitte kontaktiere einen Administrator.`,
                ephemeral: true
            });
        }
        
        // Erfolgs-Embed
        const successEmbed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('✅ Beschwerde erfolgreich erstellt!')
            .setDescription(`Deine Beschwerde wurde im Forum erstellt und wird vom Support-Team bearbeitet.`)
            .addFields(
                { name: '📌 Forum Post', value: `[Hier klicken](${forumPost.url})`, inline: false },
                { name: '👤 Spieler-ID', value: `\`${spielerId}\``, inline: true },
                { name: '⚠️ Regelverstoß', value: `${regelVerstoß}`, inline: true },
                { name: '📊 Status', value: '🟡 In Bearbeitung', inline: true },
                { name: '🆔 Ticket-ID', value: `\`${Date.now()}\``, inline: false }
            )
            .setFooter({ text: 'Du wirst benachrichtigt, sobald es Updates gibt' })
            .setTimestamp();
        
        await interaction.editReply({
            embeds: [successEmbed],
            ephemeral: true
        });
        
    } catch (error) {
        log.error(`Unerwarteter Fehler in handleBeschwerde: ${error.message}`);
        log.error(error.stack);
        throw error;
    }
}

// ============================================
// COMMANDS REGISTRIEREN
// ============================================
async function registerCommands() {
    const rest = new REST({ version: '10' }).setToken(CONFIG.TOKEN);
    
    try {
        log.info('Registriere Slash Commands...');
        
        if (CONFIG.GUILD_ID) {
            // Guild-spezifische Commands (sofort verfügbar)
            await rest.put(
                Routes.applicationGuildCommands(CONFIG.CLIENT_ID, CONFIG.GUILD_ID),
                { body: commands }
            );
            log.success(`Commands für Guild ${CONFIG.GUILD_ID} registriert`);
        } else {
            // Globale Commands (kann bis zu 1 Stunde dauern)
            await rest.put(
                Routes.applicationCommands(CONFIG.CLIENT_ID),
                { body: commands }
            );
            log.success('Globale Commands registriert (kann bis zu 1 Stunde dauern)');
        }
        
    } catch (error) {
        log.error(`Fehler beim Registrieren der Commands: ${error.message}`);
        throw error;
    }
}

// ============================================
// ERROR HANDLER
// ============================================
process.on('unhandledRejection', (error) => {
    log.error(`Unhandled Rejection: ${error.message}`);
    console.error(error);
});

process.on('uncaughtException', (error) => {
    log.error(`Uncaught Exception: ${error.message}`);
    console.error(error);
    process.exit(1);
});

client.on('error', (error) => {
    log.error(`Discord Client Error: ${error.message}`);
    console.error(error);
});

client.on('warn', (warning) => {
    log.warn(`Discord Client Warning: ${warning}`);
});

// ============================================
// GRACEFUL SHUTDOWN
// ============================================
process.on('SIGTERM', () => {
    log.info('SIGTERM empfangen, fahre Bot herunter...');
    client.destroy();
    process.exit(0);
});

process.on('SIGINT', () => {
    log.info('SIGINT empfangen, fahre Bot herunter...');
    client.destroy();
    process.exit(0);
});

// ============================================
// BOT STARTEN
// ============================================
async function startBot() {
    try {
        log.info('Starte Discord Bot...');
        
        // Konfiguration validieren
        validateConfig();
        
        // Bot einloggen
        await client.login(CONFIG.TOKEN);
        
    } catch (error) {
        log.error(`Fehler beim Starten des Bots: ${error.message}`);
        console.error(error);
        process.exit(1);
    }
}

// Bot starten
startBot();
