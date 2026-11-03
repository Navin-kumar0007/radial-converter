import Cocoa
import FlutterMacOS

class MainFlutterWindow: NSWindow {
  private let shiftDrag = ShiftDragWatcher()

  override func awakeFromNib() {
    let flutterViewController = FlutterViewController()
    let windowFrame = self.frame
    self.contentViewController = flutterViewController
    self.setFrame(windowFrame, display: true)
    // Closing only hides it: it comes back for the Dock icon and for anything going wrong.
    self.isReleasedWhenClosed = false

    RegisterGeneratedPlugins(registry: flutterViewController)
    connectShiftDrag(to: flutterViewController.engine.binaryMessenger)

    super.awakeFromNib()
  }

  /// `shift_drag_native.dart` on the other side, which decides what each file can become.
  private func connectShiftDrag(to messenger: FlutterBinaryMessenger) {
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
      if call.method == "showWindow" {
        NSApp.activate(ignoringOtherApps: true)
        self?.makeKeyAndOrderFront(nil)
      }
      result(nil)
    }
    shiftDrag.start()
  }
}
