module.exports.command = 'device <serial>'

module.exports.builder = function(yargs) {
  return yargs
    .strict()
    .option('adb-host', {
      describe: 'The ADB server host.'
    , type: 'string'
    , default: '127.0.0.1'
    })
    .option('adb-port', {
      describe: 'The ADB server port.'
    , type: 'number'
    , default: 5037
    })
    .option('boot-complete-timeout', {
      describe: 'How long to wait for boot to complete during device setup.'
    , type: 'number'
    , default: 60000
    })
    .option('cleanup', {
      describe: 'Attempt to reset the device between uses by uninstalling' +
        'apps, resetting accounts and clearing caches. Does not do a perfect ' +
        'job currently. Negate with --no-cleanup.'
    , type: 'boolean'
    , default: true
    })
    .option('connect-port', {
      describe: 'Port allocated to adb connections.'
    , type: 'number'
    , demand: true
    })
    .option('connect-push', {
      alias: 'p'
    , describe: 'ZeroMQ PULL endpoint to connect to.'
    , array: true
    , demand: true
    })
    .option('connect-sub', {
      alias: 's'
    , describe: 'ZeroMQ PUB endpoint to connect to.'
    , array: true
    , demand: true
    })
    .option('connect-url-pattern', {
      describe: 'The URL pattern to use for `adb connect`.'
    , type: 'string'
    , default: '${publicIp}:${publicPort}'
    })
    .option('group-timeout', {
      alias: 't'
    , describe: 'Timeout in seconds for automatic release of inactive devices.'
    , type: 'number'
    , default: 900
    })
    .option('heartbeat-interval', {
      describe: 'Send interval in milliseconds for heartbeat messages.'
    , type: 'number'
    , default: 10000
    })
    .option('lock-rotation', {
      describe: 'Whether to lock rotation when devices are being used. ' +
        'Otherwise changing device orientation may not always work due to ' +
        'sensitive sensors quickly or immediately reverting it back to the ' +
        'physical orientation.'
    , type: 'boolean'
    })
    .option('mute-master', {
      describe: 'Whether to mute master volume when devices are being used.'
    , type: 'boolean'
    })
    .option('provider', {
      alias: 'n'
    , describe: 'Name of the provider.'
    , type: 'string'
    , demand: true
    })
    .option('public-ip', {
      describe: 'The IP or hostname to use in URLs.'
    , type: 'string'
    , demand: true
    })
    .option('screen-jpeg-quality', {
      describe: 'The JPG quality to use for the screen.'
    , type: 'number'
    , default: process.env.SCREEN_JPEG_QUALITY || 80
    })
    .option('screen-port', {
      describe: 'Port allocated to the screen WebSocket.'
    , type: 'number'
    , demand: true
    })
    .option('screen-ws-url-pattern', {
      describe: 'The URL pattern to use for the screen WebSocket.'
    , type: 'string'
    , default: 'ws://${publicIp}:${publicPort}'
    })
    .option('storage-url', {
      alias: 'r'
    , describe: 'The URL to the storage unit.'
    , type: 'string'
    , demand: true
    })
    .option('vnc-initial-size', {
      describe: 'The initial size to use for the experimental VNC server.'
    , type: 'string'
    , default: '600x800'
    , coerce: function(val) {
        return val.split('x').map(Number)
      }
    })
    .option('vnc-port', {
      describe: 'Port allocated to VNC connections.'
    , type: 'number'
    , demand: true
    })
}

module.exports.handler = function(argv) {
  return require('../../units/device')({
    serial: argv.serial
  , provider: argv.provider
  , publicIp: argv.publicIp
  , endpoints: {
      sub: argv.connectSub
    , push: argv.connectPush
    }
  , groupTimeout: argv.groupTimeout * 1000 // change to ms
  , storageUrl: argv.storageUrl
  , adbHost: argv.adbHost
  , adbPort: argv.adbPort
  , screenWsUrlPattern: argv.screenWsUrlPattern
  , screenJpegQuality: argv.screenJpegQuality
  , screenPort: argv.screenPort
  , connectUrlPattern: argv.connectUrlPattern
  , connectPort: argv.connectPort
  , vncPort: argv.vncPort
  , vncInitialSize: argv.vncInitialSize
  , heartbeatInterval: argv.heartbeatInterval
  , bootCompleteTimeout: argv.bootCompleteTimeout
  , muteMaster: argv.muteMaster
  , lockRotation: argv.lockRotation
  , cleanup: argv.cleanup
  })
}
