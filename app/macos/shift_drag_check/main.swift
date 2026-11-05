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

if failures == 0 { print("Shift-drag checks passed.") }
exit(failures == 0 ? 0 : 1)
