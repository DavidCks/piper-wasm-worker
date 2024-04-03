import { fetchWithProgress } from "../piper-browser-extension/web/src/utils";
import * as storage from "../piper-browser-extension/web/src/storage";
import { generateShortHash } from "../utils";
import { ModelConfig } from "../piper-browser-extension/web/src/types";

/**
 * Installs and configures a model by downloading it and its configuration file.
 * The function attempts to persist the downloaded files for future access.
 *
 * @param {string} modelUrl The URL from which the model file can be downloaded.
 * @param {string} configUrl The URL from which the model's configuration file can be downloaded.
 * @param {(percent: number) => void} onProgress A callback function that is called with the download progress percentage of the model file.
 *
 * The function first requests persistence for storage to ensure that the model and its configuration can be stored locally for long-term access.
 * If persistence is granted, it proceeds to download both the model and its configuration files in parallel.
 * The model file's download progress is reported through the `onProgress` callback.
 * Once both files are downloaded, the configuration file is parsed as JSON.
 *
 * Note: The actual downloading is handled by `getFile` which tries to fetch from persistent storage before falling back to a network fetch through a provided callback function.
 * This network fetch is tracked for the model file to provide progress updates via `onProgress`.
 *
 * @returns {Promise<{model: Blob, modelConfig: Blob}>} A promise that resolves to an object containing the model file and its parsed configuration.
 *
 * @example
 * install('https://example.com/model.bin', 'https://example.com/model-config.json', progress => console.log(`Download progress: ${progress}%`))
 *   .then(({model, modelConfig}) => {
 *     // Use the model and its configuration here
 *   });
 */
export async function install(
  modelUrl: string,
  configUrl: string,
  onProgress: (percent: number) => void
): Promise<{ model: Blob; modelConfig: ModelConfig }> {
  storage
    .requestPersistence()
    .then((granted: boolean) => console.info("Persistent storage:", granted))
    .catch(console.error);
  // hash the modelUrl and configUrl to get a unique key

  const modelName = await generateShortHash(modelUrl);
  const configName = await generateShortHash(configUrl);
  const [model, modelConfig] = await Promise.all([
    storage.getFile(modelName, () => fetchWithProgress(modelUrl, onProgress)),
    storage.getFile(configName, () => fetchWithProgress(configUrl, () => {})),
  ]);
  return {
    model,
    modelConfig: JSON.parse(await modelConfig.text()),
  };
}
