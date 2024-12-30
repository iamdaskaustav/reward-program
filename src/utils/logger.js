import log from "loglevel";

log.setLevel("info");

export const logger = {
  trace: log.trace,
  debug: log.debug,
  info: log.info,
  warn: log.warn,
  error: log.error,
};
