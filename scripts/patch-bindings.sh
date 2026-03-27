#!/bin/bash
# Patches XMTP node-bindings to use local libiconv instead of Nix store path
# Run after every `pnpm install`

BINDINGS=$(find node_modules/.pnpm -name "bindings_node.darwin-arm64.node" -path "*@xmtp*" 2>/dev/null)

for binding in $BINDINGS; do
  echo "Patching: $binding"
  install_name_tool -change \
    /nix/store/7h6icyvqv6lqd0bcx41c8h3615rjcqb2-libiconv-109.100.2/lib/libiconv.2.dylib \
    /opt/local/lib/libiconv.2.dylib \
    "$binding" 2>/dev/null
  codesign --force --sign - "$binding" 2>/dev/null
done

echo "Patched $(echo "$BINDINGS" | wc -l | tr -d ' ') bindings"
