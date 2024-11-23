// Global parameters for box sizing
const BOX_CONFIG = {
    width: 40,          // Width of the box in pixels
    height: 80,         // Height of the box in pixels
    buttonPadding: 4,   // Padding around buttons in pixels
    triangleSize: 6,     // Size of the triangle pointer in pixels
    expandedWidth: 350,  // New: width when expanded
    expandedHeight: 400,  // New: height when expanded
    controlsHeight: 40,  // Height for the controls section
    loadingSize: 30,    // Size of loading spinner
    fonts: {
        headline: {
            size: '1.2em',
            weight: 600
        },
        paragraph: {
            size: '12px',
            lineHeight: 1.6
        },
        bulletPoints: {
            size: '14px',
            lineHeight: 1.5
        }
    }
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
            const verticalCenter = updatedRect.top + (updatedRect.height / 2);
            
            // Calculate position to keep triangle centered during expansion
            const expandedTop = verticalCenter - (BOX_CONFIG.expandedHeight / 2);
            const collapsedTop = verticalCenter - (BOX_CONFIG.height / 2);
            
            // Use the appropriate top position based on box state
            const isExpanded = box.style.width === `${BOX_CONFIG.expandedWidth}px`;
            const topPosition = isExpanded ? expandedTop : collapsedTop;
            
            box.style.left = `${updatedRect.right + BOX_CONFIG.triangleSize + 5}px`;
            box.style.top = `${topPosition}px`;
        };

        // Initial box setup with transition properties
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
            transition: width 0.3s ease, height 0.3s ease, top 0.3s ease;
        `;

        updatePosition(); // Set initial position

        // When expanding the box
        const expandBox = () => {
            const rect = range.getBoundingClientRect();
            const verticalCenter = rect.top + (rect.height / 2);
            const expandedTop = verticalCenter - (BOX_CONFIG.expandedHeight / 2);
            
            box.style.width = `${BOX_CONFIG.expandedWidth}px`;
            box.style.height = `${BOX_CONFIG.expandedHeight}px`;
            box.style.top = `${expandedTop}px`;
        };

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
            const box = document.getElementById('selection-box');

            if (!selectionText || selectionText.trim().length === 0) {
                alert('No text selected!');
                return;
            }

            // Hide the buttons during summary generation
            button1.style.display = 'none';
            button2.style.display = 'none';

            const summaryContainer = document.createElement('div');
            summaryContainer.style.cssText = `
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;

            // Create text container first but don't add content yet
            const textContainer = document.createElement('div');
            textContainer.style.cssText = `
                padding: 20px 25px;
                overflow-y: auto;
                flex-grow: 1;
                margin-top: ${BOX_CONFIG.controlsHeight + 10}px;
                position: relative;
                min-height: 200px;
                background: #ffffff;
                border-radius: 0 0 4px 4px;
            `;

            async function updateSummary(length, type) {
                textContainer.innerHTML = '';
                const spinner = createLoadingSpinner();
                textContainer.appendChild(spinner);

                try {
                    const options = {
                        sharedContext: 'Summarizing selected text',
                        type: type,
                        format: 'plain-text',
                        length: length
                    };

                    const summarizer = await self.ai.summarizer.create(options);
                    const summary = await summarizer.summarize(selectionText, {
                        context: 'This is a user-selected text summary.'
                    });

                    textContainer.innerHTML = '';
                    
                    // Clean up the summary text by removing asterisks and extra whitespace
                    const cleanSummary = summary.replace(/\*/g, '').trim();
                    
                    const summaryContent = document.createElement('div');
                    summaryContent.style.cssText = `
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
                        color: #2c3e50;
                        line-height: ${BOX_CONFIG.fonts.paragraph.lineHeight};
                        font-size: ${BOX_CONFIG.fonts.paragraph.size};
                    `;

                    if (type === 'key-points') {
                        // Split by periods and clean each point
                        const points = cleanSummary.split('.')
                            .filter(point => point.trim().length > 0)
                            .map(point => point.trim());

                        summaryContent.innerHTML = points.map(point => 
                            `<p style="
                                margin: 8px 0;
                                padding-left: 20px;
                                position: relative;
                                font-size: ${BOX_CONFIG.fonts.bulletPoints.size};
                                line-height: ${BOX_CONFIG.fonts.bulletPoints.lineHeight};
                            ">
                                <span style="
                                    position: absolute;
                                    left: 0;
                                    content: '•';
                                ">•</span>
                                ${point}
                            </p>`
                        ).join('');
                    } else if (type === 'headline') {
                        summaryContent.innerHTML = `
                            <h3 style="
                                margin: 0 0 10px 0;
                                font-size: ${BOX_CONFIG.fonts.headline.size};
                                font-weight: ${BOX_CONFIG.fonts.headline.weight};
                                color: #1a1a1a;
                            ">${cleanSummary}</h3>`;
                    } else {
                        // For tl;dr and teaser
                        const paragraphs = cleanSummary.split('\n')
                            .filter(para => para.trim().length > 0)
                            .map(para => para.trim());

                        summaryContent.innerHTML = paragraphs.map(para =>
                            `<p style="
                                margin: 0 0 12px 0;
                                text-align: justify;
                                font-size: ${BOX_CONFIG.fonts.paragraph.size};
                                line-height: ${BOX_CONFIG.fonts.paragraph.lineHeight};
                            ">${para}</p>`
                        ).join('');
                    }

                    textContainer.appendChild(summaryContent);

                } catch (error) {
                    console.error('Error generating summary:', error);
                    textContainer.innerHTML = `
                        <div style="
                            color: #e74c3c;
                            text-align: center;
                            padding: 20px;
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
                        ">
                            Failed to generate summary. Please try again.
                        </div>`;
                }
            }

            // Create and add controls with fixed positioning
            const controls = createControlsUI(summaryContainer, updateSummary);
            controls.style.cssText += `
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                background: white;
                z-index: 1;
                border-top-left-radius: 4px;
                border-top-right-radius: 4px;
            `;

            // Add components to container
            summaryContainer.appendChild(controls);
            summaryContainer.appendChild(textContainer);
            box.appendChild(summaryContainer);

            // Animate box expansion
            box.style.width = `${BOX_CONFIG.expandedWidth}px`;
            box.style.height = `${BOX_CONFIG.expandedHeight}px`;
            box.style.top = `${rect.top + (rect.height / 2) - (BOX_CONFIG.expandedHeight / 2)}px`;
            
            // Initial summary generation
            setTimeout(() => {
                summaryContainer.style.opacity = '1';
                // Start with default options
                updateSummary('short', 'key-points');
            }, 300);

            // Add close button
            const closeButton = document.createElement('button');
            closeButton.innerHTML = '×';
            closeButton.style.cssText = `
                position: absolute;
                top: 8px;
                right: 8px;
                width: 24px;
                height: 24px;
                border: none;
                background: none;
                font-size: 20px;
                cursor: pointer;
                color: #666666;
                z-index: 2;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                &:hover {
                    background: #f0f0f0;
                }
            `;
            closeButton.onclick = () => {
                const rect = range.getBoundingClientRect();
                const verticalCenter = rect.top + (rect.height / 2);
                const collapsedTop = verticalCenter - (BOX_CONFIG.height / 2);

                box.style.width = `${BOX_CONFIG.width}px`;
                box.style.height = `${BOX_CONFIG.height}px`;
                box.style.top = `${collapsedTop}px`;
                
                summaryContainer.remove();
                closeButton.remove();
                button1.style.display = 'flex';
                button2.style.display = 'flex';
            };
            box.appendChild(closeButton);
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
                z-index: 2;
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
                z-index: 1;
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

// Add new function to create controls UI
function createControlsUI(summaryContainer, updateSummary) {
    const controlsDiv = document.createElement('div');
    controlsDiv.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        padding-right: 40px;
        border-bottom: 1px solid #eee;
        height: ${BOX_CONFIG.controlsHeight}px;
        background: white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    `;

    // Length controls with active state tracking
    const lengthControls = document.createElement('div');
    lengthControls.style.cssText = `
        display: flex;
        gap: 8px;
    `;

    ['short', 'medium', 'long'].forEach(length => {
        const button = document.createElement('button');
        button.textContent = length;
        button.dataset.length = length;
        button.style.cssText = `
            padding: 4px 12px;
            border-radius: 15px;
            border: 1px solid #ccc;
            background: ${length === 'short' ? '#333' : '#fff'};
            color: ${length === 'short' ? '#fff' : '#333'};
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s;
        `;
        
        // Add click handler to update summary
        button.onclick = () => {
            // Update button styles
            lengthControls.querySelectorAll('button').forEach(btn => {
                btn.style.background = '#fff';
                btn.style.color = '#333';
            });
            button.style.background = '#333';
            button.style.color = '#fff';
            
            // Generate new summary with selected options
            updateSummary(length, typeSelect.value);
        };
        lengthControls.appendChild(button);
    });

    // Type dropdown with change handler
    const typeSelect = document.createElement('select');
    typeSelect.style.cssText = `
        padding: 4px 8px;
        border-radius: 4px;
        border: 1px solid #ccc;
        background: #fff;
        cursor: pointer;
        font-size: 12px;
    `;
    
    ['key-points', 'tl;dr', 'teaser', 'headline'].forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ');
        typeSelect.appendChild(option);
    });

    // Add change handler to update summary
    typeSelect.onchange = () => {
        // Get currently selected length from active button
        const activeLength = lengthControls.querySelector('button[style*="background: rgb(51, 51, 51)"]').dataset.length;
        // Generate new summary with selected options
        updateSummary(activeLength, typeSelect.value);
    };

    controlsDiv.appendChild(lengthControls);
    controlsDiv.appendChild(typeSelect);
    return controlsDiv;
}

// Add loading spinner function
function createLoadingSpinner() {
    const spinnerContainer = document.createElement('div');
    spinnerContainer.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        justify-content: center;
        align-items: center;
    `;
    
    const spinner = document.createElement('div');
    spinner.style.cssText = `
        width: ${BOX_CONFIG.loadingSize}px;
        height: ${BOX_CONFIG.loadingSize}px;
        border: 3px solid #f3f3f3;
        border-top: 3px solid #333;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    `;
    
    spinnerContainer.appendChild(spinner);
    
    const keyframes = document.createElement('style');
    keyframes.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(keyframes);
    
    return spinnerContainer;
}