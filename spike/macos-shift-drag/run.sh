#!/bin/bash
# Builds and runs the Shift-drag spike. Needs only Apple's Command Line Tools.
set -e
cd "$(dirname "$0")"
echo "Building..."
swiftc -parse-as-library -swift-version 5 -O ShiftDragSpike.swift -o ShiftDragSpike
./ShiftDragSpike
