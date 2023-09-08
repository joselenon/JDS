import { PubSub } from 'graphql-subscriptions';

const PSub = new PubSub();

const PUBSUB_EVENTS = {
  GET_LIVE_BALANCE: { private: true, triggerName: 'GET_LIVE_BALANCE' },
  GET_REDIS_JACKPOT: { private: false, triggerName: 'GET_REDIS_JACKPOT' },
};

export { PSub, PUBSUB_EVENTS };
