import { Dirent } from 'fs';
import { readdir } from 'fs/promises';
import { resolve } from 'path';

import { acceptableMediaTypes } from './constants';
import { getMediaType, getMimeType } from './mime';

export type FileInfo = {
  directory: string;
  dirEnt: Dirent;
  path: string;
};

/**
 * Async generator function that returns absolute paths to files within
 * ${directory} or its children directories.
 * 
 * Does not yield an entry for directories.
 * 
 * @param directory directory to recursively scan for files
 * @param predicate optional filter function that yields the entry if it
 *   returns true; skips otherwise
 */
export async function *getFiles(
  directory: string,
  predicate?: (file: FileInfo) => Promise<boolean>,
): AsyncIterableIterator<string> {
  const dirEnts = await readdir(directory, {withFileTypes: true});
  for (const dirEnt of dirEnts) {
    const entryWithPath = resolve(directory, dirEnt.name);
    if (dirEnt.isDirectory()) {
      yield *getFiles(entryWithPath, predicate);
      continue;
    }

    if (!dirEnt.isFile()) {
      continue;
    }

    if (!predicate || await predicate({
      directory,
      dirEnt,
      path: entryWithPath,
    })) {
      yield entryWithPath;
    }
  }
};

export const acceptMimeType = (mimeType: string): boolean => {
  const mediaType = getMediaType(mimeType);
  return acceptableMediaTypes.has(mediaType);
};

export const acceptFile = async (file: string): Promise<boolean> => {
  const mimeType = await getMimeType(file);
  return acceptMimeType(mimeType);
};
