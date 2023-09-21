const ENVIRONMENT = {
  REACT_APP_MODE: (process.env.REACT_APP_MODE || 'DEVELOPMENT') as
    | 'DEVELOPMENT'
    | 'PRODUCTION',
  REACT_APP_HTTPS: process.env.REACT_APP_HTTPS === 'true' ? true : false,
  REACT_APP_SERVER_DOMAIN: process.env.REACT_APP_SERVER_DOMAIN || 'localhost',
  REACT_APP_SERVER_PORT: process.env.REACT_APP_SERVER_PORT as string,
};

const requiredVariables = ['REACT_APP_HTTPS', 'REACT_APP_MODE'];

const missingVariables = requiredVariables.filter((variable) => !process.env[variable]);

if (missingVariables.length > 0) {
  throw new Error(`Variável de ambiente faltando. - ${missingVariables}`);
}

export default ENVIRONMENT;
