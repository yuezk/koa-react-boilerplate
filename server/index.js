require('babel-core/register');

const koa = require('koa');
const route = require('koa-route');
const views = require('co-views');

const webpack = require('webpack');
const config = require('../webpack/webpack.config.dev');

const app = koa();
const compiler = webpack(config);

app.use(require('koa-webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('koa-webpack-hot-middleware')(compiler));

app.use(function *(next) {
  this.render = views(__dirname + '/views', {
    map: { jade: 'jade' },
    default: 'jade'
  });

  yield next;
});

app.use(route.get('*', function *() {
  this.body = yield this.render('index');
}));

app.listen(3000, 'localhost', function () {
  console.log('Listening at http://localhost:3000');
});
