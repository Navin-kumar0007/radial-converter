import Cocoa
import FlutterMacOS

class MainFlutterWindow: NSWindow {
  private let shiftDrag = ShiftDragWatcher()
  private let dragger = FileDragger()
  private lazy var resultChip = ResultChip(dragger: dragger)

  override func awakeFromNib() {
    let flutterViewController = FlutterViewController()
    let windowFrame = self.frame
    self.contentViewController = flutterViewController
    self.setFrame(windowFrame, display: true)
    // Closing only hides it: it comes back for the Dock icon and for anything going wrong.
    self.isReleasedWhenClosed = false

    RegisterGeneratedPlugins(registry: flutterViewController)
    // Opened at login, the app waits out of the way for a Shift-drag; the Dock icon brings it back.
    // The event that opened it is still current when launching finishes.
    var launched: NSObjectProtocol?
    launched = NotificationCenter.default.addObserver(
      forName: NSApplication.didFinishLaunchingNotification, object: nil, queue: .main
    ) { [weak self] _ in
      if LoginItem.launchedAtLogin() { self?.orderOut(nil) }
      if let launched { NotificationCenter.default.removeObserver(launched) }
    }
    connectShiftDrag(to: flutterViewController.engine.binaryMessenger, view: flutterViewController.view)

    super.awakeFromNib()
  }

  /// `shift_drag_native.dart` on the other side, which decides what each file can become.
  private func connectShiftDrag(to messenger: FlutterBinaryMessenger, view: NSView) {
    let channel = FlutterMethodChannel(name: "radial/shift_drag", binaryMessenger: messenger)
    shiftDrag.askForSlices = { paths, reply in
      channel.invokeMethod("menuFor", arguments: ["paths": paths]) { answer in
        let items = answer as? [[String: String]] ?? []
        reply(
          items.compactMap { item in
            guard let id = item["id"], let label = item["label"] else { return nil }
            return RadialSlice(id: id, label: label)
          })
      }
    }
    shiftDrag.onChosen = { slice, paths in
      channel.invokeMethod("chosen", arguments: ["id": slice.id, "paths": paths])
    }
    channel.setMethodCallHandler { [weak self] call, result in
      guard let self = self else {
        result(nil)
        return
      }
      let paths = (call.arguments as? [String: Any])?["paths"] as? [String] ?? []
      switch call.method {
      case "showWindow":
        NSApp.activate(ignoringOtherApps: true)
        self.makeKeyAndOrderFront(nil)
        result(nil)
      case "dragOut":
        result(self.dragger.begin(paths: paths, from: view))
      case "showChip":
        self.resultChip.show(paths: paths)
        result(nil)
      case "moveToTrash":
        result(paths.count == 1 && moveFileToTrash(paths[0]))
      case "loginItem":
        result(LoginItem.status())
      case "setLoginItem":
        let on = (call.arguments as? [String: Any])?["on"] as? Bool ?? false
        result(LoginItem.set(on))
      case "setWords":
        NativeWords.set(call.arguments)
        result(nil)
      case "showInFolder":
        NSWorkspace.shared.activateFileViewerSelecting(paths.map { URL(fileURLWithPath: $0) })
        result(nil)
      default:
        result(FlutterMethodNotImplemented)
      }
    }
    shiftDrag.isPaused = { [weak self] in self?.dragger.isDragging ?? false }
    shiftDrag.start()
  }
}
