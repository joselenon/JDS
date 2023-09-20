const ENVIRONMENT = {
  REACT_APP_HTTPS: process.env.REACT_APP_HTTPS === 'true' ? true : false,
  REACT_APP_SERVER_DOMAIN: process.env.REACT_APP_SERVER_DOMAIN as string,
  REACT_APP_SERVER_PORT: process.env.REACT_APP_SERVER_PORT as string,
};

const requiredVariables = [
  'REACT_APP_HTTPS',
  'REACT_APP_SERVER_DOMAIN',
  'REACT_APP_SERVER_PORT',
];

const missingVariables = requiredVariables.filter((variable) => !process.env[variable]);

if (missingVariables.length > 0) {
  throw new Error(`Variável de ambiente faltando. - ${missingVariables}`);
}

export default ENVIRONMENT;
