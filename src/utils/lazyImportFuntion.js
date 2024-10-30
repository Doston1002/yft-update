import { lazy } from "react";

export function lazyImport(path, name) {
  return lazy(() => {
    const promise = import(/* @vite-ignore */ path);
    if (name == null) {
      return promise;
    } else {
      return promise.then((module) => ({ default: module[name] }));
    }
  });
}

export function importDelay(promise) {
    return new Promise(resolve => {
      setTimeout(resolve, 2000);
    }).then(() => promise);
  }