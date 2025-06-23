// Simple CAPTCHA Implementation (without external dependencies)
(function() {
    'use strict';

    // CAPTCHA configuration
    const config = {
        length: 6,
        charset: 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789',
        fontSize: 24,
        noise: 25,
        lines: 4
    };

    // Store CAPTCHA values
    const captchaStore = new Map();

    // Generate random string
    function generateRandomString(length) {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += config.charset.charAt(Math.floor(Math.random() * config.charset.length));
        }
        return result;
    }

    // Create CAPTCHA image
    function createCaptchaImage(text) {
        const canvas = document.createElement('canvas');
        canvas.width = 150;
        canvas.height = 50;
        const ctx = canvas.getContext('2d');

        // Background
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add noise
        for (let i = 0; i < config.noise; i++) {
            ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.3)`;
            ctx.fillRect(
                Math.random() * canvas.width,
                Math.random() * canvas.height,
                Math.random() * 3,
                Math.random() * 3
            );
        }

        // Add lines
        for (let i = 0; i < config.lines; i++) {
            ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`;
            ctx.beginPath();
            ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.stroke();
        }

        // Draw text
        ctx.font = `${config.fontSize}px Arial`;
        ctx.fillStyle = '#0066FF';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Add slight rotation and spacing to each character
        const charWidth = canvas.width / text.length;
        for (let i = 0; i < text.length; i++) {
            ctx.save();
            const x = charWidth * i + charWidth / 2;
            const y = canvas.height / 2 + (Math.random() - 0.5) * 10;
            ctx.translate(x, y);
            ctx.rotate((Math.random() - 0.5) * 0.4);
            ctx.fillText(text[i], 0, 0);
            ctx.restore();
        }

        return canvas.toDataURL();
    }

    // Create CAPTCHA widget
    function createCaptchaWidget() {
        const widget = document.createElement('div');
        widget.className = 'captcha-widget';
        widget.style.cssText = `
            display: inline-block;
            background: var(--axis-neutral-900, #0a0a0a);
            border: 1px solid var(--axis-neutral-800, #1a1a1a);
            border-radius: 8px;
            padding: 16px;
            margin: 16px 0;
        `;

        const imageContainer = document.createElement('div');
        imageContainer.style.cssText = `
            background: var(--axis-neutral-950, #050505);
            border-radius: 4px;
            padding: 8px;
            margin-bottom: 12px;
            text-align: center;
        `;

        const image = document.createElement('img');
        image.className = 'captcha-image';
        image.style.cssText = `
            display: block;
            margin: 0 auto;
            border-radius: 4px;
        `;
        imageContainer.appendChild(image);

        const controls = document.createElement('div');
        controls.style.cssText = `
            display: flex;
            gap: 8px;
            align-items: center;
            margin-bottom: 12px;
        `;

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'captcha-input';
        input.placeholder = 'Enter the text above';
        input.style.cssText = `
            flex: 1;
            padding: 8px 12px;
            background: var(--axis-neutral-800, #1a1a1a);
            border: 1px solid var(--axis-neutral-700, #2a2a2a);
            border-radius: 6px;
            color: var(--axis-pure-white, #fff);
            font-size: 14px;
        `;

        const refreshButton = document.createElement('button');
        refreshButton.type = 'button';
        refreshButton.innerHTML = '↻';
        refreshButton.title = 'Refresh CAPTCHA';
        refreshButton.style.cssText = `
            padding: 8px 12px;
            background: var(--axis-neutral-800, #1a1a1a);
            border: 1px solid var(--axis-neutral-700, #2a2a2a);
            border-radius: 6px;
            color: var(--axis-neutral-400, #999);
            cursor: pointer;
            font-size: 18px;
            transition: all 0.2s ease;
        `;
        refreshButton.onmouseover = () => {
            refreshButton.style.color = 'var(--axis-accent-primary, #0066FF)';
            refreshButton.style.borderColor = 'var(--axis-accent-primary, #0066FF)';
        };
        refreshButton.onmouseout = () => {
            refreshButton.style.color = 'var(--axis-neutral-400, #999)';
            refreshButton.style.borderColor = 'var(--axis-neutral-700, #2a2a2a)';
        };

        controls.appendChild(input);
        controls.appendChild(refreshButton);

        const message = document.createElement('div');
        message.className = 'captcha-message';
        message.style.cssText = `
            font-size: 12px;
            color: var(--axis-neutral-500, #666);
            text-align: center;
        `;
        message.textContent = 'Please prove you are human';

        widget.appendChild(imageContainer);
        widget.appendChild(controls);
        widget.appendChild(message);

        // Generate initial CAPTCHA
        const captchaId = generateCaptcha();
        const captchaText = captchaStore.get(captchaId);
        image.src = createCaptchaImage(captchaText);
        widget.dataset.captchaId = captchaId;

        // Refresh button handler
        refreshButton.onclick = () => {
            const newCaptchaId = generateCaptcha();
            const newCaptchaText = captchaStore.get(newCaptchaId);
            image.src = createCaptchaImage(newCaptchaText);
            widget.dataset.captchaId = newCaptchaId;
            input.value = '';
            message.textContent = 'Please prove you are human';
            message.style.color = 'var(--axis-neutral-500, #666)';
        };

        return { widget, input };
    }

    // Generate CAPTCHA
    function generateCaptcha() {
        const id = Math.random().toString(36).substr(2, 9);
        const text = generateRandomString(config.length);
        captchaStore.set(id, text);
        
        // Clean up old CAPTCHAs after 5 minutes
        setTimeout(() => captchaStore.delete(id), 300000);
        
        return id;
    }

    // Validate CAPTCHA
    function validateCaptcha(captchaId, userInput) {
        const correctValue = captchaStore.get(captchaId);
        if (!correctValue) return false;
        
        // Case-insensitive comparison
        const isValid = correctValue.toLowerCase() === userInput.toLowerCase();
        
        // Delete after validation attempt
        captchaStore.delete(captchaId);
        
        return isValid;
    }

    // Add CAPTCHA to form
    function addCaptchaToForm(form) {
        if (!form || form.dataset.captchaAdded) return;

        const { widget, input } = createCaptchaWidget();
        
        // Find submit button
        const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
        if (submitButton) {
            submitButton.parentNode.insertBefore(widget, submitButton);
        } else {
            form.appendChild(widget);
        }

        // Add validation
        form.addEventListener('submit', (e) => {
            const captchaId = widget.dataset.captchaId;
            const userInput = input.value;
            
            if (!validateCaptcha(captchaId, userInput)) {
                e.preventDefault();
                
                const message = widget.querySelector('.captcha-message');
                message.textContent = 'Incorrect CAPTCHA. Please try again.';
                message.style.color = 'var(--axis-accent-error, #ef4444)';
                
                // Generate new CAPTCHA
                const newCaptchaId = generateCaptcha();
                const newCaptchaText = captchaStore.get(newCaptchaId);
                widget.querySelector('.captcha-image').src = createCaptchaImage(newCaptchaText);
                widget.dataset.captchaId = newCaptchaId;
                input.value = '';
                input.focus();
                
                return false;
            }
        });

        form.dataset.captchaAdded = 'true';
    }

    // Auto-add CAPTCHA to forms with data-captcha attribute
    function initCaptchas() {
        const forms = document.querySelectorAll('form[data-captcha="true"]');
        forms.forEach(addCaptchaToForm);
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCaptchas);
    } else {
        initCaptchas();
    }

    // Export global API
    window.Captcha = {
        add: addCaptchaToForm,
        generate: generateCaptcha,
        validate: validateCaptcha,
        createWidget: createCaptchaWidget
    };
})();