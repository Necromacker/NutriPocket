
import sys
try:
    with open('nutrition.json', 'r', encoding='utf-8') as f:
        lines = f.readlines()
        print(f"Total lines: {len(lines)}")
        
        start = max(0, 21140)
        end = min(len(lines), 21155)
        
        print(f"Inspecting lines {start+1} to {end}:")
        for i, line in enumerate(lines[start:end], start=start+1):
            print(f"{i}: {repr(line)}")
except Exception as e:
    print(f"Error: {e}")
