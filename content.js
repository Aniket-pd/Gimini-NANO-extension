// Global parameters for box sizing
const BOX_CONFIG = {
    width: 40,          // Width of the box in pixels
    height: 80,         // Height of the box in pixels
    buttonPadding: 4,   // Padding around buttons in pixels
    triangleSize: 6     // Size of the triangle pointer in pixels
};

// Listen for mouseup events to trigger the selection box
document.addEventListener('mouseup', async function (e) {
    const existingBox = document.getElementById('selection-box');
    if (existingBox && (existingBox.contains(e.target) || e.target.closest('#selection-box'))) {
        return;
    }

    if (existingBox) {
        existingBox.remove();
    }

    const selection = window.getSelection();
    if (selection.toString().length > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        const box = document.createElement('div');
        box.id = 'selection-box';

        // Function to update box position
        const updatePosition = () => {
            const updatedRect = range.getBoundingClientRect();
            box.style.left = `${updatedRect.right + BOX_CONFIG.triangleSize + 5}px`;
            box.style.top = `${updatedRect.top + (updatedRect.height / 2) - (BOX_CONFIG.height / 2)}px`;
        };

        box.style.cssText = `
            position: fixed;
            width: ${BOX_CONFIG.width}px;
            height: ${BOX_CONFIG.height}px;
            background-color: #ffffff;
            border: 1px solid #cccccc;
            border-radius: 4px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            z-index: 1000;
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            align-items: center;
            padding: ${BOX_CONFIG.buttonPadding}px;
        `;

        updatePosition(); // Set initial position

        // Add scroll event listener
        window.addEventListener('scroll', updatePosition);

        // Create buttons with icons
        const button1 = document.createElement('button');
        const button2 = document.createElement('button');

        // Define SVG icons
        const summaryIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 20h9"></path><path d="M16.5 3.5l-4.5 9 4.5 3.5"></path>
        </svg>`;
        const shareIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
        </svg>`;

        [button1, button2].forEach(button => {
            button.style.cssText = `
                width: 100%;
                height: calc((${BOX_CONFIG.height}px - ${BOX_CONFIG.buttonPadding * 3}px) / 2);
                border: 1px solid #cccccc;
                border-radius: 3px;
                background-color: #f8f8f8;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                transition: background-color 0.2s;
                color: #666666;
            `;
            button.onmouseover = () => {
                button.style.backgroundColor = '#eeeeee';
                button.style.color = '#333333';
            };
            button.onmouseout = () => {
                button.style.backgroundColor = '#f8f8f8';
                button.style.color = '#666666';
            };
        });

        // Set icons for buttons
        button1.innerHTML = summaryIcon;
        button2.innerHTML = shareIcon;

        // Add click handlers
        button1.onclick = async () => {
            const selectionText = window.getSelection().toString();

            if (!selectionText || selectionText.trim().length === 0) {
                alert('No text selected!');
                return;
            }

            // Check if Summarizer API is available
            const capabilities = await self.ai.summarizer.capabilities();
            if (capabilities.available === 'no') {
                alert('Summarizer API is not available in this browser.');
                return;
            }

            // Create Summarizer Object
            const options = {
                sharedContext: 'Summarizing selected text',
                type: 'key-points', // Choose a summary type (e.g., 'key-points', 'tl;dr', etc.)
                format: 'plain-text', // Use plain-text format
                length: 'short' // Use short summary length
            };

            let summarizer;
            if (capabilities.available === 'readily') {
                summarizer = await self.ai.summarizer.create(options);
            } else if (capabilities.available === 'after-download') {
                summarizer = await self.ai.summarizer.create(options);
                summarizer.addEventListener('downloadprogress', (e) => {
                    console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
                });
                await summarizer.ready; // Wait for the model to finish downloading
            }

            try {
                // Generate Summary
                const summary = await summarizer.summarize(selectionText, {
                    context: 'This is a user-selected text summary.'
                });
                alert(`Summary: ${summary}`); // Display the summary
            } catch (error) {
                console.error('Error generating summary:', error);
                alert('Failed to generate summary. Please try again.');
            }
        };

        button2.onclick = () => {
            alert('Share functionality coming soon!');
            console.log('Share button clicked');
        };

        // Add CSS for the triangle
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            #selection-box::before {
                content: '';
                position: absolute;
                left: -${BOX_CONFIG.triangleSize}px;
                top: 50%;
                transform: translateY(-50%);
                width: 0;
                height: 0;
                border-top: ${BOX_CONFIG.triangleSize}px solid transparent;
                border-bottom: ${BOX_CONFIG.triangleSize}px solid transparent;
                border-right: ${BOX_CONFIG.triangleSize}px solid #ffffff;
            }
            #selection-box::after {
                content: '';
                position: absolute;
                left: -${BOX_CONFIG.triangleSize + 1}px;
                top: 50%;
                transform: translateY(-50%);
                width: 0;
                height: 0;
                border-top: ${BOX_CONFIG.triangleSize}px solid transparent;
                border-bottom: ${BOX_CONFIG.triangleSize}px solid transparent;
                border-right: ${BOX_CONFIG.triangleSize}px solid #cccccc;
                z-index: -1;
            }
        `;
        document.head.appendChild(styleSheet);

        // Add buttons to the box
        box.appendChild(button1);
        box.appendChild(button2);

        // Add the box to the document
        document.body.appendChild(box);

        // Remove scroll listener when box is removed
        const removeBox = () => {
            window.removeEventListener('scroll', updatePosition);
            box.remove();
        };

        // Remove box on mousedown outside or when selection changes
        document.addEventListener('mousedown', function (e) {
            const box = document.getElementById('selection-box');
            if (box && !box.contains(e.target)) {
                removeBox();
            }
        });
        document.addEventListener('selectionchange', function () {
            const box = document.getElementById('selection-box');
            if (box && window.getSelection().toString().length === 0) {
                removeBox();
            }
        });
    }
});
