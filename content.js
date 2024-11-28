// Global parameters for box sizing
const BOX_CONFIG = {
    width: 80,          // Width of the box in pixels
    height: 40,         // Height of the box in pixels
    buttonPadding: 4,   // Padding around buttons in pixels
    triangleSize: 6,     // Size of the triangle pointer in pixels
    expandedWidth: 375,  // New: width when expanded
    expandedHeight: 425,  // New: height when expanded
    controlsHeight: 40,  // Height for the controls section
    loadingSize: 30,    // Size of loading spinner
    welcomeMessage: {
        gradientColors: {
            primary: '#FF9A9E',
            secondary: '#FECFEF'
        },
        animationDuration: '6s',  // Slower animation (in seconds)
        typingSpeed: 80,          // Typing speed (in milliseconds)
        fontSize: '2.2em',        // Font size control
        fontWeight: 100          // Add font weight control (400=normal, 500=medium, 600=semibold, 700=bold)
    },
    colors: {
        background: 'rgba(34, 34, 34, 0.7)',
        border: 'rgba(255, 255, 255, 0.1)',
        text: {
            primary: '#ffffff',
            secondary: '#a0a0a0',
            generated: {
                heading: '#e2e8f0',
                paragraph: '#cbd5e1',
                bullet: '#94a3b8',
                prompt: '#9ca3af',
                response: '#d1d5db',
                highlight: '#60a5fa',
                error: '#ef4444'
            }
        },
        button: {
            background: 'rgba(255, 255, 255, 0.1)',
            hover: 'rgba(255, 255, 255, 0.2)',
            text: '#ffffff'
        }
    },
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
    },
    blur: {
        backdrop: 12,          // Backdrop blur intensity (px)
        border: 1,           // Border glow blur intensity (px)
        overlayGradient: 2,  // Blur for gradient overlays (px)
        shadowSpread: 32,    // Shadow blur spread (px)
    },
    glow: {
        intensity: {
            border: '0.6',      // Border glow opacity (0-1)
            shadow: '0.3',      // Shadow glow opacity (0-1)
            highlight: '0.9'    // Highlight glow opacity (0-1)
        },
        colors: {
            primary: '#FF9A9E',
            secondary: '#FECFEF'
        },
        animation: {
            duration: '2s',
            timing: 'linear'
        }
    },
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
    const selectionText = selection.toString().trim();
    if (selectionText.length > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        const box = document.createElement('div');
        box.id = 'selection-box';
        box.dataset.selectedText = selectionText;

        // Function to update box position
        const updatePosition = () => {
            const updatedRect = range.getBoundingClientRect();
            const horizontalCenter = updatedRect.left + (updatedRect.width / 2);
            const isExpanded = box.style.width === `${BOX_CONFIG.expandedWidth}px`;
            const boxWidth = isExpanded ? BOX_CONFIG.expandedWidth : BOX_CONFIG.width;
            
            box.style.transition = 'none';
            box.style.left = `${horizontalCenter - (boxWidth / 2)}px`;
            box.style.top = `${updatedRect.bottom + BOX_CONFIG.triangleSize + 5}px`;
            
            box.offsetHeight;
            box.style.transition = 'width 0.3s ease, height 0.3s ease, left 0.3s ease';
        };

        // Initial box setup
        box.style.cssText = `
            position: fixed;
            width: ${BOX_CONFIG.width}px;
            height: ${BOX_CONFIG.height}px;
            background: ${BOX_CONFIG.colors.background};
            border: 1px solid ${BOX_CONFIG.colors.border};
            border-radius: 12px;
            box-shadow: 0 8px ${BOX_CONFIG.blur.shadowSpread}px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(${BOX_CONFIG.blur.backdrop}px);
            -webkit-backdrop-filter: blur(${BOX_CONFIG.blur.backdrop}px);
            z-index: 1000;
            display: flex;
            flex-direction: row;
            justify-content: space-evenly;
            align-items: center;
            padding: ${BOX_CONFIG.buttonPadding}px;
        `;

        updatePosition(); // Set initial position

        // When expanding the box
        const expandBox = () => {
            const rect = range.getBoundingClientRect();
            const horizontalCenter = rect.left + (rect.width / 2);
            const expandedLeft = horizontalCenter - (BOX_CONFIG.expandedWidth / 2);
            
            box.style.width = `${BOX_CONFIG.expandedWidth}px`;
            box.style.height = `${BOX_CONFIG.expandedHeight}px`;
            box.style.left = `${expandedLeft}px`;
        };

        // Add scroll event listener
        window.addEventListener('scroll', updatePosition);

        // Create buttons with icons
        const button1 = document.createElement('button');
        const button2 = document.createElement('button');

        // Define SVG icons
        const summaryIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 6h16M4 12h16M4 18h7"></path>
        </svg>`;
        const shareIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
        </svg>`;

        [button1, button2].forEach(button => {
            button.style.cssText = `
                width: calc((${BOX_CONFIG.width}px - ${BOX_CONFIG.buttonPadding * 3}px) / 2);
                height: calc(${BOX_CONFIG.height}px - ${BOX_CONFIG.buttonPadding * 2}px);
                border: 1px solid ${BOX_CONFIG.colors.border};
                border-radius: 8px;
                background: ${BOX_CONFIG.colors.button.background};
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0;
                transition: all 0.2s ease;
                color: ${BOX_CONFIG.colors.button.text};
            `;
            button.onmouseover = () => {
                button.style.background = BOX_CONFIG.colors.button.hover;
                button.style.transform = 'translateY(-2px)';
            };
            button.onmouseout = () => {
                button.style.background = BOX_CONFIG.colors.button.background;
                button.style.transform = 'translateY(0)';
            };
        });

        // Set icons for buttons
        button1.innerHTML = summaryIcon;
        button2.innerHTML = shareIcon;

        // Add click handlers
        button1.onclick = async () => {
            const box = document.getElementById('selection-box');
            const selectionText = box.dataset.selectedText;

            if (!selectionText) {
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
                background: transparent;
                color: ${BOX_CONFIG.colors.text.primary};
                border-radius: 0 0 12px 12px;

                /* Scrollbar styling */
                &::-webkit-scrollbar {
                    width: 8px;
                }
                &::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 4px;
                }
                &::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 4px;
                    &:hover {
                        background: rgba(255, 255, 255, 0.3);
                    }
                }
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
                        opacity: 0;
                        transform: translateY(10px);
                        transition: opacity 0.5s ease, transform 0.5s ease;
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
                                color: ${BOX_CONFIG.colors.text.generated.bullet};
                                opacity: 0;
                                transform: translateY(10px);
                                transition: opacity 0.3s ease, transform 0.3s ease;
                            ">
                                <span style="
                                    position: absolute;
                                    left: 0;
                                    content: '•';
                                    color: ${BOX_CONFIG.colors.text.generated.highlight};
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
                                color: ${BOX_CONFIG.colors.text.generated.heading};
                                opacity: 0;
                                transform: translateY(10px);
                                transition: opacity 0.3s ease, transform 0.3s ease;
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
                                color: ${BOX_CONFIG.colors.text.generated.paragraph};
                                opacity: 0;
                                transform: translateY(10px);
                                transition: opacity 0.3s ease, transform 0.3s ease;
                            ">${para}</p>`
                        ).join('');
                    }

                    textContainer.appendChild(summaryContent);

                    // Trigger the animation after a brief delay
                    requestAnimationFrame(() => {
                        summaryContent.style.opacity = '1';
                        summaryContent.style.transform = 'translateY(0)';
                        
                        // Animate each paragraph/point with a stagger effect
                        const elements = summaryContent.children;
                        Array.from(elements).forEach((element, index) => {
                            setTimeout(() => {
                                element.style.opacity = '1';
                                element.style.transform = 'translateY(0)';
                            }, index * 100); // 100ms delay between each element
                        });
                    });

                } catch (error) {
                    console.error('Error generating summary:', error);
                    textContainer.innerHTML = `
                        <div style="
                            color: ${BOX_CONFIG.colors.text.generated.error};
                            text-align: center;
                            padding: 20px;
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
                            opacity: 0;
                            transform: translateY(10px);
                            transition: opacity 0.3s ease, transform 0.3s ease;
                        ">
                            Failed to generate summary. Please try again.
                        </div>`;
                    
                    // Animate error message
                    requestAnimationFrame(() => {
                        textContainer.children[0].style.opacity = '1';
                        textContainer.children[0].style.transform = 'translateY(0)';
                    });
                }
            }

            // Create and add controls with fixed positioning
            const controls = createControlsUI(summaryContainer, updateSummary);
            controls.style.cssText += `
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                background: ${BOX_CONFIG.colors.background};
                z-index: 1;
                border-top-left-radius: 12px;
                border-top-right-radius: 12px;
            `;

            // Add components to container
            summaryContainer.appendChild(controls);
            summaryContainer.appendChild(textContainer);
            box.appendChild(summaryContainer);

            // Animate box expansion
            const rect = range.getBoundingClientRect();
            const horizontalCenter = rect.left + (rect.width / 2);
            
            box.style.width = `${BOX_CONFIG.expandedWidth}px`;
            box.style.height = `${BOX_CONFIG.expandedHeight}px`;
            box.style.left = `${horizontalCenter - (BOX_CONFIG.expandedWidth / 2)}px`;
            
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
                right: 12px;
                width: 20px;
                height: 20px;
                border: none;
                background: transparent;
                font-size: 18px;
                line-height: 1;
                cursor: pointer;
                color: ${BOX_CONFIG.colors.text.primary};
                z-index: 20;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
                opacity: 0.6;
                padding: 0;
                &:hover {
                    opacity: 1;
                    transform: rotate(90deg);
                }
            `;
            closeButton.onclick = () => {
                const rect = range.getBoundingClientRect();
                const horizontalCenter = rect.left + (rect.width / 2);
                const collapsedLeft = horizontalCenter - (BOX_CONFIG.width / 2);

                box.style.width = `${BOX_CONFIG.width}px`;
                box.style.height = `${BOX_CONFIG.height}px`;
                box.style.left = `${collapsedLeft}px`;
                
                summaryContainer.remove();
                closeButton.remove();
                button1.style.display = 'flex';
                button2.style.display = 'flex';
            };
            box.appendChild(closeButton);
        };

        button2.onclick = async () => {
            const box = document.getElementById('selection-box');
            const selectionText = box.dataset.selectedText;

            if (!selectionText) {
                alert('No text selected!');
                return;
            }

            // Hide the buttons during prompt interaction
            button1.style.display = 'none';
            button2.style.display = 'none';

            // Create container for prompt UI
            const promptContainer = document.createElement('div');
            promptContainer.style.cssText = `
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                opacity: 0;
                transition: opacity 0.3s ease;
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                border: 1px solid transparent;
                animation: borderLight 2s linear forwards;
                border-radius: 12px;
                overflow: hidden;
                background: transparent;
            `;

            // Add the animation styles
            if (!document.querySelector('#borderLightAnimation')) {
                const styleSheet = document.createElement('style');
                styleSheet.id = 'borderLightAnimation';
                styleSheet.textContent = `
                    @keyframes borderLight {
                        0% {
                            border-image-source: radial-gradient(
                                circle at 0% 50%,
                                transparent 0%,
                                transparent 25%,
                                ${BOX_CONFIG.glow.colors.primary}${Math.floor(BOX_CONFIG.glow.intensity.border * 255).toString(16)} 50%,
                                ${BOX_CONFIG.glow.colors.secondary}${Math.floor(BOX_CONFIG.glow.intensity.border * 255).toString(16)} 75%,
                                transparent 100%
                            );
                            box-shadow: 0 0 15px ${BOX_CONFIG.glow.colors.primary}${Math.floor(BOX_CONFIG.glow.intensity.shadow * 255).toString(16)};
                        }
                        25% {
                            border-image-source: radial-gradient(
                                circle at 50% 100%,
                                transparent 0%,
                                transparent 25%,
                                ${BOX_CONFIG.glow.colors.primary}${Math.floor(BOX_CONFIG.glow.intensity.border * 255).toString(16)} 50%,
                                ${BOX_CONFIG.glow.colors.secondary}${Math.floor(BOX_CONFIG.glow.intensity.border * 255).toString(16)} 75%,
                                transparent 100%
                            );
                            box-shadow: 0 0 15px ${BOX_CONFIG.glow.colors.secondary}${Math.floor(BOX_CONFIG.glow.intensity.shadow * 255).toString(16)};
                        }
                        50% {
                            border-image-source: radial-gradient(
                                circle at 100% 50%,
                                transparent 0%,
                                transparent 25%,
                                ${BOX_CONFIG.glow.colors.primary}${Math.floor(BOX_CONFIG.glow.intensity.border * 255).toString(16)} 50%,
                                ${BOX_CONFIG.glow.colors.secondary}${Math.floor(BOX_CONFIG.glow.intensity.border * 255).toString(16)} 75%,
                                transparent 100%
                            );
                            box-shadow: 0 0 15px ${BOX_CONFIG.glow.colors.primary}${Math.floor(BOX_CONFIG.glow.intensity.shadow * 255).toString(16)};
                        }
                        75% {
                            border-image-source: radial-gradient(
                                circle at 50% 0%,
                                transparent 0%,
                                transparent 25%,
                                ${BOX_CONFIG.glow.colors.primary}${Math.floor(BOX_CONFIG.glow.intensity.border * 255).toString(16)} 50%,
                                ${BOX_CONFIG.glow.colors.secondary}${Math.floor(BOX_CONFIG.glow.intensity.border * 255).toString(16)} 75%,
                                transparent 100%
                            );
                            box-shadow: 0 0 15px ${BOX_CONFIG.glow.colors.secondary}${Math.floor(BOX_CONFIG.glow.intensity.shadow * 255).toString(16)};
                        }
                        100% {
                            border-image-source: radial-gradient(
                                circle at 0% 50%,
                                transparent 100%,
                                transparent 100%,
                                transparent 100%,
                                transparent 100%,
                                transparent 100%
                            );
                            box-shadow: none;
                        }
                    }

                    .prompt-container::before {
                        content: '';
                        position: absolute;
                        top: -1px;
                        left: -1px;
                        right: -1px;
                        bottom: -1px;
                        border: 1px solid transparent;
                        border-radius: 12px;
                        pointer-events: none;
                        animation: borderLight ${BOX_CONFIG.glow.animation.duration} ${BOX_CONFIG.glow.animation.timing} forwards;
                        filter: blur(${BOX_CONFIG.blur.border}px);
                    }
                `;
                document.head.appendChild(styleSheet);
            }

            // Add the class to the promptContainer
            promptContainer.classList.add('prompt-container');

            // Modify header section styles
            const headerSection = document.createElement('div');
            headerSection.style.cssText = `
                position: sticky;
                top: 0;
                left: 0;
                right: 0;
                height: 40px;
                display: flex;
                align-items: center;
                padding: 0 15px;
                z-index: 10;
                border-radius: 12px 12px 0 0;
                border-bottom: 1px solid ${BOX_CONFIG.colors.border};
            `;

            // Add title to header
            const headerTitle = document.createElement('div');
            headerTitle.textContent = 'Chat';
            headerTitle.style.cssText = `
                color: ${BOX_CONFIG.colors.text.primary};
                font-size: 14px;
                font-weight: 500;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            `;

            headerSection.appendChild(headerTitle);

            // Modify responseArea styles to work with header
            const responseArea = document.createElement('div');
            responseArea.style.cssText = `
                padding: 20px 25px;
                padding-bottom: 80px;
                overflow-y: auto;
                flex-grow: 1;
                background: transparent;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
                font-size: ${BOX_CONFIG.fonts.paragraph.size};
                line-height: ${BOX_CONFIG.fonts.paragraph.lineHeight};
                color: ${BOX_CONFIG.colors.text.primary};
                margin-top: 0;
                height: calc(100% - 70px);
                position: relative;
                z-index: 1;
                margin-bottom: 60px;
                mask-image: linear-gradient(to bottom, black calc(100% - 100px), transparent 100%);
                -webkit-mask-image: linear-gradient(to bottom, black calc(100% - 100px), transparent 100%);
            `;

            // Add initial welcome message with typing animation
            const welcomeMessage = document.createElement('div');
            welcomeMessage.style.cssText = `
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100%;
                color: #2c3e50;
                font-size: ${BOX_CONFIG.welcomeMessage.fontSize};
                font-weight: ${BOX_CONFIG.welcomeMessage.fontWeight};
                font-family: 'Playfair Display', serif;
            `;

            // Create the typing animation container
            const typingContainer = document.createElement('div');
            typingContainer.style.cssText = `
                position: relative;
                letter-spacing: 0.5px;
                background: linear-gradient(270deg, 
                    ${BOX_CONFIG.welcomeMessage.gradientColors.primary},
                    ${BOX_CONFIG.welcomeMessage.gradientColors.secondary},
                    ${BOX_CONFIG.welcomeMessage.gradientColors.primary}
                );
                background-size: 200% 100%;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                font-weight: ${BOX_CONFIG.welcomeMessage.fontWeight};
                font-family: 'Playfair Display', serif;
                &::after {
                    content: '|';
                    position: absolute;
                    right: -4px;
                    top: -2px;
                    color: ${BOX_CONFIG.welcomeMessage.gradientColors.secondary};
                    -webkit-text-fill-color: ${BOX_CONFIG.welcomeMessage.gradientColors.secondary};
                    animation: blink 1s infinite;
                }
            `;

            // Add typing animation styles with modern fade effect
            const styleSheet = document.createElement('style');
            styleSheet.textContent = `
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
                
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }

                @keyframes gradientText {
                    0% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                    100% {
                        background-position: 0% 50%;
                    }
                }

                .typing-text {
                    background: linear-gradient(270deg, 
                        ${BOX_CONFIG.welcomeMessage.gradientColors.primary},
                        ${BOX_CONFIG.welcomeMessage.gradientColors.secondary},
                        ${BOX_CONFIG.welcomeMessage.gradientColors.primary}
                    );
                    background-size: 200% 100%;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    animation: gradientText ${BOX_CONFIG.welcomeMessage.animationDuration} ease infinite;
                    font-weight: ${BOX_CONFIG.welcomeMessage.fontWeight};
                    font-family: 'Playfair Display', serif;
                }
            `;
            document.head.appendChild(styleSheet);

            // Function to simulate typing with modern timing
            const typeText = async (text, element, speed = BOX_CONFIG.welcomeMessage.typingSpeed) => {
                element.classList.add('typing-text');
                
                // Split the text into styled and unstyled parts
                const italicPart = "hey,";
                const regularPart = " there!";
                
                // Create span for italic part
                const italicSpan = document.createElement('span');
                italicSpan.style.fontStyle = 'italic';
                
                // Type the italic part
                for (let i = 0; i < italicPart.length; i++) {
                    italicSpan.textContent += italicPart[i];
                    element.appendChild(italicSpan);
                    const variance = Math.random() * 50 - 25; // ±25ms variance
                    await new Promise(resolve => setTimeout(resolve, speed + variance));
                }
                
                // Type the regular part
                for (let i = 0; i < regularPart.length; i++) {
                    element.appendChild(document.createTextNode(regularPart[i]));
                    const variance = Math.random() * 50 - 25; // ±25ms variance
                    await new Promise(resolve => setTimeout(resolve, speed + variance));
                }
            };

            welcomeMessage.appendChild(typingContainer);
            responseArea.appendChild(welcomeMessage);

            // Start typing animation after the window appears
            setTimeout(() => {
                typeText("hey, there!", typingContainer);
            }, 500);

            // Add a blur gradient overlay above the input container
            const blurOverlay = document.createElement('div');
            blurOverlay.style.cssText = `
                position: absolute;
                bottom: 60px; // Adjust based on your input container height
                left: 0;
                right: 0;
                height: 40px; // Height of blur gradient
                background: linear-gradient(
                    to bottom,
                    transparent,
                    ${BOX_CONFIG.colors.background} 90%
                );
                pointer-events: none; // Allow clicking through the overlay
                z-index: 5;
                filter: blur(${BOX_CONFIG.blur.overlayGradient}px);
            `;

            // Update form to include the blur overlay
            const form = document.createElement('form');
            form.style.cssText = `
                padding: 15px;
                border-top: 1px solid ${BOX_CONFIG.colors.border};
                display: flex;
                gap: 10px;
                background: transparent;
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                width: 100%;
                box-sizing: border-box;
                z-index: 10;
                backdrop-filter: none;
                -webkit-backdrop-filter: none;
            `;

            // Add the blur overlay before the form
            promptContainer.appendChild(blurOverlay);
            promptContainer.appendChild(form);

            // Add components to form
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = 'Ask Snip !';
            input.style.cssText = `
                flex-grow: 1;
                padding: 8px 35px 8px 12px;
                background: transparent;
                border: none;
                border-radius: 20px;
                font-size: 14px;
                color: ${BOX_CONFIG.colors.text.primary};
                backdrop-filter: none;
                -webkit-backdrop-filter: none;
                transition: all 0.2s ease;
                width: 100%;
                outline: none;
                &::placeholder {
                    color: rgba(255, 255, 255, 0.5);
                }
                &:focus {
                    outline: none;
                    background: transparent;
                }
            `;

            const sendButton = document.createElement('button');
            sendButton.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
            `;
            sendButton.style.cssText = `
                position: absolute;
                right: 25px;
                background: transparent;
                border: none;
                padding: 8px;
                cursor: pointer;
                color: ${BOX_CONFIG.colors.text.primary};
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
                &:hover {
                    transform: translateX(2px);
                }
            `;

            // Handle send button click
            const handleSend = async () => {
                const prompt = input.value.trim();
                if (!prompt) return;

                // Show loading spinner
                responseArea.innerHTML = '';
                const spinner = createLoadingSpinner();
                responseArea.appendChild(spinner);

                try {
                    const {available, defaultTemperature, defaultTopK} = 
                        await self.ai.languageModel.capabilities();

                    if (available === 'no') {
                        throw new Error('AI model is not available on this device');
                    }

                    // Create AI session
                    const session = await self.ai.languageModel.create({
                        systemPrompt: 'You are a helpful assistant analyzing the following text: ' + selectionText,
                        temperature: defaultTemperature,
                        topK: defaultTopK
                    });

                    const stream = session.promptStreaming(prompt);
                    
                    // Clear spinner and prepare for response
                    responseArea.innerHTML = '';
                    let result = '';
                    let previousChunk = '';

                    // Create a styled response container
                    const responseContainer = document.createElement('div');
                    responseContainer.style.cssText = `
                        padding: 15px;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
                        color: #2c3e50;
                        line-height: 1.6;
                    `;

                    // Create elements for prompt and response
                    const promptElement = document.createElement('div');
                    promptElement.style.cssText = `
                        margin-bottom: 12px;
                        padding-bottom: 8px;
                        border-bottom: 1px solid ${BOX_CONFIG.colors.border};
                        font-weight: 500;
                        color: ${BOX_CONFIG.colors.text.generated.prompt};
                        font-size: 0.9em;
                        opacity: 0;
                        transform: translateY(10px);
                        animation: fadeIn 0.3s ease forwards;
                    `;
                    promptElement.textContent = `Q: ${prompt}`;

                    const responseElement = document.createElement('div');
                    responseElement.style.cssText = `
                        white-space: pre-wrap;
                        font-size: 14px;
                        color: ${BOX_CONFIG.colors.text.generated.response};
                    `;

                    // Add elements to container
                    responseContainer.appendChild(promptElement);
                    responseContainer.appendChild(responseElement);
                    responseArea.appendChild(responseContainer);

                    // Handle streaming response with better formatting
                    let previousContent = '';
                    const responseContent = document.createElement('div');
                    responseElement.appendChild(responseContent);

                    for await (const chunk of stream) {
                        const newChunk = chunk.startsWith(previousContent)
                            ? chunk.slice(previousContent.length)
                            : chunk;
                        
                        if (newChunk) {
                            // Process all formatting first
                            let formattedChunk = newChunk;
                            
                            // Create a temporary div to process markdown-style formatting
                            const tempDiv = document.createElement('div');
                            tempDiv.textContent = formattedChunk;
                            
                            // Process in specific order to avoid conflicts
                            formattedChunk = tempDiv.textContent
                                // Process code blocks first (to avoid conflicts with other formatting)
                                .replace(/`([^`]+)`/g, '<code class="ai-code">$1</code>')
                                // Process bold before italic
                                .replace(/\*\*([^*]+)\*\*/g, '<strong class="ai-bold">$1</strong>')
                                // Process italic
                                .replace(/\*([^*]+)\*/g, '<em class="ai-italic">$1</em>')
                                // Process bullet points last
                                .replace(/^- (.+)$/gm, '<div class="ai-bullet"><span class="ai-bullet-point">•</span><span class="ai-bullet-text">$1</span></div>')
                                // Clean up any remaining special characters
                                .replace(/\*/g, '');

                            // Create the chunk element with pre-applied styles
                            const chunkElement = document.createElement('span');
                            chunkElement.className = 'ai-chunk';
                            
                            // Add the formatting styles if not already present
                            if (!document.querySelector('#aiFormatStyles')) {
                                const formatStyles = document.createElement('style');
                                formatStyles.id = 'aiFormatStyles';
                                formatStyles.textContent = `
                                    .ai-chunk {
                                        opacity: 0;
                                        transform: translateY(5px);
                                        animation: fadeIn 0.3s ease forwards;
                                        display: inline;
                                        line-height: 1.6;
                                        color: ${BOX_CONFIG.colors.text.generated.response};
                                    }
                                    .ai-code {
                                        background: rgba(255,255,255,0.1);
                                        padding: 2px 4px;
                                        border-radius: 3px;
                                        font-family: monospace;
                                        font-size: 0.9em;
                                    }
                                    .ai-bold {
                                        color: ${BOX_CONFIG.colors.text.generated.heading};
                                        font-weight: 600;
                                        font-size: 1.0em;
                                    }
                                    .ai-italic {
                                        font-style: italic;
                                    }
                                    .ai-bullet {
                                        display: flex;
                                        align-items: baseline;
                                        gap: 8px;
                                        margin: 4px 0;
                                    }
                                    .ai-bullet-point {
                                        color: ${BOX_CONFIG.colors.text.generated.highlight};
                                    }
                                    .ai-bullet-text {
                                        flex: 1;
                                    }
                                    @keyframes fadeIn {
                                        from {
                                            opacity: 0;
                                            transform: translateY(5px);
                                        }
                                        to {
                                            opacity: 1;
                                            transform: translateY(0);
                                        }
                                    }
                                `;
                                document.head.appendChild(formatStyles);
                            }

                            // Set the formatted content
                            chunkElement.innerHTML = formattedChunk;
                            
                            // Ensure the response container has the necessary class
                            if (!responseContent.classList.contains('ai-response')) {
                                responseContent.classList.add('ai-response');
                            }

                            // Add the fully formatted chunk to the response
                            responseContent.appendChild(chunkElement);
                        }

                        previousContent = chunk;
                    }

                    // Clean up
                    session.destroy();
                    input.value = '';

                } catch (error) {
                    console.error('Error generating response:', error);
                    responseArea.innerHTML = `
                        <div style="color: #e74c3c; padding: 20px;">
                            Error: ${error.message}
                        </div>
                    `;
                }
            };

            sendButton.onclick = handleSend;

            // Handle enter key in input
            input.onkeydown = (e) => {
                e.stopPropagation();
                if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSend();
                }
            };

            // Add components to form
            form.appendChild(input);
            form.appendChild(sendButton);
            
            // Update the component assembly order
            promptContainer.appendChild(headerSection);
            promptContainer.appendChild(responseArea);
            promptContainer.appendChild(form);
            
            // Add the container to the box
            box.appendChild(promptContainer);

            // Animate box expansion
            expandBox();
            
            // Show container after animation
            setTimeout(() => {
                promptContainer.style.opacity = '1';
                // Focus the input after animation
                input.focus();
            }, 300);

            // Add close button
            const closeButton = document.createElement('button');
            closeButton.innerHTML = '×';
            closeButton.style.cssText = `
                position: absolute;
                top: 8px;
                right: 12px;
                width: 20px;
                height: 20px;
                border: none;
                background: transparent;
                font-size: 18px;
                line-height: 1;
                cursor: pointer;
                color: ${BOX_CONFIG.colors.text.primary};
                z-index: 20;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
                opacity: 0.6;
                padding: 0;
                &:hover {
                    opacity: 1;
                    transform: rotate(90deg);
                }
            `;

            closeButton.onclick = () => {
                const rect = range.getBoundingClientRect();
                const horizontalCenter = rect.left + (rect.width / 2);
                const collapsedLeft = horizontalCenter - (BOX_CONFIG.width / 2);

                box.style.width = `${BOX_CONFIG.width}px`;
                box.style.height = `${BOX_CONFIG.height}px`;
                box.style.left = `${collapsedLeft}px`;
                
                promptContainer.remove();
                closeButton.remove();
                button1.style.display = 'flex';
                button2.style.display = 'flex';
            };

            box.appendChild(closeButton);

            // Prevent box from disappearing when clicking inside
            box.addEventListener('mousedown', (e) => {
                e.stopPropagation();
            }, true);

            // Prevent text selection from triggering box removal when typing
            box.addEventListener('selectstart', (e) => {
                e.stopPropagation();
            }, true);

            // Add smooth transition for the container
            promptContainer.style.cssText += `
                background: transparent;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                border-radius: 8px;
                transition: all 0.3s ease;
            `;

            // Add this to the styleSheet creation in the button2.onclick handler
            // (where we already have the fadeIn animation)
            if (!document.querySelector('#shineAnimation')) {
                const styleSheet = document.createElement('style');
                styleSheet.id = 'shineAnimation';
                styleSheet.textContent = `
                    @keyframes noisyShine {
                        0% {
                            border-image: linear-gradient(
                                45deg,
                                rgba(255, 255, 255, 0.1) 0%,
                                rgba(255, 154, 158, 0.2) 25%,
                                rgba(254, 207, 239, 0.2) 50%,
                                rgba(255, 154, 158, 0.2) 75%,
                                rgba(255, 255, 255, 0.1) 100%
                            ) 1;
                            filter: url('#noise');
                        }
                        50% {
                            border-image: linear-gradient(
                                45deg,
                                rgba(255, 255, 255, 0.1) 100%,
                                rgba(255, 154, 158, 0.2) 0%,
                                rgba(254, 207, 239, 0.2) 25%,
                                rgba(255, 154, 158, 0.2) 50%,
                                rgba(255, 255, 255, 0.1) 75%
                            ) 1;
                            filter: url('#noise');
                        }
                        100% {
                            border-image: linear-gradient(
                                45deg,
                                rgba(255, 255, 255, 0.1) 0%,
                                rgba(255, 154, 158, 0.2) 25%,
                                rgba(254, 207, 239, 0.2) 50%,
                                rgba(255, 154, 158, 0.2) 75%,
                                rgba(255, 255, 255, 0.1) 100%
                            ) 1;
                            filter: url('#noise');
                        }
                    }

                    /* Add SVG noise filter */
                    <svg style="display: none;">
                        <filter id="noise">
                            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/>
                            <feDisplacementMap in="SourceGraphic" scale="2"/>
                        </filter>
                    }
                `;
                document.head.appendChild(styleSheet);
            }
        };

        // Add CSS for the triangle
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            #selection-box::before {
                content: '';
                position: absolute;
                left: 50%;
                top: -${BOX_CONFIG.triangleSize}px;
                transform: translateX(-50%);
                width: 0;
                height: 0;
                border-left: ${BOX_CONFIG.triangleSize}px solid transparent;
                border-right: ${BOX_CONFIG.triangleSize}px solid transparent;
                border-bottom: ${BOX_CONFIG.triangleSize}px solid rgba(23, 25, 35, 0.85);
                z-index: 2;
            }
            #selection-box::after {
                content: '';
                position: absolute;
                left: 50%;
                top: -${BOX_CONFIG.triangleSize + 1}px;
                transform: translateX(-50%);
                width: 0;
                height: 0;
                border-left: ${BOX_CONFIG.triangleSize}px solid transparent;
                border-right: ${BOX_CONFIG.triangleSize}px solid transparent;
                border-bottom: ${BOX_CONFIG.triangleSize}px solid rgba(255, 255, 255, 0.1);
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

        // Modify the global mousedown handler
        document.removeEventListener('mousedown', handleMouseDown); // Remove old handler if exists
        document.addEventListener('mousedown', (e) => {
            const box = document.getElementById('selection-box');
            if (box && !box.contains(e.target) && !e.target.closest('#selection-box')) {
                box.dataset.selectedText = '';  // Clear stored selection
                box.remove();
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
        border-bottom: 1px solid ${BOX_CONFIG.colors.border};
        height: ${BOX_CONFIG.controlsHeight}px;
        background: ${BOX_CONFIG.colors.background};
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        border-radius: 12px 12px 0 0;
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
            border: 1px solid ${BOX_CONFIG.colors.border};
            background: ${length === 'short' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
            color: ${BOX_CONFIG.colors.text.primary};
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s;
            &:hover {
                background: rgba(255, 255, 255, 0.25);
                transform: translateY(-1px);
            }
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
        padding: 4px 12px;
        border-radius: 8px;
        border: 1px solid ${BOX_CONFIG.colors.border};
        background: rgba(255, 255, 255, 0.1);
        color: ${BOX_CONFIG.colors.text.primary};
        cursor: pointer;
        font-size: 12px;
        outline: none;
        transition: all 0.2s;
        &:hover {
            background: rgba(255, 255, 255, 0.15);
        }
        & option {
            background: ${BOX_CONFIG.colors.background};
            color: ${BOX_CONFIG.colors.text.primary};
        }
    `;
    
    ['key-points', 'tl;dr', 'teaser', 'headline'].forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ');
        typeSelect.appendChild(option);
    });

    // Add change handler to update summary
    typeSelect.onchange = () => {
        // Find the active length button
        const activeButton = lengthControls.querySelector('button[style*="background: rgba(255, 255, 255, 0.2)"]') || 
                           lengthControls.querySelector('button[data-length="short"]'); // fallback to 'short' if none active
        const activeLength = activeButton.dataset.length;
        
        // Generate new summary with selected options
        updateSummary(activeLength, typeSelect.value);
    };

    // Update length button click handler
    lengthControls.querySelectorAll('button').forEach(btn => {
        btn.onclick = () => {
            // Update button styles
            lengthControls.querySelectorAll('button').forEach(b => {
                b.style.background = 'rgba(255, 255, 255, 0.1)';
            });
            btn.style.background = 'rgba(255, 255, 255, 0.2)';
            
            // Generate new summary with selected options
            updateSummary(btn.dataset.length, typeSelect.value);
        };
    });

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