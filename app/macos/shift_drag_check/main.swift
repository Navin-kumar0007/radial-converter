// Checks the parts of ShiftDrag.swift that need no real drag, with only Apple's Command Line Tools.
// Run by app/tool/check_shift_drag.sh. A real drag from Finder still has to be tried by hand.

import AppKit

var failures = 0

func check(_ what: String, _ got: Int?, _ expected: Int?) {
  if got != expected {
    print("FAILED \(what): got \(String(describing: got)), expected \(String(describing: expected))")
    failures += 1
  }
}

let radius: CGFloat = 38

// Four slices: top, right, bottom, left, with y growing upwards.
check("top", radialSlice(dx: 0, dy: 100, count: 4, innerRadius: radius), 0)
check("right", radialSlice(dx: 100, dy: 0, count: 4, innerRadius: radius), 1)
check("bottom", radialSlice(dx: 0, dy: -100, count: 4, innerRadius: radius), 2)
check("left", radialSlice(dx: -100, dy: 0, count: 4, innerRadius: radius), 3)
check("just left of the top is still the top", radialSlice(dx: -30, dy: 100, count: 4, innerRadius: radius), 0)
check("the centre cancels", radialSlice(dx: 10, dy: 10, count: 4, innerRadius: radius), nil)
check("no slices", radialSlice(dx: 0, dy: 100, count: 0, innerRadius: radius), nil)
check("one slice takes the ring", radialSlice(dx: -80, dy: -80, count: 1, innerRadius: radius), 0)
for count in 1...8 {
  for degrees in stride(from: 0, to: 360, by: 7) {
    let angle = CGFloat(degrees) * CGFloat.pi / 180
    let found = radialSlice(dx: sin(angle) * 100, dy: cos(angle) * 100, count: count, innerRadius: radius)
    if found == nil || found! < 0 || found! >= count {
      print("FAILED \(count) slices at \(degrees) degrees: \(String(describing: found))")
      failures += 1
    }
  }
}

// The menu builds and draws with any number of slices, and long labels, without a window server.
let app = NSApplication.shared
let view = RadialDropView(frame: NSRect(x: 0, y: 0, width: 300, height: 300))
for count in [1, 4, 8] {
  view.slices = (0..<count).map { RadialSlice(id: "id\($0)", label: "Under 100 KB") }
  view.highlighted = 0
  let image = NSImage(size: view.bounds.size)
  image.lockFocus()
  view.draw(view.bounds)
  image.unlockFocus()
}

// The centre fits a size above Cancel, shrinking long ones rather than spilling over the ring.
view.slices = (0..<4).map { RadialSlice(id: "id\($0)", label: "PNG") }
view.sizes = ["id0": "About 240 KB", "id2": "लगभग 1,023.9 MB"]
view.highlighted = nil
var highlightsSeen: [Int?] = []
view.onHighlight = { highlightsSeen.append($0) }
for index in [0, 1, 2, 2, nil] as [Int?] {
  view.highlighted = index
  let image = NSImage(size: view.bounds.size)
  image.lockFocus()
  view.draw(view.bounds)
  image.unlockFocus()
}
if highlightsSeen != [0, 1, 2, nil] {
  print("FAILED a highlight is told once per change: \(highlightsSeen)")
  failures += 1
}
let fitted = fittedFontSize("About 1,023.9 MB", width: 60, largest: 11, smallest: 7, weight: .bold)
let fittedWidth = ("About 1,023.9 MB" as NSString).size(
  withAttributes: [.font: NSFont.systemFont(ofSize: fitted, weight: .bold)]).width
if fitted >= 11 || (fitted > 7 && fittedWidth > 60) {
  print("FAILED a long size shrinks to fit: \(fitted) pt, \(fittedWidth) wide")
  failures += 1
}
if fittedFontSize("1 KB", width: 60, largest: 11, smallest: 7, weight: .bold) != 11 {
  print("FAILED a short size keeps its full size")
  failures += 1
}

let watcher = ShiftDragWatcher()
watcher.start()

// Nothing on a clean pasteboard is a file.
let pasteboard = NSPasteboard(name: NSPasteboard.Name("radial.check"))
pasteboard.clearContents()
check("an empty pasteboard has no files", shiftDragPaths(on: pasteboard).count, 0)
let file = URL(fileURLWithPath: "/tmp/photo one.png")
pasteboard.clearContents()
pasteboard.writeObjects([file as NSURL])
check("a file is found", shiftDragPaths(on: pasteboard).count, 1)
if shiftDragPaths(on: pasteboard).first != file.path {
  print("FAILED path: \(shiftDragPaths(on: pasteboard))")
  failures += 1
}
pasteboard.clearContents()
pasteboard.setString("just text", forType: .string)
check("text is not a file", shiftDragPaths(on: pasteboard).count, 0)
pasteboard.releaseGlobally()

// Where things go near a screen's edge.
let area = NSRect(x: 0, y: 0, width: 1000, height: 800)
let chip = NSSize(width: 280, height: 56)
check("stays put inside x", Int(clamped(NSPoint(x: 100, y: 100), size: chip, within: area).x), 100)
check("right edge", Int(clamped(NSPoint(x: 990, y: 100), size: chip, within: area).x), 720)
check("left edge", Int(clamped(NSPoint(x: -50, y: 100), size: chip, within: area).x), 0)
check("top edge", Int(clamped(NSPoint(x: 100, y: 790), size: chip, within: area).y), 744)
check("bottom edge", Int(clamped(NSPoint(x: 100, y: -9), size: chip, within: area).y), 0)

if chipTitle(for: ["/a/b/photo.png"]) != "photo.png" {
  print("FAILED a chip names its one file")
  failures += 1
}
if chipTitle(for: ["/a/1.png", "/a/2.png", "/a/3.png"]) != "3 files" {
  print("FAILED a chip counts many files")
  failures += 1
}

if moveFileToTrash("/no/such/file/at/all.png") {
  print("FAILED trashing a missing file should say so")
  failures += 1
}

// Only on a build machine, as this puts a file in the real Trash.
if ProcessInfo.processInfo.environment["CI"] != nil {
  let trial = NSTemporaryDirectory() + "radial-trash-\(getpid()).txt"
  FileManager.default.createFile(atPath: trial, contents: Data([1, 2, 3]))
  if !moveFileToTrash(trial) || FileManager.default.fileExists(atPath: trial) {
    print("FAILED a file goes to the Trash")
    failures += 1
  }
}

// Only reads: turning it on here would add this check program to the login items.
if !["on", "off", "approval", "unsupported"].contains(LoginItem.status()) {
  print("FAILED login item status is one of the four answers: \(LoginItem.status())")
  failures += 1
}
if LoginItem.launchedAtLogin() {
  print("FAILED a program started from a shell isn't opened at login")
  failures += 1
}

if failures == 0 { print("Shift-drag checks passed.") }
exit(failures == 0 ? 0 : 1)
