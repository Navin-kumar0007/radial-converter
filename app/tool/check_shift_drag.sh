#!/bin/bash
# Checks the macOS Shift-drag code without building the app. Needs only Apple's Command Line Tools.
set -euo pipefail

here="$(cd "$(dirname "$0")/.." && pwd)"
out="$(mktemp -d)/check"
swiftc -swift-version 5 "$here/macos/Runner/ShiftDrag.swift" "$here/macos/shift_drag_check/main.swift" -o "$out"

# The Windows menu's geometry is plain C++, so it can be checked here too.
windows="$(dirname "$out")/windows_check"
clang++ -std=c++17 -I"$here/windows/runner" "$here/macos/shift_drag_check/windows_slice.cpp" -o "$windows"
"$windows"
"$out"
