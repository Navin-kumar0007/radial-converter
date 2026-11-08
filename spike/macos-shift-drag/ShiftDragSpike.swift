// ShiftDrop: Phase 0 spike (throwaway prototype)
//
// Proves the riskiest idea in the plan: detecting a Shift-drag of a file anywhere on
// macOS and showing a radial menu under the cursor that accepts the drop.
//
// How it works:
//   - A timer checks 30 times a second: is the left mouse button down, is Shift held,
//     and has a new file drag started (the system drag pasteboard changed)?
//   - If so, a borderless panel with the radial menu appears centred on the cursor.
//   - The menu is a drop target. Dropping on a slice converts the file with
//     /usr/bin/sips (built into macOS). The original file is never changed.
//
// Build and run: bash run.sh     Quit: Ctrl+C in Terminal.

import AppKit
import ImageIO

// MARK: - Actions on the menu (slice 0 is at the top, then clockwise)

enum Action: Int, CaseIterable {
    case png, jpg, whatsapp, half

    var label: String {
        switch self {
        case .png: return "PNG"
        case .jpg: return "JPG"
        case .whatsapp: return "WhatsApp"
        case .half: return "Half size"
        }
    }
}

// MARK: - Conversion with sips

enum Converter {
    private struct Job {
        let arguments: [String]
        let output: URL
    }

    static func convert(_ urls: [URL], with action: Action) {
        for url in urls {
            DispatchQueue.global(qos: .userInitiated).async {
                guard let job = makeJob(for: url, action: action) else {
                    print("✗ Not an image this spike can read: \(url.lastPathComponent)")
                    return
                }
                let process = Process()
                process.executableURL = URL(fileURLWithPath: "/usr/bin/sips")
                process.arguments = job.arguments
                process.standardOutput = FileHandle.nullDevice
                process.standardError = FileHandle.nullDevice
                do {
                    try process.run()
                    process.waitUntilExit()
                } catch {
                    print("✗ Could not start sips: \(error.localizedDescription)")
                    return
                }
                if process.terminationStatus == 0 {
                    print("✓ \(url.lastPathComponent) → \(job.output.lastPathComponent)")
                } else {
                    print("✗ sips failed on \(url.lastPathComponent)")
                }
            }
        }
    }

    private static func makeJob(for url: URL, action: Action) -> Job? {
        guard let longSide = longestSide(of: url) else { return nil }
        let folder = url.deletingLastPathComponent()
        let name = url.deletingPathExtension().lastPathComponent
        let ext = url.pathExtension.isEmpty ? "png" : url.pathExtension.lowercased()

        switch action {
        case .png:
            let out = freeURL(in: folder, name: name, ext: "png")
            return Job(arguments: ["-s", "format", "png", url.path, "--out", out.path], output: out)
        case .jpg:
            let out = freeURL(in: folder, name: name, ext: "jpg")
            return Job(arguments: ["-s", "format", "jpeg", "-s", "formatOptions", "85",
                                   url.path, "--out", out.path], output: out)
        case .whatsapp:
            let out = freeURL(in: folder, name: "\(name) (whatsapp)", ext: "jpg")
            return Job(arguments: ["-Z", "\(min(longSide, 1600))", "-s", "format", "jpeg",
                                   "-s", "formatOptions", "80", url.path, "--out", out.path], output: out)
        case .half:
            let out = freeURL(in: folder, name: "\(name) (half)", ext: ext)
            return Job(arguments: ["-Z", "\(max(longSide / 2, 1))", url.path, "--out", out.path], output: out)
        }
    }

    /// Never overwrite: photo.png, then "photo (converted).png", "photo (converted 2).png"...
    private static func freeURL(in folder: URL, name: String, ext: String) -> URL {
        var candidate = folder.appendingPathComponent(name).appendingPathExtension(ext)
        var n = 1
        while FileManager.default.fileExists(atPath: candidate.path) {
            let suffix = n == 1 ? " (converted)" : " (converted \(n))"
            candidate = folder.appendingPathComponent(name + suffix).appendingPathExtension(ext)
            n += 1
        }
        return candidate
    }

    private static func longestSide(of url: URL) -> Int? {
        guard let source = CGImageSourceCreateWithURL(url as CFURL, nil),
              let properties = CGImageSourceCopyPropertiesAtIndex(source, 0, nil) as? [CFString: Any],
              let width = properties[kCGImagePropertyPixelWidth] as? Int,
              let height = properties[kCGImagePropertyPixelHeight] as? Int
        else { return nil }
        return max(width, height)
    }
}

// MARK: - The radial menu (also the drop target)

final class RadialView: NSView {
    var highlighted: Int? {
        didSet { if oldValue != highlighted { needsDisplay = true } }
    }
    var onDrop: (([URL], Action) -> Void)?

    private let actions = Action.allCases
    private let innerRadius: CGFloat = 38
    private var outerRadius: CGFloat { min(bounds.width, bounds.height) / 2 - 6 }
    private var centre: NSPoint { NSPoint(x: bounds.midX, y: bounds.midY) }

    override init(frame: NSRect) {
        super.init(frame: frame)
        registerForDraggedTypes([.fileURL])
    }

    required init?(coder: NSCoder) { fatalError("not used") }

    /// Slice under a point: 0 at the top, then clockwise. nil = the centre (cancel).
    func slice(at point: NSPoint) -> Int? {
        let dx = point.x - centre.x
        let dy = point.y - centre.y
        guard hypot(dx, dy) > innerRadius else { return nil }
        let span = 2 * CGFloat.pi / CGFloat(actions.count)
        var angle = atan2(dx, dy)          // 0 = straight up, growing clockwise
        if angle < 0 { angle += 2 * CGFloat.pi }
        let index = Int((angle + span / 2).truncatingRemainder(dividingBy: 2 * CGFloat.pi) / span)
        return min(index, actions.count - 1)
    }

    override func draw(_ dirtyRect: NSRect) {
        let span = 360 / CGFloat(actions.count)
        for action in actions {
            let i = action.rawValue
            let mid = 90 - CGFloat(i) * span   // AppKit angles: degrees, anticlockwise from the right
            let path = NSBezierPath()
            path.appendArc(withCenter: centre, radius: outerRadius,
                           startAngle: mid - span / 2, endAngle: mid + span / 2, clockwise: false)
            path.appendArc(withCenter: centre, radius: innerRadius,
                           startAngle: mid + span / 2, endAngle: mid - span / 2, clockwise: true)
            path.close()

            let isOn = (i == highlighted)
            (isOn ? NSColor.controlAccentColor : NSColor.windowBackgroundColor.withAlphaComponent(0.95)).setFill()
            path.fill()
            NSColor.separatorColor.setStroke()
            path.lineWidth = 1
            path.stroke()

            let radians = mid * CGFloat.pi / 180
            let labelRadius = (innerRadius + outerRadius) / 2
            let point = NSPoint(x: centre.x + cos(radians) * labelRadius,
                                y: centre.y + sin(radians) * labelRadius)
            drawLabel(action.label, at: point, color: isOn ? .white : .labelColor, size: 13, weight: .semibold)
        }

        let hubRadius = innerRadius - 4
        let hub = NSBezierPath(ovalIn: NSRect(x: centre.x - hubRadius, y: centre.y - hubRadius,
                                              width: hubRadius * 2, height: hubRadius * 2))
        NSColor.windowBackgroundColor.withAlphaComponent(0.95).setFill()
        hub.fill()
        drawLabel("Cancel", at: centre, color: .secondaryLabelColor, size: 11, weight: .regular)
    }

    private func drawLabel(_ text: String, at point: NSPoint, color: NSColor, size: CGFloat, weight: NSFont.Weight) {
        let attributes: [NSAttributedString.Key: Any] = [
            .font: NSFont.systemFont(ofSize: size, weight: weight),
            .foregroundColor: color,
        ]
        let string = text as NSString
        let textSize = string.size(withAttributes: attributes)
        string.draw(at: NSPoint(x: point.x - textSize.width / 2, y: point.y - textSize.height / 2),
                    withAttributes: attributes)
    }

    // Drop target

    override func draggingEntered(_ sender: NSDraggingInfo) -> NSDragOperation { track(sender) }
    override func draggingUpdated(_ sender: NSDraggingInfo) -> NSDragOperation { track(sender) }
    override func draggingExited(_ sender: NSDraggingInfo?) { highlighted = nil }

    private func track(_ sender: NSDraggingInfo) -> NSDragOperation {
        highlighted = slice(at: convert(sender.draggingLocation, from: nil))
        return highlighted == nil ? [] : .copy   // the centre refuses the drop = cancel
    }

    override func performDragOperation(_ sender: NSDraggingInfo) -> Bool {
        guard let index = slice(at: convert(sender.draggingLocation, from: nil)),
              let action = Action(rawValue: index) else { return false }
        let urls = sender.draggingPasteboard.readObjects(
            forClasses: [NSURL.self], options: [.urlReadingFileURLsOnly: true]) as? [URL] ?? []
        onDrop?(urls, action)
        return !urls.isEmpty
    }
}

// MARK: - App: watches for Shift-drags and shows the menu

final class AppDelegate: NSObject, NSApplicationDelegate {
    private var panel: NSPanel!
    private var radial: RadialView!
    private var timer: Timer?
    private var baselineChangeCount = NSPasteboard(name: .drag).changeCount
    private var isShowing = false
    private var hideAfter: Date?

    func applicationDidFinishLaunching(_ notification: Notification) {
        let size: CGFloat = 280
        panel = NSPanel(contentRect: NSRect(x: 0, y: 0, width: size, height: size),
                        styleMask: [.borderless, .nonactivatingPanel],
                        backing: .buffered, defer: false)
        panel.isOpaque = false
        panel.backgroundColor = .clear
        panel.hasShadow = true
        panel.level = .popUpMenu
        panel.hidesOnDeactivate = false
        panel.collectionBehavior = [.canJoinAllSpaces, .fullScreenAuxiliary]

        radial = RadialView(frame: NSRect(x: 0, y: 0, width: size, height: size))
        radial.onDrop = { [weak self] urls, action in
            self?.hide()
            Converter.convert(urls, with: action)
        }
        panel.contentView = radial

        let timer = Timer(timeInterval: 1.0 / 30.0, target: self, selector: #selector(tick),
                          userInfo: nil, repeats: true)
        RunLoop.main.add(timer, forMode: .common)
        self.timer = timer

        print("Ready. In Finder, start dragging an image, then hold Shift. Press Ctrl+C here to quit.")
    }

    @objc private func tick() {
        let dragPasteboard = NSPasteboard(name: .drag)
        let leftButtonDown = (NSEvent.pressedMouseButtons & 1) == 1

        if !leftButtonDown {
            baselineChangeCount = dragPasteboard.changeCount
            // Released somewhere else: hide, but give a drop on the menu time to arrive first.
            if isShowing {
                if let deadline = hideAfter {
                    if Date() >= deadline { hide() }
                } else {
                    hideAfter = Date().addingTimeInterval(0.4)
                }
            }
            return
        }

        guard !isShowing,
              NSEvent.modifierFlags.contains(.shift),
              dragPasteboard.changeCount != baselineChangeCount,
              dragPasteboard.canReadObject(forClasses: [NSURL.self],
                                           options: [.urlReadingFileURLsOnly: true])
        else { return }

        show(at: NSEvent.mouseLocation)
    }

    private func show(at point: NSPoint) {
        let size = panel.frame.size
        var origin = NSPoint(x: point.x - size.width / 2, y: point.y - size.height / 2)
        if let screen = NSScreen.screens.first(where: { NSMouseInRect(point, $0.frame, false) }) {
            let visible = screen.visibleFrame   // keep the whole menu on screen
            origin.x = min(max(origin.x, visible.minX), visible.maxX - size.width)
            origin.y = min(max(origin.y, visible.minY), visible.maxY - size.height)
        }
        radial.highlighted = nil
        panel.setFrameOrigin(origin)
        panel.orderFrontRegardless()
        isShowing = true
        hideAfter = nil
    }

    private func hide() {
        panel.orderOut(nil)
        isShowing = false
        hideAfter = nil
    }
}

// MARK: - Entry point

@main
struct ShiftDragSpike {
    @MainActor
    static func main() {
        let app = NSApplication.shared
        let delegate = AppDelegate()
        app.delegate = delegate
        app.setActivationPolicy(.accessory)   // no Dock icon, no menu bar
        withExtendedLifetime(delegate) { app.run() }
    }
}
