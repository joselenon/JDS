import { gql } from '@apollo/client';

const GET_JACKPOT = gql`
  query getJackpot {
    getJackpot {
      data {
        createdAt
        docId
        finishedAt
        startedAt
        type
        updatedAt
        prizePool
        status
        jackpotDuration
        jackpotAnimationDuration
        bets {
          docId
          intervals
          amountBet
          userInfo {
            username
            avatar
          }
        }
        winningBetRef {
          docId
          amountBet
          userInfo {
            username
            avatar
          }
        }
      }
    }
  }
`;

const GET_LAST_JACKPOTS = gql`
  query getLastJackpots {
    getLastJackpots {
      data {
        createdAt
        docId
        finishedAt
        startedAt
        type
        updatedAt
        prizePool
        status
        bets {
          docId
          intervals
          amountBet
          userInfo {
            username
            avatar
          }
        }
        winningBetRef {
          docId
          amountBet
          userInfo {
            username
            avatar
          }
        }
      }
    }
  }
`;

const GET_LIVE_JACKPOT = gql`
  subscription getLiveJackpot {
    getLiveJackpot {
      data {
        createdAt
        docId
        finishedAt
        startedAt
        type
        updatedAt
        prizePool
        status
        jackpotDuration
        jackpotAnimationDuration
        bets {
          docId
          intervals
          amountBet
          userInfo {
            username
            avatar
          }
        }
        winningBetRef {
          docId
          amountBet
          userInfo {
            username
            avatar
          }
        }
      }
    }
  }
`;

const GET_LIVE_LAST_JACKPOTS = gql`
  subscription getLiveLastJackpots {
    getLiveLastJackpots {
      data {
        createdAt
        docId
        finishedAt
        startedAt
        type
        updatedAt
        prizePool
        status
        bets {
          docId
          intervals
          amountBet
          userInfo {
            username
            avatar
          }
        }
        winningBetRef {
          docId
          amountBet
          userInfo {
            username
            avatar
          }
        }
      }
    }
  }
`;

export { GET_JACKPOT, GET_LIVE_JACKPOT, GET_LAST_JACKPOTS, GET_LIVE_LAST_JACKPOTS };
