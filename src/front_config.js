const frontendConfig = {
  uiApi: window.location.origin
};

frontendConfig.api = 'https://explore.pixel8.earth/api/v1';
if (window.location.href.indexOf('mable') > -1) frontendConfig.api = 'https://mable-0.pixel8earth.com/api/v1';

module.exports = frontendConfig;
