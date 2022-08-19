import {promisify} from 'node:util';
import path from 'node:path';
import process from 'node:process';
import {globby, globbySync} from '@esm2cjs/globby';
import isGlob from 'is-glob';
import slash from '@esm2cjs/slash';
import gracefulFs from 'graceful-fs';
import isPathCwd from '@esm2cjs/is-path-cwd';
import isPathInside from '@esm2cjs/is-path-inside';
import rimraf from 'rimraf';
import pMap from '@esm2cjs/p-map';

const rimrafP = promisify(rimraf);

const rimrafOptions = {
	glob: false,
	unlink: gracefulFs.unlink,
	unlinkSync: gracefulFs.unlinkSync,
	chmod: gracefulFs.chmod,
	chmodSync: gracefulFs.chmodSync,
	stat: gracefulFs.stat,
	statSync: gracefulFs.statSync,
	lstat: gracefulFs.lstat,
	lstatSync: gracefulFs.lstatSync,
	rmdir: gracefulFs.rmdir,
	rmdirSync: gracefulFs.rmdirSync,
	readdir: gracefulFs.readdir,
	readdirSync: gracefulFs.readdirSync,
};

function safeCheck(file, cwd) {
	if (isPathCwd(file)) {
		throw new Error('Cannot delete the current working directory. Can be overridden with the `force` option.');
	}

	if (!isPathInside(file, cwd)) {
		throw new Error('Cannot delete files/directories outside the current working directory. Can be overridden with the `force` option.');
	}
}

function normalizePatterns(patterns) {
	patterns = Array.isArray(patterns) ? patterns : [patterns];

	patterns = patterns.map(pattern => {
		if (process.platform === 'win32' && isGlob(pattern) === false) {
			return slash(pattern);
		}

		return pattern;
	});

	return patterns;
}

export async function deleteAsync(patterns, {force, dryRun, cwd = process.cwd(), onProgress = () => {}, ...options} = {}) {
	options = {
		expandDirectories: false,
		onlyFiles: false,
		followSymbolicLinks: false,
		cwd,
		...options,
	};

	patterns = normalizePatterns(patterns);

	const paths = await globby(patterns, options);
	const files = paths.sort((a, b) => b.localeCompare(a));

	if (files.length === 0) {
		onProgress({
			totalCount: 0,
			deletedCount: 0,
			percent: 1,
		});
	}

	let deletedCount = 0;

	const mapper = async file => {
		file = path.resolve(cwd, file);

		if (!force) {
			safeCheck(file, cwd);
		}

		if (!dryRun) {
			await rimrafP(file, rimrafOptions);
		}

		deletedCount += 1;

		onProgress({
			totalCount: files.length,
			deletedCount,
			percent: deletedCount / files.length,
		});

		return file;
	};

	const removedFiles = await pMap(files, mapper, options);

	removedFiles.sort((a, b) => a.localeCompare(b));

	return removedFiles;
}

export function deleteSync(patterns, {force, dryRun, cwd = process.cwd(), ...options} = {}) {
	options = {
		expandDirectories: false,
		onlyFiles: false,
		followSymbolicLinks: false,
		cwd,
		...options,
	};

	patterns = normalizePatterns(patterns);

	const files = globbySync(patterns, options)
		.sort((a, b) => b.localeCompare(a));

	const removedFiles = files.map(file => {
		file = path.resolve(cwd, file);

		if (!force) {
			safeCheck(file, cwd);
		}

		if (!dryRun) {
			rimraf.sync(file, rimrafOptions);
		}

		return file;
	});

	removedFiles.sort((a, b) => a.localeCompare(b));

	return removedFiles;
}
