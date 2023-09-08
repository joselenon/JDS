// Fix errors threatment

import { DocumentNode, useQuery, useMutation, useSubscription } from '@apollo/client';

import GraphQLOptionsConfig from '../config/app/GraphQLOptionsConfig';
import Cookies from 'js-cookie';
import { JWTCookie } from '../config/app/CookiesConfig';
import { toast } from 'react-toastify';

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
      [key in GQLType]: { success: boolean; message: string; data: DataType };
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
    toast.error(err.message);
    console.log('erro aqui', err);
  }
}

function gqlSubscription<DataType, GQLType extends string>(props: IGQL['subscription']) {
  const { gql } = props;
  const token = Cookies.get(JWTCookie.key);
  const { data, error } = useSubscription(gql, {
    context: GraphQLOptionsConfig(token).context,
  });

  return {
    data: data as {
      [key in GQLType]: { success: boolean; message: string; data: DataType };
    },
    error,
  };
}

export { gqlQuery, gqlMutation, gqlSubscription };
