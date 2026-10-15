<<<<<<< 6cde6d5d354fec28cb59ebbf0d572a7ca2d8d9e4
const path = require('path');
const core = require('@actions/core');
const { execFile } = require('child_process');
const { promisify } = require('util');

const execFileAsync = promisify(execFile);

module.exports = async extras => {
=======
import path, {dirname} from 'path';
import { fileURLToPath } from 'url';
import * as core from '@actions/core';
import runNpm from './runNpm.js';
import isNpmSpec from './isNpmSpec.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Pre-install extra dependecies
 * @returns {Promise<void>}
 */
export default async extras => {
>>>>>>> 4e7c39649f44ebeae632645fa857feee56409a63
  if (!extras) {
    return Promise.resolve();
  }

<<<<<<< 6cde6d5d354fec28cb59ebbf0d572a7ca2d8d9e4
  const packages = extras
    .split(/[\n\r]+/)
    .map(p => p.trim())
    .filter(Boolean);

  const silentArgs = process.env.RUNNER_DEBUG === '1' ? [] : ['--silent'];

  const { stdout, stderr } = await execFileAsync('npm', ['install', ...packages, '--no-audit', ...silentArgs], {
=======
  // Split into tokens and keep only plausible npm package specs: specs are
  // passed to npm without a shell, and tokens starting with `-` are dropped
  // so they can never be read as npm options
  const extrasList = extras
    .replace(/['"]/g, '')
    .split(/\s+/)
    .filter(Boolean);
  const validSpecs = extrasList.filter((spec) => isNpmSpec(spec));
  const invalidTokens = extrasList.filter((spec) => !isNpmSpec(spec));

  if (invalidTokens.length) {
    core.warning(`Ignored invalid package specs: ${invalidTokens.join(', ')}`);
  }

  if (!validSpecs.length) {
    return Promise.resolve();
  }

  core.debug(`Installing extra packages: ${validSpecs.join(', ')}`);

  // Keep the install output quiet, but still let npm print real errors
  // (e.g. ERESOLVE peer dependency reports) to stderr; --silent would
  // swallow them, leaving only an opaque "Command failed" message
  const quietArgs = process.env.RUNNER_DEBUG === '1' ? [] : ['--loglevel', 'error'];
  const args = ['install', ...validSpecs, '--no-audit', ...quietArgs];

  const { stdout, stderr } = await runNpm(args, {
>>>>>>> 4e7c39649f44ebeae632645fa857feee56409a63
    cwd: path.resolve(__dirname, '..')
  });
  core.debug(stdout);
  core.error(stderr);
};
