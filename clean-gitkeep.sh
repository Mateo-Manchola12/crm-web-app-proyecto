#!/bin/bash

find . -type f -name ".gitkeep" | while read gitkeep_file; do
  dir=$(dirname "$gitkeep_file")

  # Contar entradas (archivos o carpetas), ignorando "." y ".."
  entry_count=$(find "$dir" -mindepth 1 -maxdepth 1 ! -name ".gitkeep" | wc -l)

  if [ "$entry_count" -gt 0 ]; then
    rm "$gitkeep_file"
  else
    echo "Conservando $gitkeep_file (es lo único en el directorio)"
  fi
done
