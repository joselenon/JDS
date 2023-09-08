import { gql } from '@apollo/client';

export const GET_USER_INFO = gql`
  query getUser {
    getUser {
      data {
        email
        balance
        steamid
        tradeLink
      }
    }
  }
`;

export const GET_BALANCE = gql`
  query getBalance {
    getBalance {
      data {
        balance
      }
    }
  }
`;

export const GET_LIVE_BALANCE = gql`
  subscription getLiveBalance {
    getLiveBalance {
      data {
        balance
      }
    }
  }
`;

export default { GET_USER_INFO, GET_BALANCE, GET_LIVE_BALANCE };
