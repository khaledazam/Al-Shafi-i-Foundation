const TelegramBot = require('node-telegram-bot-api');
const Product = require('../models/Product');
const Discount = require('../models/Discount');

/**
 * Initialize and start the Telegram Bot
 */
const initializeTelegramBot = () => {
    const token = process.env.BOT_TOKEN;

    if (!token) {
        console.warn('⚠️ BOT_TOKEN is missing. Telegram bot not started.');
        return;
    }

    try {
        const bot = new TelegramBot(token, { polling: true });

        console.log('🤖 Telegram Bot initialized and polling...');

        // Main Menu Keyboard
        const mainMenu = {
            reply_markup: {
                keyboard: [
                    [{ text: 'عرض المنتجات' }, { text: 'عرض الخصومات' }],
                    [{ text: 'تواصل معنا' }]
                ],
                resize_keyboard: true
            }
        };

        // Handle /start command
        bot.onText(/\/start/, (msg) => {
            const chatId = msg.chat.id;
            bot.sendMessage(chatId, 'مرحبًا بك في مؤسسة الشافعي', mainMenu);
        });

        // Handle text messages
        bot.on('message', async (msg) => {
            const chatId = msg.chat.id;
            const text = msg.text;

            try {
                if (text === 'عرض المنتجات') {
                    const products = await Product.find({ isActive: true }).limit(10);

                    if (products.length === 0) {
                        return bot.sendMessage(chatId, 'لا يوجد منتجات حالياً.');
                    }

                    let message = '📋 قائمة المنتجات:\n\n';
                    products.forEach(p => {
                        const name = p.name.ar || p.name.en;
                        message += `🔹 ${name}\n💰 السعر: ${p.price} ج.م\n\n`;
                    });

                    bot.sendMessage(chatId, message);
                }

                else if (text === 'عرض الخصومات') {
                    const discounts = await Discount.find({ isActive: true }).populate('productId');

                    if (discounts.length === 0) {
                        return bot.sendMessage(chatId, 'لا يوجد خصومات حالياً.');
                    }

                    let message = '🔥 العروض والخصومات الحالية:\n\n';
                    discounts.forEach(d => {
                        const productName = d.productId ? (d.productId.name.ar || d.productId.name.en) : 'منتج غير معروف';
                        message += `🏷️ ${productName}\n📉 الخصم: ${d.discountPercent}%\n\n`;
                    });

                    bot.sendMessage(chatId, message);
                }

                else if (text === 'تواصل معنا') {
                    const contactMsg = `📞 للتواصل مع مؤسسة الشافعي:\n\n📍 العنوان: [أدخل العنوان هنا]\n📱 رقم الهاتف: [أدخل الرقم هنا]\n📧 البريد الإلكتروني: [أدخل البريد هنا]\n\nنسعد بخدمتكم!`;
                    bot.sendMessage(chatId, contactMsg);
                }
            } catch (dbError) {
                console.error('Bot Database Error:', dbError);
                bot.sendMessage(chatId, 'عذراً، حدث خطأ أثناء جلب البيانات. حاول مرة أخرى لاحقاً.');
            }
        });

        // Error handling for polling
        bot.on('polling_error', (error) => {
            console.error('Telegram Bot Polling Error:', error.code === 'ETELEGRAM' ? 'Network/Token Issue' : error.message);
        });

    } catch (err) {
        console.error('❌ Failed to start Telegram Bot:', err.message);
    }
};

module.exports = { initializeTelegramBot };
