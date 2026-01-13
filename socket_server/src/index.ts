import dotenv from 'dotenv';
dotenv.config();

import { server } from './socket/socket.js';

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
    console.log(`Socket Server is running on port ${PORT}`);
});