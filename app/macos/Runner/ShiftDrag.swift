import AppKit

/// One choice on the radial menu.
struct RadialSlice {
  let id: String
  let label: String
}

/// Slice at a point, for [count] slices: 0 is at the top, then clockwise. Nil is the centre, which
/// cancels. Coordinates are from the menu's centre, with y growing upwards as AppKit's does.
func radialSlice(dx: CGFloat, dy: CGFloat, count: Int, innerRadius: CGFloat) -> Int? {
  guard count > 0, hypot(dx, dy) > innerRadius else { return nil }
  let span = 2 * CGFloat.pi / CGFloat(count)
  var angle = atan2(dx, dy)
  if angle < 0 { angle += 2 * CGFloat.pi }
  let index = Int((angle + span / 2).truncatingRemainder(dividingBy: 2 * CGFloat.pi) / span)
  return min(index, count - 1)
}

/// The radial menu, which is also where the file gets dropped. Drawn here rather than in Flutter
/// because it floats over other apps during their drag, outside this app's window.
final class RadialDropView: NSView {
  var slices: [RadialSlice] = [] { didSet { needsDisplay = true } }
  var highlighted: Int? {
    didSet { if oldValue != highlighted { needsDisplay = true } }
  }
  var onDrop: ((RadialSlice, [String]) -> Void)?

  private let innerRadius: CGFloat = 38
  private var outerRadius: CGFloat { min(bounds.width, bounds.height) / 2 - 6 }
  private var centre: NSPoint { NSPoint(x: bounds.midX, y: bounds.midY) }

  override init(frame: NSRect) {
    super.init(frame: frame)
    registerForDraggedTypes([.fileURL])
  }

  required init?(coder: NSCoder) { fatalError("not used") }

  private func slice(at point: NSPoint) -> Int? {
    return radialSlice(
      dx: point.x - centre.x, dy: point.y - centre.y, count: slices.count, innerRadius: innerRadius)
  }

  override func draw(_ dirtyRect: NSRect) {
    let span = 360 / CGFloat(max(slices.count, 1))
    for (index, slice) in slices.enumerated() {
      // AppKit's angles run anticlockwise from the right.
      let mid = 90 - CGFloat(index) * span
      let path = NSBezierPath()
      path.appendArc(
        withCenter: centre, radius: outerRadius,
        startAngle: mid - span / 2, endAngle: mid + span / 2, clockwise: false)
      path.appendArc(
        withCenter: centre, radius: innerRadius,
        startAngle: mid + span / 2, endAngle: mid - span / 2, clockwise: true)
      path.close()

      let isOn = index == highlighted
      let fill = isOn ? NSColor.controlAccentColor : NSColor.windowBackgroundColor.withAlphaComponent(0.95)
      fill.setFill()
      path.fill()
      NSColor.separatorColor.setStroke()
      path.lineWidth = 1
      path.stroke()

      let radians = mid * CGFloat.pi / 180
      let labelRadius = (innerRadius + outerRadius) / 2
      let point = NSPoint(
        x: centre.x + cos(radians) * labelRadius, y: centre.y + sin(radians) * labelRadius)
      drawLabel(slice.label, at: point, color: isOn ? .white : .labelColor, size: 13, weight: .semibold)
    }

    let hubRadius = innerRadius - 4
    let hub = NSBezierPath(
      ovalIn: NSRect(
        x: centre.x - hubRadius, y: centre.y - hubRadius, width: hubRadius * 2, height: hubRadius * 2))
    NSColor.windowBackgroundColor.withAlphaComponent(0.95).setFill()
    hub.fill()
    drawLabel("Cancel", at: centre, color: .secondaryLabelColor, size: 11, weight: .regular)
  }

  private func drawLabel(
    _ text: String, at point: NSPoint, color: NSColor, size: CGFloat, weight: NSFont.Weight
  ) {
    let attributes: [NSAttributedString.Key: Any] = [
      .font: NSFont.systemFont(ofSize: size, weight: weight),
      .foregroundColor: color,
    ]
    let string = text as NSString
    let textSize = string.size(withAttributes: attributes)
    string.draw(
      at: NSPoint(x: point.x - textSize.width / 2, y: point.y - textSize.height / 2),
      withAttributes: attributes)
  }

  override func draggingEntered(_ sender: NSDraggingInfo) -> NSDragOperation { track(sender) }
  override func draggingUpdated(_ sender: NSDraggingInfo) -> NSDragOperation { track(sender) }
  override func draggingExited(_ sender: NSDraggingInfo?) { highlighted = nil }

  private func track(_ sender: NSDraggingInfo) -> NSDragOperation {
    highlighted = slice(at: convert(sender.draggingLocation, from: nil))
    // The centre refuses the drop, which is how to cancel.
    return highlighted == nil ? [] : .copy
  }

  override func performDragOperation(_ sender: NSDraggingInfo) -> Bool {
    guard let index = slice(at: convert(sender.draggingLocation, from: nil)) else { return false }
    let paths = shiftDragPaths(on: sender.draggingPasteboard)
    guard !paths.isEmpty else { return false }
    onDrop?(slices[index], paths)
    return true
  }
}

/// The files on a drag, as paths.
func shiftDragPaths(on pasteboard: NSPasteboard) -> [String] {
  let urls =
    pasteboard.readObjects(forClasses: [NSURL.self], options: [.urlReadingFileURLsOnly: true])
    as? [URL] ?? []
  return urls.map(\.path)
}

/// Shows the radial menu when a file is dragged with Shift held, anywhere on the Mac. Checks 30
/// times a second: left button down, Shift held, and the system's drag pasteboard holding a new file
/// drag. This needs no special permissions, unlike watching the mouse with an event tap.
final class ShiftDragWatcher: NSObject {
  /// Asks what the menu should offer for these files. An empty answer shows no menu.
  var askForSlices: (([String], @escaping ([RadialSlice]) -> Void) -> Void)?
  var onChosen: ((RadialSlice, [String]) -> Void)?
  /// While our own files are being dragged out, holding Shift mustn't bring the menu up over them.
  var isPaused: () -> Bool = { false }

  private let panel: NSPanel
  private let radial: RadialDropView
  private var timer: Timer?
  private var seenChange = NSPasteboard(name: .drag).changeCount
  private var isShowing = false
  private var isAsking = false
  private var hideAt: Date?

  override init() {
    let size: CGFloat = 300
    let frame = NSRect(x: 0, y: 0, width: size, height: size)
    panel = NSPanel(
      contentRect: frame, styleMask: [.borderless, .nonactivatingPanel], backing: .buffered,
      defer: false)
    panel.isOpaque = false
    panel.backgroundColor = .clear
    panel.hasShadow = true
    panel.level = .popUpMenu
    panel.hidesOnDeactivate = false
    panel.collectionBehavior = [.canJoinAllSpaces, .fullScreenAuxiliary]
    radial = RadialDropView(frame: frame)
    panel.contentView = radial
    super.init()
    radial.onDrop = { [weak self] slice, paths in
      self?.hide()
      self?.onChosen?(slice, paths)
    }
  }

  func start() {
    let timer = Timer(
      timeInterval: 1.0 / 30.0, target: self, selector: #selector(tick), userInfo: nil, repeats: true)
    // Common modes, or it would stop while another app's drag is being tracked.
    RunLoop.main.add(timer, forMode: .common)
    self.timer = timer
  }

  @objc private func tick() {
    let pasteboard = NSPasteboard(name: .drag)
    if isPaused() {
      seenChange = pasteboard.changeCount
      return
    }
    if NSEvent.pressedMouseButtons & 1 != 1 {
      seenChange = pasteboard.changeCount
      // Released somewhere. A drop on the menu arrives just after, so give it time.
      if isShowing {
        if let deadline = hideAt {
          if Date() >= deadline { hide() }
        } else {
          hideAt = Date().addingTimeInterval(0.4)
        }
      }
      return
    }
    guard !isShowing, !isAsking, NSEvent.modifierFlags.contains(.shift),
      pasteboard.changeCount != seenChange
    else { return }
    let paths = shiftDragPaths(on: pasteboard)
    guard !paths.isEmpty else { return }

    isAsking = true
    askForSlices?(paths) { [weak self] slices in
      guard let self = self else { return }
      self.isAsking = false
      // The drag may have ended while waiting, and a file nothing can convert shows no menu.
      guard !slices.isEmpty, NSEvent.pressedMouseButtons & 1 == 1 else {
        // Don't ask again about the same drag.
        self.seenChange = pasteboard.changeCount
        return
      }
      self.show(slices, at: NSEvent.mouseLocation)
    }
  }

  private func show(_ slices: [RadialSlice], at point: NSPoint) {
    let size = panel.frame.size
    let origin = originOnScreen(
      NSPoint(x: point.x - size.width / 2, y: point.y - size.height / 2), size: size, near: point)
    radial.slices = slices
    radial.highlighted = nil
    panel.setFrameOrigin(origin)
    panel.orderFrontRegardless()
    isShowing = true
    hideAt = nil
  }

  private func hide() {
    panel.orderOut(nil)
    isShowing = false
    hideAt = nil
  }
}

/// [origin] moved as little as needed for [size] to stay on the screen holding [point].
func originOnScreen(_ origin: NSPoint, size: NSSize, near point: NSPoint) -> NSPoint {
  guard let screen = NSScreen.screens.first(where: { NSMouseInRect(point, $0.frame, false) }) else {
    return origin
  }
  return clamped(origin, size: size, within: screen.visibleFrame)
}

func clamped(_ origin: NSPoint, size: NSSize, within area: NSRect) -> NSPoint {
  return NSPoint(
    x: min(max(origin.x, area.minX), area.maxX - size.width),
    y: min(max(origin.y, area.minY), area.maxY - size.height))
}

/// Drags files out to other apps. A drag must start from a real mouse event, and the request arrives
/// a moment later from Flutter, so this remembers the latest one.
final class FileDragger: NSObject, NSDraggingSource {
  private(set) var isDragging = false
  private var latestPress: NSEvent?
  private var monitor: Any?
  private var onEnded: (() -> Void)?

  override init() {
    super.init()
    monitor = NSEvent.addLocalMonitorForEvents(matching: [.leftMouseDown, .leftMouseDragged]) {
      [weak self] event in
      self?.latestPress = event
      return event
    }
  }

  /// False if the button was released before the drag could start.
  @discardableResult
  func begin(paths: [String], from view: NSView, onEnded: (() -> Void)? = nil) -> Bool {
    guard !paths.isEmpty, !isDragging, NSEvent.pressedMouseButtons & 1 == 1,
      let event = latestPress, event.window === view.window
    else { return false }
    let spot = view.convert(event.locationInWindow, from: nil)
    let side: CGFloat = 48
    let items = paths.enumerated().map { index, path -> NSDraggingItem in
      let item = NSDraggingItem(pasteboardWriter: NSURL(fileURLWithPath: path))
      let shift = CGFloat(index) * 6
      item.setDraggingFrame(
        NSRect(x: spot.x - side / 2 + shift, y: spot.y - side / 2 - shift, width: side, height: side),
        contents: NSWorkspace.shared.icon(forFile: path))
      return item
    }
    isDragging = true
    self.onEnded = onEnded
    view.beginDraggingSession(with: items, event: event, source: self)
    return true
  }

  func draggingSession(
    _ session: NSDraggingSession, sourceOperationMaskFor context: NSDraggingContext
  ) -> NSDragOperation {
    return .copy
  }

  func draggingSession(
    _ session: NSDraggingSession, endedAt screenPoint: NSPoint, operation: NSDragOperation
  ) {
    isDragging = false
    let ended = onEnded
    onEnded = nil
    ended?()
    // The system kept the mouse-up, so whatever started this never saw the button released.
    guard let window = latestPress?.window,
      let up = NSEvent.mouseEvent(
        with: .leftMouseUp, location: window.mouseLocationOutsideOfEventStream, modifierFlags: [],
        timestamp: ProcessInfo.processInfo.systemUptime, windowNumber: window.windowNumber,
        context: nil, eventNumber: 0, clickCount: 1, pressure: 0)
    else { return }
    window.sendEvent(up)
  }
}

/// What a result chip says. Several files go together, so it names how many.
func chipTitle(for paths: [String]) -> String {
  if paths.count == 1 { return (paths[0] as NSString).lastPathComponent }
  return "\(paths.count) files"
}

private final class ResultChipView: NSView {
  var paths: [String] = [] { didSet { needsDisplay = true } }
  var dragger: FileDragger?
  var onDragged: (() -> Void)?

  override func acceptsFirstMouse(for event: NSEvent?) -> Bool { return true }

  override func draw(_ dirtyRect: NSRect) {
    let shape = NSBezierPath(roundedRect: bounds.insetBy(dx: 1, dy: 1), xRadius: 12, yRadius: 12)
    NSColor.windowBackgroundColor.withAlphaComponent(0.97).setFill()
    shape.fill()
    NSColor.separatorColor.setStroke()
    shape.stroke()

    let side: CGFloat = 36
    if let first = paths.first {
      NSWorkspace.shared.icon(forFile: first).draw(
        in: NSRect(x: 10, y: (bounds.height - side) / 2, width: side, height: side))
    }
    let textX: CGFloat = 54
    let width = bounds.width - textX - 10
    let style = NSMutableParagraphStyle()
    style.lineBreakMode = .byTruncatingMiddle
    (chipTitle(for: paths) as NSString).draw(
      in: NSRect(x: textX, y: bounds.midY, width: width, height: 18),
      withAttributes: [
        .font: NSFont.systemFont(ofSize: 13, weight: .semibold),
        .foregroundColor: NSColor.labelColor,
        .paragraphStyle: style,
      ])
    ("Drag to another app" as NSString).draw(
      in: NSRect(x: textX, y: bounds.midY - 18, width: width, height: 16),
      withAttributes: [
        .font: NSFont.systemFont(ofSize: 11),
        .foregroundColor: NSColor.secondaryLabelColor,
      ])
  }

  override func mouseDragged(with event: NSEvent) {
    guard dragger?.isDragging == false else { return }
    dragger?.begin(paths: paths, from: self) { [weak self] in self?.onDragged?() }
  }
}

/// A small chip at the cursor after a Shift-drag, to drag the results straight on. It floats over
/// other apps, as this app's window may be behind them, and goes away by itself.
final class ResultChip {
  private let panel: NSPanel
  private let view: ResultChipView
  private var hideTimer: Timer?
  private static let lifetime: TimeInterval = 15

  init(dragger: FileDragger) {
    let frame = NSRect(x: 0, y: 0, width: 280, height: 56)
    panel = NSPanel(
      contentRect: frame, styleMask: [.borderless, .nonactivatingPanel], backing: .buffered,
      defer: false)
    panel.isOpaque = false
    panel.backgroundColor = .clear
    panel.hasShadow = true
    panel.level = .floating
    panel.hidesOnDeactivate = false
    panel.becomesKeyOnlyIfNeeded = true
    panel.collectionBehavior = [.canJoinAllSpaces, .fullScreenAuxiliary]
    view = ResultChipView(frame: frame)
    view.dragger = dragger
    panel.contentView = view
    view.onDragged = { [weak self] in self?.hide() }
  }

  func show(paths: [String]) {
    guard !paths.isEmpty else { return }
    view.paths = paths
    let point = NSEvent.mouseLocation
    let size = panel.frame.size
    panel.setFrameOrigin(
      originOnScreen(NSPoint(x: point.x + 12, y: point.y - size.height - 12), size: size, near: point))
    panel.orderFrontRegardless()
    hideTimer?.invalidate()
    hideTimer = Timer.scheduledTimer(withTimeInterval: Self.lifetime, repeats: false) { [weak self] _ in
      self?.hide()
    }
  }

  func hide() {
    hideTimer?.invalidate()
    hideTimer = nil
    panel.orderOut(nil)
  }
}

/// Moves a file to the Trash, where it can still be got back. False if that couldn't be done.
func moveFileToTrash(_ path: String) -> Bool {
  do {
    try FileManager.default.trashItem(at: URL(fileURLWithPath: path), resultingItemURL: nil)
    return true
  } catch {
    return false
  }
}
