/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    '/geoserver/': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      pathRewrite: {'^': ''},
    },
    '/api/': {
      target: 'http://219.224.165.132:2500',
      changeOrigin: true,
      pathRewrite: {'^': ''},
    }
  },
  test: {
    '/geoserver/': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      pathRewrite: {'^': ''},
    },
    '/api/': {
      target: 'http://219.224.165.132:2500',
      changeOrigin: true,
      pathRewrite: {'^': ''},
    }
  },
  pre: {
    '/geoserver/': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      pathRewrite: {'^': ''},
    },
    '/api/': {
      target: 'http://219.224.165.132:2500',
      changeOrigin: true,
      pathRewrite: {'^': ''},
    }
  },
};
