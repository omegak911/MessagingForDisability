import {
  serverEnterResponse,
  serverSentMsgResponse
} from './serverEvents';

const clientEnter = ({ io }, payload) => {
  console.log('client entered')
  try {
    serverEnterResponse({ io }, payload);
  } catch (err) {
    console.log('clientEnter error: ', err);
  }
}

const clientMsg = ({ io }, payload) => {
  console.log('client msg rcvd')
  try {
    serverSentMsgResponse({ io }, payload);
  } catch (err) {
    console.log('client msg rcvd error: ', err)
  }
}

const clientEmitters = {
  'client.enter': clientEnter,
  'client.sentMsg': clientMsg
}

export default clientEmitters;