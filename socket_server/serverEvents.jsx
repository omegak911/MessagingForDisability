const serverEnterResponse = ({ io }, payload) => {
  io
    .emit('server.enter', payload);
}

const serverSentMsgResponse = ({ io }, payload) => {
  io
    .emit('server.sentMsg', payload);
}

export {
  serverEnterResponse,
  serverSentMsgResponse
} 