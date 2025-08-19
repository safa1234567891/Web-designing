// DOM Elements
const uploadArea = document.getElementById('uploadArea');
const previewContainer = document.getElementById('previewContainer');
const moodButtons = document.querySelectorAll('.mood-btn');
const keywordsInput = document.querySelector('.keywords input');
const animateButton = document.querySelector('.preview-controls .btn-outline:first-child');
const styleButton = document.querySelector('.preview-controls .btn-outline:nth-child(2)');
const shareButton = document.querySelector('.preview-controls .btn-primary');

// Initialize Three.js scene for hero animation
let scene, camera, renderer, particles;
function initHeroAnimation() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 400 / 400, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(400, 400);
    document.getElementById('heroAnimation').appendChild(renderer.domElement);

    // Create particles
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    for (let i = 0; i < 1000; i++) {
        vertices.push(
            Math.random() * 2 - 1,
            Math.random() * 2 - 1,
            Math.random() * 2 - 1
        );
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    const material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.02,
        transparent: true,
        opacity: 0.8
    });
    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    camera.position.z = 1;
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    particles.rotation.x += 0.001;
    particles.rotation.y += 0.001;
    renderer.render(scene, camera);
}

// Initialize hero animation
initHeroAnimation();

// File Upload Handling
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.background = 'rgba(108, 92, 231, 0.1)';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.background = 'transparent';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.background = 'transparent';
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        handleImageUpload(file);
    }
});

uploadArea.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleImageUpload(file);
        }
    };
    input.click();
});

function handleImageUpload(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        // Here you would typically send the image to your AI service
        // For now, we'll just show a placeholder message
        previewContainer.innerHTML = '<p>Analyzing image...</p>';
        setTimeout(() => {
            generateCaption('image', file.name);
        }, 1500);
    };
    reader.readAsDataURL(file);
}

// Mood Selection
moodButtons.forEach(button => {
    button.addEventListener('click', () => {
        moodButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        generateCaption('mood', button.textContent.trim());
    });
});

// Keywords Input
let keywordTimeout;
keywordsInput.addEventListener('input', (e) => {
    clearTimeout(keywordTimeout);
    keywordTimeout = setTimeout(() => {
        generateCaption('keywords', e.target.value);
    }, 500);
});

// Caption Generation
async function generateCaption(type, value) {
    // This is where you would integrate with your AI service
    // For now, we'll use placeholder responses
    const captions = {
        mood: {
            'Happy': '✨ Living my best life! #HappyVibes',
            'Sad': '🌧️ Sometimes the rain brings clarity... #EmotionalJourney',
            'Excited': '🚀 New adventures await! #ExcitedForLife',
            'Inspired': '💫 Let your light shine bright! #Inspiration'
        },
        keywords: (keywords) => {
            const words = keywords.split(',').map(k => k.trim());
            return `✨ ${words.join(' ')} #${words[0]}Life`;
        },
        image: (filename) => `📸 Capturing moments, creating memories #${filename.split('.')[0]}`
    };

    let caption = '';
    switch (type) {
        case 'mood':
            caption = captions.mood[value] || '✨ Living in the moment! #LifeIsBeautiful';
            break;
        case 'keywords':
            caption = captions.keywords(value);
            break;
        case 'image':
            caption = captions.image(value);
            break;
    }

    // Animate caption appearance
    previewContainer.style.opacity = '0';
    setTimeout(() => {
        previewContainer.innerHTML = `<p>${caption}</p>`;
        previewContainer.style.opacity = '1';
    }, 300);
}

// Animation Controls
animateButton.addEventListener('click', () => {
    const text = previewContainer.querySelector('p');
    if (text) {
        text.style.animation = 'none';
        text.offsetHeight; // Trigger reflow
        text.style.animation = 'fadeIn 0.5s ease-out';
    }
});

// Style Controls
styleButton.addEventListener('click', () => {
    const text = previewContainer.querySelector('p');
    if (text) {
        const styles = [
            'font-weight: bold; color: #6c5ce7;',
            'font-style: italic; color: #e84393;',
            'text-transform: uppercase; color: #00b894;',
            'letter-spacing: 2px; color: #0984e3;'
        ];
        const currentStyle = text.getAttribute('style') || '';
        const nextStyle = styles[(styles.indexOf(currentStyle) + 1) % styles.length];
        text.setAttribute('style', nextStyle);
    }
});

// Share Functionality
shareButton.addEventListener('click', () => {
    const text = previewContainer.querySelector('p');
    if (text) {
        if (navigator.share) {
            navigator.share({
                title: 'My Instagram Caption',
                text: text.textContent
            }).catch(console.error);
        } else {
            // Fallback for browsers that don't support Web Share API
            const textarea = document.createElement('textarea');
            textarea.value = text.textContent;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert('Caption copied to clipboard!');
        }
    }
});

// Category Cards Animation
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
        const category = card.querySelector('h3').textContent;
        generateCaption('keywords', category);
    });
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
}); 