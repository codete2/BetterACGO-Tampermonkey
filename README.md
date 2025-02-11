# BetterACGO Userscript

A userscript that enhances the ACGO Online Judge platform with additional features and dark theme improvements.

## Features

### 🎨 Visual Enhancements
- Dark theme optimization for input/output examples
- Consistent button styling
- Improved text visibility
- Enhanced dark theme color scheme

### 🛠️ New Toolbar Functions
| Button | Function |
|--------|----------|
| 📥 Download | Save current code as a file |
| 📤 Upload | Import code from local files |
| 📚 Template | Access common algorithms and functions |
| ✨ Format | Auto-format code indentation |
| 📊 Stats | View code statistics |

### 📝 Code Templates & Hints
#### Algorithm Templates
- Sorting (Quick Sort, Merge Sort)
- Searching (Binary Search)
- Data Structures (Union Find, Segment Tree)

#### Function Documentation
```cpp
// Example hint display
sort(first, last)
Header: <algorithm>
Description: Sort elements in range
Complexity: O(N·log(N))
```

#### Supported Functions
- **STL Algorithms**
  - `sort`, `binary_search`, `lower_bound`, `upper_bound`
  - `max_element`, `min_element`, `reverse`
- **Math Functions**
  - `abs`, `pow`, `sqrt`, `ceil`, `floor`
  - `gcd`, `lcm`
- **String Operations**
  - `substr`, `find`, `length`
  - `to_string`, `stoi`, `stoll`
- **Container Operations**
  - `push_back`, `pop_back`, `size`, `empty`
  - `front`, `back`, `begin`, `end`
- **I/O Functions**
  - `cin`, `cout`, `printf`, `scanf`
- **GCC Built-ins**
  - `__builtin_popcount`, `__builtin_ctz`

### 🔧 Code Assistance
- Real-time function parameter hints
- Documentation tooltips
- Code formatting with proper indentation
- Code statistics:
  - Line count
  - Character count
  - Word count
  - Function count

## Installation
1. Install Tampermonkey browser extension
2. Create new script
3. Copy and paste the script content
4. Save and enable

## Usage
- Use toolbar buttons for quick actions
- Type function name + '(' for hints
- Access templates through the template button
- Format code with single click
- View statistics in popup window

## Notes
- Preserves all original platform functionality
- Non-intrusive UI enhancements
- Consistent dark theme design
