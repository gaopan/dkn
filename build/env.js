var argv = require('yargs').argv;

var env = argv.env || 'dev';

var map = {
  'production': 'prod',
  'testing': 'test',
  'qa': 'qa',
  'development': 'dev',
  'stagging': 'stg',
  'ITG1':'itg1',
  'demo': 'demo',
  'aws': 'aws',
  'aws_qa': 'aws_qa',
  'aws_qa2': 'aws_qa2',
  'aws_qa3': 'aws_qa3',
  'tfdev': 'tfdev',
  'tfdemo': 'tfdemo',
  'tfprod': 'tfprod',
  'tfprodus': 'tfprodus',
  'tfprodeu': 'tfprodeu',
  'tfprodap':'tfprodap',
  'tfstg':'tfstg',
  'tfdemo2':'tfdemo2',
  'tfprodeu2': 'tfprodeu2',
  'tfprodus2': 'tfprodus2'
}

process.env.NODE_ENV = env;
process.env.NODE_ENV_SHORT = map[env];

module.exports = {
	env: env,
	env_short: map[env],
	isDev: process.env.isDev = ['test', 'dev'].indexOf(env) > -1,
	isBuild: process.env.isBuild = ['prod', 'qa', 'itg1', 'demo', 'aws', 'aws_qa', 'aws_qa2', 'aws_qa3', 'tfdev', 'tfdemo', 'tfprod', 'tfprodeu', 'tfprodus','tfprodap', 'tfstg', 'tfdemo2', 'tfprodeu2', 'tfprodus2'].indexOf(env) > -1
}