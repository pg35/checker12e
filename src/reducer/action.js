export function createAction(type, data) {
  return {
    type,
    data
  };
}
export const APP = "app";
export const SCAN = "scan";
export const SCAN_LOG = "scanLog";
export const TRANSACTION_LOG = "transactionLog";
export const TEXT_INPUT = "textInput";
export const FILE_INPUT = "fileInput";
export const URL_INPUT = "urlInput";
