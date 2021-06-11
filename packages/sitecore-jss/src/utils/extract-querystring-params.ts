/**
 * Extract query string parameters from locationSearch.
 * @param {string} locationSearch The value to exract parameters from.
 * @param {string[]} paramsToExtract The parameters to extract.
 * @returns {Object} The extracted parameters.
 */
export const extractQueryStringParams = (
  locationSearch: string,
  paramsToExtract: string[]
): { [key: string]: string } => {
  const queryStringParams: { [key: string]: string } = {};

  locationSearch
    .substring(1)
    .split('&')
    .forEach((param) => {
      paramsToExtract.forEach((name) => {
        if (!param.toLowerCase().startsWith(name.toLowerCase().concat('='))) {
          return;
        }

        queryStringParams[name] = decodeURIComponent(
          param.toLowerCase().substring(name.length + 1)
        );
      });
    });

  return queryStringParams;
};
