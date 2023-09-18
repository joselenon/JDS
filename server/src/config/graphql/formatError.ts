export default function (err: any) {
  return {
    message: err.message,
    extensions: {
      code: err.extensions.stacktrace[0],
    },
  };
}
