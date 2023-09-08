import { gql } from '@apollo/client';

export const GET_JACKPOT = gql`
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
          amount
          userInfo {
            username
            avatar
          }
        }
        winningBetRef {
          amount
          userInfo {
            username
          }
        }
      }
    }
  }
`;

export const GET_LIVE_JACKPOT = gql`
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
          amount
          userInfo {
            username
            avatar
          }
        }
        winningBetRef {
          amount
          userInfo {
            username
          }
        }
      }
    }
  }
`;

export default { GET_JACKPOT, GET_LIVE_JACKPOT };
