class HeatmapGenerator {
    constructor() {
        this.keyboardLayout = [
            ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
            ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
            ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', 'Enter'],
            ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
            ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Win', 'Menu', 'Ctrl']
        ];
        
        this.specialKeys = {
            'Backspace': { width: 2 },
            'Tab': { width: 1.5 },
            'Caps': { width: 1.75 },
            'Enter': { width: 2.25 },
            'Shift': { width: 2.5 },
            'Ctrl': { width: 1.5 },
            'Win': { width: 1.25 },
            'Alt': { width: 1.25 },
            'Space': { width: 6.5 },
            'Menu': { width: 1.25 }
        };
    }
    
    generateHeatmap(errorMap) {
        const heatmapContainer = document.getElementById('heatmap-container');
        heatmapContainer.innerHTML = '';
        
        // Create keyboard layout
        this.keyboardLayout.forEach(row => {
            const keyboardRow = document.createElement('div');
            keyboardRow.className = 'keyboard-row';
            
            row.forEach(key => {
                const keyElement = document.createElement('div');
                keyElement.className = 'key';
                
                // Apply special key styling
                if (this.specialKeys[key]) {
                    keyElement.style.width = `${this.specialKeys[key].width * 40}px`;
                }
                
                // Set key label
                keyElement.textContent = key === 'Space' ? ' ' : key;
                
                // Apply heat coloring based on error frequency
                const lowerKey = key.toLowerCase();
                if (errorMap[lowerKey] || errorMap[key]) {
                    const errorData = errorMap[lowerKey] || errorMap[key];
                    const errorCount = errorData.count;
                    
                    // Calculate heat intensity (0-100)
                    const intensity = Math.min(100, errorCount * 20);
                    
                    // Apply color gradient from yellow to red
                    keyElement.style.backgroundColor = this.getHeatColor(intensity);
                    keyElement.style.color = intensity > 50 ? 'white' : 'black';
                    
                    // Add error count as data attribute
                    keyElement.setAttribute('data-errors', errorCount);
                    
                    // Add tooltip
                    keyElement.title = `${errorCount} error${errorCount !== 1 ? 's' : ''}`;
                }
                
                keyboardRow.appendChild(keyElement);
            });
            
            heatmapContainer.appendChild(keyboardRow);
        });
        
        // Add legend
        const legend = document.createElement('div');
        legend.className = 'heatmap-legend';
        legend.innerHTML = `
            <div class="legend-item">
                <div class="legend-color" style="background-color: #ffeb3b;"></div>
                <span>Few Errors</span>
            </div>
            <div class="legend-item">
                <div class="legend-color" style="background-color: #ff9800;"></div>
                <span>Some Errors</span>
            </div>
            <div class="legend-item">
                <div class="legend-color" style="background-color: #f44336;"></div>
                <span>Many Errors</span>
            </div>
        `;
        
        heatmapContainer.appendChild(legend);
    }
    
    getHeatColor(intensity) {
        // Convert intensity (0-100) to a color from yellow to orange to red
        if (intensity < 33) {
            return '#ffeb3b'; // Yellow
        } else if (intensity < 66) {
            return '#ff9800'; // Orange
        } else {
            return '#f44336'; // Red
        }
    }
}

// Initialize heatmap generator
const heatmapGenerator = new HeatmapGenerator();
