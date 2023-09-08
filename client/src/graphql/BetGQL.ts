import { gql } from '@apollo/client';

const BET_ON_JACKPOT = gql`
  mutation betOnJackpot($payload: MakeBet!) {
    betOnJackpot(payload: $payload)
  }
`;

export default { BET_ON_JACKPOT };
