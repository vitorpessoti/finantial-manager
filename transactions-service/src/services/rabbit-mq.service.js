import amqp from 'amqplib';
import Logger from './logger.service.js';

export default class RabbitMQ {
    constructor(connectionUrl, dateFormat, logsPath) {
        this.connection = null;
        this.connectionUrl = connectionUrl;
        this.channel = null;
        this.maxRetries = 5;
        this.retryCount = 0;
        this.logger = new Logger({
            dateFormat,
            logsPath
        })
    }

    // connect do RabbitMQ with retry
    async connect() {
        if (this.connection && this.channel) return; // do not reconnect if it is already connected

        try {
            this.connection = await amqp.connect(this.connectionUrl);
            this.channel = await this.connection.createChannel();
            console.log('Successfully connected to RabbitMQ');
            this.retryCount = 0; // Reset the retry counter
        } catch (err) {
            if (this.retryCount < this.maxRetries) {
                this.retryCount++;
                console.error(`Error connecting to RabbitMQ (attempt ${this.retryCount}): ${err.message}`);
                setTimeout(() => this.connect(), 5000); // Retry after 5 seconds
            } else {
                console.error('RabbitMQ max retries reached.');
                process.exit(1); // Finish the process after many retries
            }
        }
    }

    // ensure that the queue exists
    async assertQueue(queue) {
        await this.connect();
        if (!this.channel) {
            throw new Error('Channel is not available.');
        }
        await this.channel.assertQueue(queue, { durable: true });
        console.log(`Queue ${queue} asserted.`);
    }

    // send a message to a queue
    async sendToQueue(queue, msg) {
        await this.assertQueue(queue);
        if (!this.channel) {
            console.error('Channel is not available for sending messages.');
            throw new Error('Channel is not available for sending messages.');
        }
        const json = JSON.stringify(msg);
        const buffer = Buffer.from(json);
        this.channel.sendToQueue(queue, buffer);
        console.log(`Message sent to the queue: ${queue}`);
    }

    // consume messages from any queue
    async consumeFromQueue(queue, callback) {
        await this.assertQueue(queue);
        if (!this.channel) {
            throw new Error('Channel is not available.');
        }

        this.channel.consume(queue, async (msg) => {
            try {
                if (msg !== null) {
                    const data = JSON.parse(msg.content.toString());
                    await callback(data);
                    this.channel.ack(msg); // confirm the message delivering
                }
            } catch (error) {
                console.error(`Error while consuming the messages from queue: ${queue}`);
                console.error(error);
                this.channel.nack(msg, false, false);
                throw new Error(`Error while consuming the messages from the queue "${queue}".`)
            }
        });
    }
}