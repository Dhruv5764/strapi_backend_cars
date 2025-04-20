import { Server } from 'socket.io';

export default {
  register() {},

  bootstrap({ strapi }) {
    const io = new Server(strapi.server.httpServer, {
      cors: {
        origin: '*', // Set allowed origins in production
      },
    });

    strapi.io = io;

    io.on('connection', (socket) => {
      strapi.log.info(`🔌 New socket connected: ${socket.id}`);

      // Join Room
      socket.on('joinRoom', async (roomId) => {
        socket.join(roomId);
        strapi.log.info(`Socket ${socket.id} joined room ${roomId}`);

        // Fetch message history for the room
        try {
          const room = await strapi.query('api::room.room').findOne({
            where: { room_code: roomId },
            populate: {
              messages: {
                sort: ['createdAt:asc'], // Sort messages by creation date (ascending)
                populate: ['sender_name', 'text'],
              },
            },
          });

          if (room) {
            // Emit the room's messages to the client
            const messages = room.messages.map((msg) => ({
              sender: msg.sender_name,
              message: msg.text,
            }));

            socket.emit('chatHistory', messages); // Emit chat history
            strapi.log.info(`📜 Chat history sent to ${socket.id}`);
          } else {
            socket.emit('error', { message: 'Room not found' });
          }
        } catch (err) {
          strapi.log.error(`❌ Error fetching chat history: ${err.message}`);
          socket.emit('error', { message: 'Failed to fetch chat history', error: err });
        }

        socket.emit('roomJoined', { roomId });
      });

      // Handle sendMessage
      socket.on('sendMessage', async ({ roomId, message, sender }) => {
        strapi.log.info(`📨 New message in room ${roomId} from ${sender || 'Anonymous'}: ${message}`);

        try {
          // Check if room exists
          let room = await strapi.query('api::room.room').findOne({
            where: { room_code: roomId },
          });

          // Create the room if it doesn't exist
          if (!room) {
            room = await strapi.entityService.create('api::room.room', {
              data: { room_code: roomId },
            });
            strapi.log.info(`✅ Created new room: ${roomId}`);
          }

          // Save the message in the database
          const savedMessage = await strapi.entityService.create('api::message.message', {
            data: {
              text: message,
              room: room.id,
              sender_name: sender || 'Anonymous', // Ensure sender_name is saved
            },
          });

          // Emit the message with the sender to all clients in the room
          io.to(roomId).emit('receiveMessage', {
            message: savedMessage.text,
            sender: savedMessage.sender_name,  // Use saved sender name
          });

          socket.emit('messageSent', { status: 'Message sent successfully' });
        } catch (err) {
          strapi.log.error(`❌ Failed to send message: ${err.message}`);
          socket.emit('error', { message: 'Failed to send message', error: err });
        }
      });

      // Handle disconnect
      socket.on('disconnect', () => {
        strapi.log.info(`❌ Socket ${socket.id} disconnected`);
      });
    });
  },
};
