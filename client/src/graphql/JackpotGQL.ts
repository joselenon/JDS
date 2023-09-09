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
          docId
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
          docId
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

export default { GET_JACKPOT, GET_LIVE_JACKPOT };
