// Fix errors threatment

import { DocumentNode, useQuery, useMutation, useSubscription } from '@apollo/client';

import GraphQLOptionsConfig from '../config/app/GraphQLOptionsConfig';
import Cookies from 'js-cookie';
import { JWTCookie } from '../config/app/CookiesConfig';
import { toast } from 'react-toastify';
import { IGQLResponses } from '../config/interfaces/IGQLResponses';
import ERROR_MSGS from '../config/constants/ERROR_MSGS';

interface IGQL {
  query: { gql: DocumentNode };
  mutation: { gql: DocumentNode };
  subscription: { gql: DocumentNode };
}

function gqlQuery<DataType, GQLType extends string>(props: IGQL['query']) {
  const { gql } = props;
  const token = Cookies.get(JWTCookie.key);
  const { data, error, refetch } = useQuery(gql, {
    context: GraphQLOptionsConfig(token).context,
  });
  return {
    data: data as {
      [key in GQLType]: IGQLResponses<DataType>;
    },
    refetch,
    error,
  };
}

function gqlMutation(props: IGQL['mutation']) {
  try {
    const { gql } = props;
    const token = Cookies.get(JWTCookie.key);
    const [mutate] = useMutation(gql);
    const mutationFn = async (payload: any) => {
      return await mutate({
        context: GraphQLOptionsConfig(token).context,
        variables: { payload: payload },
      });
    };
    return mutationFn;
  } catch (err: any) {
    toast.error(ERROR_MSGS.SERVER_OFFLINE_MSG);
  }
}

let errorMessageAlreadyDisplayed = false;
function gqlSubscription<DataType, GQLType extends string>(props: IGQL['subscription']) {
  try {
    const { gql } = props;
    const token = Cookies.get(JWTCookie.key);
    const { data, error } = useSubscription(gql, {
      context: GraphQLOptionsConfig(token).context,
    });

    if (error) throw new Error(error.message);

    return {
      data: data as {
        [key in GQLType]: IGQLResponses<DataType>;
      },
    };
  } catch (err: any) {
    if (!errorMessageAlreadyDisplayed) {
      toast.error(err);
      errorMessageAlreadyDisplayed = true;
    }
    return { data: undefined };
  }
}

export { gqlQuery, gqlMutation, gqlSubscription };
