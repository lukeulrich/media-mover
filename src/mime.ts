import { Magic, MAGIC_MIME_TYPE } from 'mmmagic';

const magic = new Magic(MAGIC_MIME_TYPE);

/**
 * Determine the mime type for a given file using libmagic
 * 
 * @param file full path to file
 * @returns Promise that resolves with the mime type
 */
export const getMimeType = (file: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    magic.detectFile(file, (error, result) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(result as string);
      //            ^^^^^^^^^^
      // Only an array when the MAGIC_CONTINUE is set
    });  
  });
};
