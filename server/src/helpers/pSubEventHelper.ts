import { AuthError } from '../config/errorTypes/ClientErrors';
import { PSub, PUBSUB_EVENTS } from '../graphql/pubSubConfig';
import { successResponse } from './responseHelpers';

type TPubSubEvents = 'GET_LIVE_BALANCE' | 'GET_REDIS_JACKPOT';
type TActionKeys = 'getLiveBalance' | 'getLiveJackpot';

function publishPSubEvent(triggerName: string, action: any) {
  return PSub.publish(triggerName, action);
}

async function pSubEventHelper(
  event: TPubSubEvents,
  actionKey: TActionKeys,
  payload: any,
  userDocId?: string,
) {
  const action = { [actionKey]: successResponse('GET_MSG', payload) };
  let triggerName = PUBSUB_EVENTS[event].triggerName;

  if (PUBSUB_EVENTS[event].private && !userDocId) throw new AuthError();

  if (PUBSUB_EVENTS[event].private) {
    triggerName = `${PUBSUB_EVENTS[event].triggerName}:${userDocId}`;
  }

  return await publishPSubEvent(triggerName, action);
}

export default pSubEventHelper;
