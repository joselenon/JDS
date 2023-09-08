const GraphQLOptionsConfig = (token: string | undefined) => {
  return {
    context: {
      headers: {
        Authorization: token,
      },
    },
  };
};

export default GraphQLOptionsConfig;
