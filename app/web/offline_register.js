// Added to the page by tool/build_web.sh. A browser without this just needs a connection, as before.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('offline_worker.js').catch((error) => {
    console.warn('The app will need a connection, as offline support could not start.', error);
  });
}
