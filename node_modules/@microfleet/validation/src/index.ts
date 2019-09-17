import ajv = require('ajv');
import keywords = require('ajv-keywords');
import Promise = require('bluebird');
import callsite = require('callsite');
import { InvalidOperationError, io, NotFoundError } from 'common-errors';
import _debug = require('debug');
import fs = require('fs');
import glob = require('glob');
import path = require('path');
import { HttpStatusError } from './HttpStatusError';

// this is taken from ajv, but removed
// tslint:disable-next-line:max-line-length
const URLFormat = /^(?:https?:\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u{00a1}-\u{ffff}0-9]+-?)*[a-z\u{00a1}-\u{ffff}0-9]+)(?:\.(?:[a-z\u{00a1}-\u{ffff}0-9]+-?)*[a-z\u{00a1}-\u{ffff}0-9]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu;
const debug = _debug('ms-validation');

type globFilter = (filename: string) => boolean;

/**
 * Patch it! We rely on isntanceof Error when serializing and deserializing errors and
 * this breaks it
 */
const { hasOwnProperty } = Object.prototype;

/**
 * Default filter function
 * @param filename
 */
const json: globFilter = (filename: string) => path.extname(filename) === '.json';
const slashes = new RegExp(path.sep, 'g');
const safeValidate = (validate: ajv.ValidateFunction, doc: any) => {
  try {
    validate(doc);
  } catch (e) {
    return e;
  }

  return true;
};

/**
 * @namespace Validator
 */
export class Validator {
  /**
   * Read more about options here:
   * https://github.com/epoberezkin/ajv
   */
  public static readonly defaultOptions: ajv.Options = {
    $data: true,
    allErrors: true,
    removeAdditional: false,
    useDefaults: true,
    verbose: true,
  };

  private readonly schemaDir: string | undefined;
  private readonly $ajv: ajv.Ajv;
  private readonly filterOpt: globFilter;
  private readonly schemaOptions: ajv.Options;

  /**
   * Initializes validator with schemas in the schemaDir with a given filter function
   * and schemaOptions
   * @param schemaDir
   * @param filter
   * @param schemaOptions
   */
  constructor(schemaDir?: string, filter?: globFilter | null, schemaOptions: ajv.Options = {}) {
    this.schemaDir = schemaDir;
    this.schemaOptions = { ...Validator.defaultOptions, ...schemaOptions };
    this.filterOpt = filter || json;

    // init
    const ajvInstance = new ajv(this.schemaOptions);

    // removes ftp protocol and sanitizes internal networks
    ajvInstance.addFormat('http-url', URLFormat);

    // enable extra keywords
    keywords(ajvInstance);

    // save instance
    this.$ajv = ajvInstance;

    // automatically init if we have schema dir
    if (schemaDir) {
      this.init();
    }
  }

  /**
   * In case you need raw validator instance, e.g. to add more schemas later
   */
  public get ajv(): ajv.Ajv {
    return this.$ajv;
  }

  /**
   * Validates data via a `schema`, which equals to schema name in the
   * passed dir
   * @param  schema
   * @param  data
   */
  public validate = (schema: string, data: any) => {
    const output = this.$validate(schema, data);

    if (hasOwnProperty.call(output, 'error') === true) {
      // so that it can be inspected later
      Object.defineProperty(output.error, '$orig', {
        value: output.doc,
      });

      // reject
      return Promise.reject(output.error);
    }

    return Promise.resolve(output.doc);
  }

  /**
   * Make use of { filter: true } option and catch 417 errors
   * @param  schema
   * @param  data
   * @return
   */
  public filter = (schema: string, data: any) => {
    const output = this.$validate(schema, data);
    if (hasOwnProperty.call(output, 'error') && (output.error as HttpStatusError).statusCode !== 417) {
      return Promise.reject(output.error);
    }

    return Promise.resolve(output.doc);
  }

  /**
   * Synchronously validates and returns either an Error object or `void 0`
   * @param  schema
   * @param  data
   */
  public validateSync = (schema: string, data: any) => (
    this.$validate(schema, data)
  )

  /**
   * Sync validation and throws if error is encountered.
   * @param  {string} schema
   * @param  {mixed} data
   */
  public ifError = (schema: string, data: any) => {
    const result = this.$validate(schema, data);

    if (typeof result.error !== 'undefined') {
      if (debug.enabled) {
        debug(JSON.stringify(result, null, 2));
      }
      throw result.error;
    }

    return result.doc;
  }

  /**
   * #init()
   *
   * Init function - loads schemas from config dir
   * Can call multiple times to load multiple dirs, though one must make sure
   * that files are named differently, otherwise validators will be overwritten
   *
   * @param dir - path, eventually resolves to absolute
   * @return
   */
  public init(dir: string | undefined = this.schemaDir, isAsync: boolean = false) {
    if (typeof dir === 'undefined') {
      throw new TypeError('"dir" or this.schemaDir must be defined');
    }

    if (!path.isAbsolute(dir)) {
      const stack = callsite();
      const { length } = stack;

      // filter out the file itself
      let iterator: number = 0;
      let source: string = '';

      while (iterator < length && !source) {
        const call = stack[iterator];
        const filename = call.getFileName();
        if (filename !== __filename) {
          source = path.dirname(filename);
        }
        iterator += 1;
      }

      dir = path.resolve(source, dir);
    }

    let list;
    try {
      const stat = fs.statSync(dir);
      if (stat.isDirectory() === false) {
        throw new Error('not a directory');
      }

      list = glob.sync('**', { cwd: dir });
    } catch (err) {
      const error = new io.IOError(`was unable to read ${dir}`, err);

      if (isAsync) {
        return Promise.reject(error);
      }

      throw error;
    }

    const filenames = list.filter(this.filterOpt);
    if (filenames.length === 0) {
      const error = new io.FileNotFoundError(`no schemas found in dir '${dir}'`);
      if (isAsync) {
        return Promise.reject(error);
      }

      throw error;
    }

    const { $ajv } = this;
    for (const filename of filenames) {
      // so that we can use both .json and .js files
      // and other registered extensions
      const modulePath = require.resolve(path.resolve(dir, filename));

      // eslint-disable-next-line import/no-dynamic-require
      const schema = require(modulePath);

      // erase cache for further requires
      require.cache[modulePath] = undefined;

      const id = schema.$id || schema.id;
      const defaultName = modulePath
        .slice(dir.length + 1)
        .replace(/\.[^.]+$/, '')
        .replace(slashes, '.');

      debug(
        'adding schema [%s], %s with id choice of $id: [%s] vs defaultName: [%s]',
        id || defaultName,
        modulePath,
        id,
        defaultName,
      );

      $ajv.addSchema(schema, id || defaultName);
    }

    if (isAsync) {
      return Promise.resolve();
    }

    return undefined;
  }

  /**
   * @private
   *
   * Internal validation function
   * @param  schema - schema name
   * @param  data
   * @return
   */
  private $validate(schema: string, data: any) {
    const validate = this.$ajv.getSchema(schema);

    if (!validate) {
      return { error: new NotFoundError(`validator "${schema}" not found`) };
    }

    const isValidationCompleted = safeValidate(validate, data);
    if (isValidationCompleted !== true) {
      return { error: new InvalidOperationError('internal validation error', isValidationCompleted), doc: data };
    }

    if (validate.errors) {
      const readable = this.$ajv.errorsText(validate.errors);

      let onlyAdditionalProperties = true;
      const error = new HttpStatusError(400, `${schema} validation failed: ${readable}`);
      for (const err of validate.errors) {
        if (err.message !== 'should NOT have additional properties') {
          onlyAdditionalProperties = false;
        }

        const field = err.keyword === 'additionalProperties'
          ? `${err.dataPath}/${(err.params as ajv.AdditionalPropertiesParams).additionalProperty}`
          : err.dataPath;

        error.addError(new HttpStatusError(400, err.message, field));
      }

      if (onlyAdditionalProperties === true) {
        error.statusCode = error.status = error.status_code = 417;
      }

      return { error, doc: data };
    }

    return { doc: data };
  }
}

export { HttpStatusError };
export default Validator;
