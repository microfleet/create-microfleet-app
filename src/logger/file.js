const path = require('path');
const fs = require('fs');

const TRACE = 'trace';
const DEBUG = 'debug';
const INFO = 'info';
const WARN = 'warn';
const ERROR = 'error';
const FATAL = 'fatal';

const logFileDir = path.resolve(__dirname, '../../var/logs')
fs.mkdirSync(logFileDir, { recursive: true })
const logFilePath = path.resolve(logFileDir, `${Date.now()}.log`)

class FileLogger {
  constructor(path, level) {
    this.level = level
    this.path = logFilePath
    this.trace = this.trace.bind(this)
    this.debug = this.debug.bind(this)
    this.info = this.info.bind(this)
    this.warn = this.warn.bind(this)
    this.error = this.error.bind(this)
    this.fatal = this.fatal.bind(this)
  }

  trace(params, message) {
    this.invoke(TRACE, params, message)
  }

  debug(params, message) {
    this.invoke(DEBUG, params, message)
  }

  info(params, message) {
    this.invoke(INFO, params, message)
  }

  warn(params, message) {
    this.invoke(WARN, params, message)
  }

  error(params, message) {
    this.invoke(ERROR, params, message)
  }

  fatal(params, message) {
    this.invoke(FATAL, params, message)
  }

  invoke(level, params, message) {
    //todo filter level
    const logMsg = JSON.stringify({
      time: Date.now(),
      params,
      message,
    })

    fs.appendFile(this.path, `${logMsg}\n`, (err) => {
      if (err) {
        console.log('File logger failed to append logs due to error: ' + err);
      }
    })
  }

  setLevel(level) {
    this.level = level
  }
}

module.exports = FileLogger
