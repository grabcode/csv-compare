exports.buildConfig = ({ APP_ROOT, ...rest }) => {
  return {
    ...rest,
    APP_ROOT,
    FILE_ROOT: `${APP_ROOT}/../samples`,
  };
};
