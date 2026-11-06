{{flutter_js}}
{{flutter_build_config}}

// Without Flutter's service worker settings: it's deprecated, and now only removes itself, which
// would also remove offline_worker.js as they'd share a scope.
_flutter.loader.load();
