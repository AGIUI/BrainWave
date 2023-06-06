import routes from './config/routes';

export default {
  model: {},
  request: {
    dataField: ''
  },
  define: {
    // 后台访问地址
    'process.env.baseUrl': 'http://127.0.0.1:8097/gateway',
  },
  // base: 'bsin-ui-scaffold-react-umi4',
  routes,
  // 路由模式
  hash: false,
};
