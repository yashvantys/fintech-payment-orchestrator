import Redis from 'ioredis';

const redis = new Redis({ host: 'localhost', port: 6379 });

console.log('🚀 Lambda Consumer started - waiting for payments...');

setInterval(async () => {
  const data = await redis.rpop('payments-queue');
  if (data) {
    const payment = JSON.parse(data);
    console.log(`\n💳 Processing: ${payment.id} | ₹${payment.amount} ${payment.currency}`);
    await new Promise(r => setTimeout(r, 1500)); // Simulate Stripe API
    console.log(`✅ SUCCESS: ${payment.id} charged`);
    console.log(`📧 Webhook sent to merchant`);
  }
}, 2000);