import AppKit
import ServiceManagement

/// Opening at login, so Shift-drag works from the moment someone signs in. Uses the system's own
/// login items, which macOS 13 added; macOS 12 isn't offered it. Answers with what's true now:
/// "on", "off", "approval" (macOS wants the user to allow it in System Settings) or "unsupported".
enum LoginItem {
  static func status() -> String {
    guard #available(macOS 13.0, *) else { return "unsupported" }
    switch SMAppService.mainApp.status {
    case .enabled: return "on"
    case .requiresApproval: return "approval"
    default: return "off"
    }
  }

  static func set(_ on: Bool) -> String {
    guard #available(macOS 13.0, *) else { return "unsupported" }
    do {
      if on {
        try SMAppService.mainApp.register()
      } else {
        try SMAppService.mainApp.unregister()
      }
    } catch {
      NSLog("ShiftDrop: could not change opening at login: \(error)")
    }
    return status()
  }

  /// Whether this launch is macOS opening the app at login, when it should start out of the way.
  /// macOS says so in the event that opens the app; if a version doesn't, the window just shows.
  static func launchedAtLogin() -> Bool {
    let event = NSAppleEventManager.shared().currentAppleEvent
    return event?.eventID == kAEOpenApplication
      && event?.paramDescriptor(forKeyword: keyAEPropData)?.enumCodeValue == keyAELaunchedAsLogInItem
  }
}

/// Text the app has put in the user's language, by key. English until it has.
enum NativeWords {
  private static var words: [String: String] = [:]

  static func set(_ arguments: Any?) {
    if let given = arguments as? [String: String] { words = given }
  }

  static func word(_ key: String, _ english: String) -> String { words[key] ?? english }
}

/// One choice on the radial menu, with the labels of its outer-ring choices, if it has any.
struct RadialSlice {
  let id: String
  let label: String
  var choices: [String] = []
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

/// How wide each outer-ring choice is, as `choiceSpan` in radial_geometry.dart: as wide as a slice,
/// but never so wide that a menu of few slices gets huge choices, nor going round more than once.
func choiceSpan(count: Int, choices: Int) -> CGFloat {
  return min(2 * CGFloat.pi / CGFloat(max(count, 6)), 2 * CGFloat.pi / CGFloat(max(choices, 1)))
}

/// The middle of choice [index] among [choices] gathered around slice [parent] of [count], in
/// radians: 0 is straight up, growing clockwise.
func choiceAngle(_ index: Int, parent: Int, count: Int, choices: Int) -> CGFloat {
  let span = choiceSpan(count: count, choices: choices)
  let middle = CGFloat(parent) * 2 * CGFloat.pi / CGFloat(count)
  return middle - CGFloat(choices) * span / 2 + (CGFloat(index) + 0.5) * span
}

/// The outer-ring choice at a point, from the menu's centre with y growing upwards. Nil inside the
/// menu, past the ring, or on the ring beyond the choices.
func radialChoice(
  dx: CGFloat, dy: CGFloat, parent: Int, count: Int, choices: Int, menuRadius: CGFloat,
  ringRadius: CGFloat
) -> Int? {
  guard choices > 0, count > 0 else { return nil }
  let distance = hypot(dx, dy)
  guard distance > menuRadius, distance <= ringRadius else { return nil }
  let span = choiceSpan(count: count, choices: choices)
  let first = choiceAngle(0, parent: parent, count: count, choices: choices) - span / 2
  var from = (atan2(dx, dy) - first).truncatingRemainder(dividingBy: 2 * CGFloat.pi)
  if from < 0 { from += 2 * CGFloat.pi }
  let index = Int(from / span)
  return index < choices ? index : nil
}

/// The menu's own radius, and the outer ring's around it when a slice has choices.
let radialMenuRadius: CGFloat = 144
let radialRingWidth: CGFloat = 56

/// The radial menu, which is also where the file gets dropped. Drawn here rather than in Flutter
/// because it floats over other apps during their drag, outside this app's window.
final class RadialDropView: NSView {
  var slices: [RadialSlice] = [] { didSet { needsDisplay = true } }
  var highlighted: Int? {
    didSet {
      guard oldValue != highlighted else { return }
      needsDisplay = true
      onHighlight?(highlighted)
    }
  }
  /// The highlighted slice's choice on the outer ring, while the drag is there.
  var choice: Int? { didSet { if oldValue != choice { needsDisplay = true } } }
  /// What the centre says each slice's result will weigh, by slice id, such as "About 240 KB".
  var sizes: [String: String] = [:] { didSet { needsDisplay = true } }
  /// Tools, rather than Convert, which the centre says.
  var isTools = false { didSet { needsDisplay = true } }
  /// The slice dropped on, the files, and the ring choice if it was one.
  var onDrop: ((RadialSlice, [String], Int?) -> Void)?
  var onHighlight: ((Int?) -> Void)?

  private let innerRadius: CGFloat = 38
  private var outerRadius: CGFloat { radialMenuRadius }
  private var ringRadius: CGFloat { radialMenuRadius + radialRingWidth }
  private var centre: NSPoint { NSPoint(x: bounds.midX, y: bounds.midY) }

  /// Whether any slice has choices, so the panel makes room for the ring.
  static func needsRing(_ slices: [RadialSlice]) -> Bool {
    return slices.contains { !$0.choices.isEmpty }
  }

  /// The panel's side, with or without room for the ring.
  static func side(for slices: [RadialSlice]) -> CGFloat {
    return 2 * (radialMenuRadius + 6 + (needsRing(slices) ? radialRingWidth : 0))
  }

  override init(frame: NSRect) {
    super.init(frame: frame)
    registerForDraggedTypes([.fileURL])
  }

  required init?(coder: NSCoder) { fatalError("not used") }

  private func slice(at point: NSPoint) -> Int? {
    guard hypot(point.x - centre.x, point.y - centre.y) <= outerRadius else { return nil }
    return radialSlice(
      dx: point.x - centre.x, dy: point.y - centre.y, count: slices.count, innerRadius: innerRadius)
  }

  private func choice(at point: NSPoint, around parent: Int) -> Int? {
    return radialChoice(
      dx: point.x - centre.x, dy: point.y - centre.y, parent: parent, count: slices.count,
      choices: slices[parent].choices.count, menuRadius: outerRadius, ringRadius: ringRadius)
  }

  /// Follows the drag: on the menu, the slice under it; past the menu, with a slice showing its
  /// choices, that slice stays highlighted while its choices are tried.
  func follow(_ point: NSPoint) {
    let distance = hypot(point.x - centre.x, point.y - centre.y)
    if distance > outerRadius, let parent = highlighted, parent < slices.count,
      !slices[parent].choices.isEmpty
    {
      choice = choice(at: point, around: parent)
      return
    }
    choice = nil
    highlighted = slice(at: point)
  }

  override func draw(_ dirtyRect: NSRect) {
    drawRing()
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
      // Fainter while one of its choices is the one dropped on.
      let accent = choice == nil ? NSColor.controlAccentColor : NSColor.controlAccentColor.withAlphaComponent(0.5)
      let fill = isOn ? accent : NSColor.windowBackgroundColor.withAlphaComponent(0.95)
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
    let cancel = NativeWords.word("cancel", "Cancel")
    let room = (hubRadius - 4) * 2
    // In Tools, the hub says so above whatever else it says.
    let lift: CGFloat = isTools ? 5 : 0
    if isTools {
      let tools = NativeWords.word("tools", "Tools")
      drawLabel(
        tools, at: NSPoint(x: centre.x, y: centre.y + (highlightedSize == nil ? 9 : 19)),
        color: .controlAccentColor,
        size: fittedFontSize(tools, width: room, largest: 9, smallest: 7, weight: .semibold),
        weight: .semibold)
    }
    guard let size = highlightedSize else {
      drawLabel(
        cancel, at: NSPoint(x: centre.x, y: centre.y - lift), color: .secondaryLabelColor, size: 11,
        weight: .regular)
      return
    }
    // The size above, Cancel below, both inside the hub.
    drawLabel(
      size, at: NSPoint(x: centre.x, y: centre.y + 7 - lift / 2), color: .labelColor,
      size: fittedFontSize(size, width: room, largest: 11, smallest: 7, weight: .bold), weight: .bold)
    drawLabel(
      cancel, at: NSPoint(x: centre.x, y: centre.y - 8 - lift / 2), color: .secondaryLabelColor,
      size: 10, weight: .regular)
  }

  /// The highlighted slice's choices, around the menu next to it.
  private func drawRing() {
    guard let parent = highlighted, parent < slices.count else { return }
    let choices = slices[parent].choices
    guard !choices.isEmpty else { return }
    let span = choiceSpan(count: slices.count, choices: choices.count)
    let inner = outerRadius + 4
    for (index, label) in choices.enumerated() {
      let middle = choiceAngle(index, parent: parent, count: slices.count, choices: choices.count)
      // AppKit's angles are degrees anticlockwise from the right.
      let mid = 90 - middle * 180 / CGFloat.pi
      let half = span * 90 / CGFloat.pi
      let path = NSBezierPath()
      path.appendArc(
        withCenter: centre, radius: ringRadius, startAngle: mid - half, endAngle: mid + half,
        clockwise: false)
      path.appendArc(
        withCenter: centre, radius: inner, startAngle: mid + half, endAngle: mid - half,
        clockwise: true)
      path.close()
      let isOn = index == choice
      (isOn ? NSColor.controlAccentColor : NSColor.windowBackgroundColor.withAlphaComponent(0.95))
        .setFill()
      path.fill()
      NSColor.separatorColor.setStroke()
      path.lineWidth = 1
      path.stroke()
      let reach = (inner + ringRadius) / 2
      let point = NSPoint(x: centre.x + sin(middle) * reach, y: centre.y + cos(middle) * reach)
      let width = 2 * reach * sin(span / 2) - 6
      drawLabel(
        label, at: point, color: isOn ? .white : .labelColor,
        size: fittedFontSize(label, width: width, largest: 11, smallest: 8, weight: .semibold),
        weight: .semibold)
    }
  }

  private var highlightedSize: String? {
    guard let index = highlighted, index < slices.count else { return nil }
    return sizes[slices[index].id]
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
  override func draggingExited(_ sender: NSDraggingInfo?) {
    choice = nil
    highlighted = nil
  }

  /// Whether a drop here would choose something: a slice, or past the menu one of its choices.
  private var choosing: Bool {
    guard highlighted != nil else { return false }
    return !isPastMenu || choice != nil
  }
  private var isPastMenu = false

  private func track(_ sender: NSDraggingInfo) -> NSDragOperation {
    let point = convert(sender.draggingLocation, from: nil)
    isPastMenu = hypot(point.x - centre.x, point.y - centre.y) > outerRadius
    follow(point)
    // The centre refuses the drop, which is how to cancel, as does the ring between choices.
    return choosing ? .copy : []
  }

  override func performDragOperation(_ sender: NSDraggingInfo) -> Bool {
    let point = convert(sender.draggingLocation, from: nil)
    isPastMenu = hypot(point.x - centre.x, point.y - centre.y) > outerRadius
    follow(point)
    guard choosing, let index = highlighted else { return false }
    let paths = shiftDragPaths(on: sender.draggingPasteboard)
    guard !paths.isEmpty else { return false }
    onDrop?(slices[index], paths, choice)
    return true
  }
}

/// The largest font size from [largest] down to [smallest] at which [text] fits in [width].
func fittedFontSize(
  _ text: String, width: CGFloat, largest: CGFloat, smallest: CGFloat, weight: NSFont.Weight
) -> CGFloat {
  var size = largest
  while size > smallest {
    let font = NSFont.systemFont(ofSize: size, weight: weight)
    if (text as NSString).size(withAttributes: [.font: font]).width <= width { break }
    size -= 0.5
  }
  return size
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
  /// Asks what the menu should offer for these files, as tools or not. An empty answer shows no
  /// menu.
  var askForSlices: (([String], Bool, @escaping ([RadialSlice]) -> Void) -> Void)?
  /// Asks what the centre should say about a slice's result, or nil if nothing can be told.
  var askForSize: ((RadialSlice, [String], @escaping (String?) -> Void) -> Void)?
  /// The slice, the files, and the ring choice if it was one.
  var onChosen: ((RadialSlice, [String], Int?) -> Void)?
  /// While our own files are being dragged out, holding Shift mustn't bring the menu up over them.
  var isPaused: () -> Bool = { false }

  private let panel: NSPanel
  private let radial: RadialDropView
  private var timer: Timer?
  private var seenChange = NSPasteboard(name: .drag).changeCount
  private var isShowing = false
  private var isAsking = false
  private var hideAt: Date?
  private var paths: [String] = []
  private var sizeTimer: Timer?
  /// Slices already asked about in this drag, so each is asked once.
  private var asked: Set<String> = []
  /// Each showing gets a number, so a late answer about an earlier drag is ignored.
  private var showing = 0
  /// Option held as well asks for Tools instead of Convert, and can change during the drag.
  private var wantsTools: Bool { NSEvent.modifierFlags.contains(.option) }
  /// The kind last asked for in this drag, so each change of Option asks once.
  private var askedTools = false
  private var isSwitching = false

  /// How long a slice stays highlighted before its size is asked, so sweeping across the ring
  /// doesn't start work for every slice passed. The window's menu waits as long.
  static let sizeDwell: TimeInterval = 0.25

  override init() {
    let size = RadialDropView.side(for: [])
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
    radial.onDrop = { [weak self] slice, paths, choice in
      self?.hide()
      self?.onChosen?(slice, paths, choice)
    }
    radial.onHighlight = { [weak self] index in self?.highlightChanged(index) }
  }

  private func highlightChanged(_ index: Int?) {
    sizeTimer?.invalidate()
    sizeTimer = nil
    guard isShowing, askForSize != nil, let index = index, index < radial.slices.count else {
      return
    }
    let slice = radial.slices[index]
    guard !asked.contains(slice.id) else { return }
    let timer = Timer(timeInterval: Self.sizeDwell, repeats: false) { [weak self] _ in
      self?.askSize(of: slice)
    }
    // Common modes, as the drag is still being tracked.
    RunLoop.main.add(timer, forMode: .common)
    sizeTimer = timer
  }

  private func askSize(of slice: RadialSlice) {
    let showing = self.showing
    asked.insert(slice.id)
    askForSize?(slice, paths) { [weak self] size in
      guard let self = self, self.isShowing, self.showing == showing, let size = size else { return }
      self.radial.sizes[slice.id] = size
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
    if isShowing {
      if !isSwitching, wantsTools != askedTools { switchMode(to: wantsTools) }
      return
    }
    guard !isAsking, NSEvent.modifierFlags.contains(.shift), pasteboard.changeCount != seenChange
    else { return }
    let paths = shiftDragPaths(on: pasteboard)
    guard !paths.isEmpty else { return }

    isAsking = true
    let tools = wantsTools
    askForSlices?(paths, tools) { [weak self] slices in
      guard let self = self else { return }
      self.isAsking = false
      // The drag may have ended while waiting, and a file nothing can convert shows no menu.
      guard !slices.isEmpty, NSEvent.pressedMouseButtons & 1 == 1 else {
        // Don't ask again about the same drag.
        self.seenChange = pasteboard.changeCount
        return
      }
      self.show(slices, for: paths, at: NSEvent.mouseLocation, tools: tools)
    }
  }

  /// Option pressed or let go while the menu shows: the same files, the other kind of actions. If
  /// there are none, the menu stays as it was.
  private func switchMode(to tools: Bool) {
    isSwitching = true
    askedTools = tools
    let showing = self.showing
    askForSlices?(paths, tools) { [weak self] slices in
      guard let self = self else { return }
      self.isSwitching = false
      // Nothing of that kind keeps the menu as it was, until Option changes again.
      guard self.isShowing, self.showing == showing, !slices.isEmpty else { return }
      self.radial.isTools = tools
      self.radial.choice = nil
      self.radial.highlighted = nil
      self.radial.slices = slices
      self.asked = []
      self.radial.sizes = [:]
      self.resize(for: slices)
    }
  }

  /// Makes room for the outer ring, or gives it back, keeping the menu where it is.
  private func resize(for slices: [RadialSlice]) {
    let side = RadialDropView.side(for: slices)
    let old = panel.frame
    guard old.width != side else { return }
    let centre = NSPoint(x: old.midX, y: old.midY)
    panel.setFrame(
      NSRect(x: centre.x - side / 2, y: centre.y - side / 2, width: side, height: side),
      display: true)
  }

  private func show(
    _ slices: [RadialSlice], for paths: [String], at point: NSPoint, tools: Bool
  ) {
    showing += 1
    self.paths = paths
    asked = []
    radial.sizes = [:]
    radial.isTools = tools
    askedTools = tools
    isSwitching = false
    let side = RadialDropView.side(for: slices)
    let size = NSSize(width: side, height: side)
    let origin = originOnScreen(
      NSPoint(x: point.x - size.width / 2, y: point.y - size.height / 2), size: size, near: point)
    radial.slices = slices
    radial.choice = nil
    radial.highlighted = nil
    panel.setFrame(NSRect(origin: origin, size: size), display: false)
    panel.orderFrontRegardless()
    isShowing = true
    hideAt = nil
  }

  private func hide() {
    panel.orderOut(nil)
    isShowing = false
    hideAt = nil
    sizeTimer?.invalidate()
    sizeTimer = nil
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
    (NativeWords.word("dragToApp", "Drag to another app") as NSString).draw(
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
