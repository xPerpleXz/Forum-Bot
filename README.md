# ⚡ 5-MINUTEN QUICK START

## 🎯 Ziel: Bot in 5 Minuten live auf Railway!

---

## SCHRITT 1: Discord Bot (2 Min) ⚡

### A) Bot erstellen
1. Öffne: https://discord.com/developers/applications
2. Klick: **"New Application"** → Name eingeben → **"Create"**
3. Links: **"Bot"** → **"Add Bot"** → **"Yes, do it!"**

### B) Token & IDs
4. Klick: **"Reset Token"** → **Token SOFORT KOPIEREN** ✂️
5. Scrolle hoch → **"Application ID"** kopieren ✂️
6. Aktiviere beide Intents:
   - ✅ SERVER MEMBERS INTENT
   - ✅ MESSAGE CONTENT INTENT
7. **"Save Changes"** klicken!

### C) Bot einladen
8. Links: **"OAuth2"** → **"URL Generator"**
9. Scopes wählen:
   - ✅ bot
   - ✅ applications.commands
10. Permissions wählen:
    - ✅ Send Messages
    - ✅ Create Public Threads  
    - ✅ Send Messages in Threads
    - ✅ Embed Links
11. URL unten kopieren → in Browser öffnen → Server auswählen → **"Authorize"**

---

## SCHRITT 2: Discord Server (1 Min) ⚡

### A) Forum Channel erstellen
1. Rechtsklick auf Server → **"Channel erstellen"**
2. Typ: **"Forum"** wählen
3. Name: `📋-beschwerden` (oder eigener Name)
4. **"Erstellen"**

### B) IDs kopieren
5. Discord Settings → Erweitert → **"Entwicklermodus"** aktivieren
6. Rechtsklick auf Forum Channel → **"ID kopieren"** ✂️
7. Rechtsklick auf Server Name (oben links) → **"Server-ID kopieren"** ✂️

**WICHTIG:** Jetzt hast du:
- ✅ Bot Token
- ✅ Client ID (Application ID)
- ✅ Forum Channel ID
- ✅ Guild/Server ID

---

## SCHRITT 3: Railway Deploy (2 Min) ⚡

### A) Code vorbereiten
1. Erstelle neuen Ordner: `discord-forum-bot`
2. Kopiere ALLE Dateien rein:
   - `bot.js` (Haupt-Code)
   - `package.json`
   - `.gitignore`
   - `.env.example`
   - `railway.json`

### B) GitHub (empfohlen) oder direkt
**Option 1 - GitHub:**
1. Erstelle neues GitHub Repo
2. Push alle Dateien (OHNE .env!)
3. Weiter zu C)

**Option 2 - Railway CLI:**
```bash
npm i -g @railway/cli
railway login
railway init
railway up
```

### C) Railway Setup
1. Öffne: https://railway.app
2. **"Start a New Project"**
3. **"Deploy from GitHub repo"** (oder Empty Project)
4. Repository auswählen

### D) Variables setzen (KRITISCH!)
5. Klick auf dein Service
6. **"Variables"** Tab
7. Füge hinzu (**GENAU SO**):

```
DISCORD_TOKEN
[Dein Bot Token von Schritt 1B einfügen]
```
→ **Add** klicken

```
CLIENT_ID
[Deine Application ID von Schritt 1B einfügen]
```
→ **Add** klicken

```
FORUM_CHANNEL_ID
[Deine Forum Channel ID von Schritt 2B einfügen]
```
→ **Add** klicken

```
GUILD_ID
[Deine Server ID von Schritt 2B einfügen]
```
→ **Add** klicken

### E) Fertig! 🎉
8. Railway deployt automatisch
9. Warte 30-60 Sekunden
10. Prüfe **"Deployments"** → **"View Logs"**
11. Sollte zeigen: `✅ Bot ist online als ...`

---

## ✅ TESTEN

1. Gehe zu deinem Discord Server
2. Tippe `/` → Du siehst `/beschwerde`
3. Fülle aus:
```
/beschwerde
spieler_id: 12345
regelverstoß: 1.1 - RDM
beschreibung: Test-Beschwerde zum Testen des Bots
```
4. Enter drücken
5. **Neuer Forum Post sollte erscheinen!** 🎉

---

## 🆘 HILFE! Es funktioniert nicht!

### Bot ist offline?
→ Railway → Logs → Suche nach Fehlern
→ Prüfe Token in Variables

### Commands nicht sichtbar?
→ Warte 1-2 Minuten
→ Discord App komplett schließen & neu starten

### "Missing Access"?
→ Bot im Forum Channel Rechte geben
→ Bot erneut mit Link einladen

### Forum Post nicht erstellt?
→ Prüfe FORUM_CHANNEL_ID
→ Muss ein **Forum Channel** sein (nicht normaler Text Channel!)

---

## 📁 DATEI-STRUKTUR

```
discord-forum-bot/
├── bot.js                 # Haupt-Code ⭐
├── package.json           # Dependencies
├── .gitignore            # Git Ignore
├── .env.example          # Variablen Template
├── railway.json          # Railway Config
└── README.md             # Anleitung
```

---

## 🎯 ZUSAMMENFASSUNG

**Was du brauchst:**
- Discord Bot Token
- Client ID
- Forum Channel ID
- Guild ID
- Railway Account

**Was der Bot macht:**
- `/beschwerde` Command → Erstellt automatisch Forum Post
- `/status` Command → Zeigt Bot-Status
- Läuft 24/7 auf Railway
- Auto-Restart bei Crashes

**Kosten:**
- Discord Bot: **Kostenlos**
- Railway: **$5 Guthaben/Monat gratis** (reicht für kleinen Bot)

---

## 🚀 NÄCHSTE SCHRITTE

1. ✅ Bot läuft → Teste ausgiebig
2. 📝 Passe Regeln in `bot.js` an
3. 🎨 Ändere Farben & Design
4. 👥 Informiere dein Team
5. 🎉 Enjoy!

---

**FERTIG! Bot läuft jetzt 24/7 auf Railway! 🎉**

*Bei Fragen: Prüfe Railway Logs oder README.md*
