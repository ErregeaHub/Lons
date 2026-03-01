const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function sendTelegramNotification(
    message: string,
    username?: string,
    isAnonymous?: boolean,
    imageUrl?: string,
) {
    const sender = isAnonymous ? '👻 Anonymous' : `🧑 ${username || 'Unknown'}`;
    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });

    const safeMessage = escapeMarkdown(message);
    const safeSender = escapeMarkdown(sender);
    const safeTimestamp = escapeMarkdown(timestamp);

    const caption = [
        `🔔 *New Whisper Received*`,
        ``,
        `💬 _"${safeMessage}"_`,
        ``,
        `👤 From: ${safeSender}`,
        `🕐 ${safeTimestamp}`,
        ``,
        `🔗 [Open Admin Console](${APP_URL}/admin)`,
        `— Lons Anonymous Vault`,
    ].join('\n');

    try {
        // If image URL is a real HTTP URL, send as photo
        if (imageUrl && imageUrl.startsWith('http')) {
            const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    photo: imageUrl,
                    caption,
                    parse_mode: 'Markdown',
                }),
            });

            if (!res.ok) {
                // If photo send fails (e.g. URL not accessible), fall back to text
                console.error('[Telegram] Photo send failed, falling back to text');
                await sendTextMessage(caption);
            }
        } else {
            await sendTextMessage(caption);
        }
    } catch (error) {
        console.error('[Telegram] Error sending notification:', error);
    }
}

async function sendTextMessage(text: string) {
    try {
        const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text,
                parse_mode: 'Markdown',
                disable_web_page_preview: false,
            }),
        });

        if (!res.ok) {
            const err = await res.text();
            console.error('[Telegram] Failed to send notification:', err);
        }
    } catch (error) {
        console.error('[Telegram] Error sending text message:', error);
    }
}

function escapeMarkdown(text: string): string {
    return text.replace(/([_*\[\]()~`>#+\-=|{}.!])/g, '\\$1');
}
