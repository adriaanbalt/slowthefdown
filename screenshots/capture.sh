#!/bin/bash
# Capture gameplay states from a booted simulator running the dev client.
# Usage: screenshots/capture.sh <UDID> <out_dir> <center_x_pt> <center_y_pt>
set -u
UDID="$1"
OUT="$2"
CX="$3"
CY="$4"
mkdir -p "$OUT"

shot() { xcrun simctl io "$UDID" screenshot "$OUT/$1.png" >/dev/null 2>&1; }

axe tap --label "Game" --udid "$UDID" >/dev/null 2>&1
sleep 2

for i in $(seq -w 1 12); do shot "idle_$i"; sleep 0.35; done

axe touch -x "$CX" -y "$CY" --down --udid "$UDID" >/dev/null
for i in $(seq -w 1 40); do shot "hold_$i"; sleep 0.4; done
axe touch -x "$CX" -y "$CY" --up --udid "$UDID" >/dev/null

for i in $(seq -w 1 16); do shot "after_$i"; sleep 0.6; done

axe tap --label "Profile" --udid "$UDID" >/dev/null 2>&1
sleep 3
shot profile
axe tap --label "Times" --udid "$UDID" >/dev/null 2>&1
sleep 3
shot times
axe tap --label "Game" --udid "$UDID" >/dev/null 2>&1
