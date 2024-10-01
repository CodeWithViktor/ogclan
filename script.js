// Background Animation
const backgroundScene = new THREE.Scene();
const backgroundCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const backgroundRenderer = new THREE.WebGLRenderer({ alpha: true });
backgroundRenderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('background-animation').appendChild(backgroundRenderer.domElement);

// Create a custom shader material for meteors
const meteorMaterial = new THREE.ShaderMaterial({
    uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
    },
    vertexShader: `
        uniform float time;
        attribute float size;
        attribute vec3 customColor;
        varying vec3 vColor;
        void main() {
            vColor = customColor;
            vec3 pos = position;
            
            // Move meteors faster
            pos.x -= time * 0.15;
            pos.y -= time * 0.3;
            pos.z -= time * 0.15;
            
            // Wrap around when out of view
            if (pos.x < -100.0) pos.x += 200.0;
            if (pos.y < -100.0) pos.y += 200.0;
            if (pos.z < -100.0) pos.z += 200.0;
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
        }
    `,
    fragmentShader: `
        uniform vec2 resolution;
        varying vec3 vColor;
        void main() {
            vec2 uv = gl_FragCoord.xy / resolution.xy;
            float distanceToCenter = length(gl_PointCoord - vec2(0.5));
            float strength = 0.05 / distanceToCenter - 0.1;
            gl_FragColor = vec4(vColor, strength);
        }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
});

// Create meteor system
const meteorCount = 1000;
const meteorGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(meteorCount * 3);
const colors = new Float32Array(meteorCount * 3);
const sizes = new Float32Array(meteorCount);

for (let i = 0; i < meteorCount; i++) {
    const i3 = i * 3;
    positions[i3] = Math.random() * 200 - 100;
    positions[i3 + 1] = Math.random() * 200 - 100;
    positions[i3 + 2] = Math.random() * 200 - 100;
    
    colors[i3] = Math.random() * 0.5 + 0.5; // R
    colors[i3 + 1] = Math.random() * 0.3; // G
    colors[i3 + 2] = 0.1; // B
    
    sizes[i] = Math.random() * 4 + 1;
}

meteorGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
meteorGeometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));
meteorGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

const meteorSystem = new THREE.Points(meteorGeometry, meteorMaterial);
backgroundScene.add(meteorSystem);

// Add stars
const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.5,
    transparent: true,
    blending: THREE.AdditiveBlending
});

const starVertices = [];
for (let i = 0; i < 10000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = (Math.random() - 0.5) * 2000;
    starVertices.push(x, y, z);
}

starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const stars = new THREE.Points(starGeometry, starMaterial);
backgroundScene.add(stars);

backgroundCamera.position.z = 100;

const clock = new THREE.Clock();

function animateBackground() {
    requestAnimationFrame(animateBackground);

    const time = clock.getElapsedTime() * 10;
    meteorMaterial.uniforms.time.value = time;

    // Rotate star field
    stars.rotation.y += 0.0001;

    backgroundRenderer.render(backgroundScene, backgroundCamera);
}

animateBackground();

// Animated Buttons
const buttons = document.querySelectorAll('.animated-button');
buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
        gsap.to(button, {
            scale: 1.1,
            duration: 0.3,
            ease: 'power2.out'
        });
    });

    button.addEventListener('mouseleave', () => {
        gsap.to(button, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
});

// Member Cards
const members = [
    { name: 'Elections-today', rank: 'Fleet Admiral', score: 10000 },
    { name: 'Villor', rank: 'Co-Leader', score: 914667 },
    { name: 'Elections-today', rank: 'Co-Leader', score: 9000 },
    { name: 'Elections-today', rank: 'Grand Admiral', score: 8500 },
    { name: 'Elections-today', rank: 'Admiral', score: 8000 },
];

const memberCards = document.getElementById('member-cards');

members.forEach(member => {
    const card = document.createElement('div');
    card.classList.add('member-card');
    card.innerHTML = `
        <h3>${member.name}</h3>
        <p>Rank: ${member.rank}</p>
        <p>Score: ${member.score}</p>
    `;
    memberCards.appendChild(card);
});

// Achievements
const achievements = [
    'First Place in Global Clan ranking',
    'Longest top 1 position held',
    'Most games won in total: 370k+',
    'One of the oldest clan'
];

const achievementList = document.getElementById('achievement-list');

achievements.forEach(achievement => {
    const li = document.createElement('li');
    li.textContent = achievement;
    achievementList.appendChild(li);
});

// Clan Statistics
const stats = [
    { name: 'Total Victories', value: 370000 },
    { name: 'Win Rate', value: '85%' },
    { name: 'Average Score (monthly)', value: 12000 },
    { name: 'Total Members', value: 3300 },
    { name: 'Global Ranking', value: '#1' }
];

const statCards = document.getElementById('stat-cards');

stats.forEach(stat => {
    const card = document.createElement('div');
    card.classList.add('stat-card');
    card.innerHTML = `
        <h3>${stat.name}</h3>
        <p>${stat.value}</p>
    `;
    statCards.appendChild(card);
});

// Responsive design
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    backgroundCamera.aspect = width / height;
    backgroundCamera.updateProjectionMatrix();
    backgroundRenderer.setSize(width, height);
    meteorMaterial.uniforms.resolution.value.set(width, height);
});

// about us
document.addEventListener('DOMContentLoaded', () => {
    const aboutButton = document.getElementById('about-button');
    const homeButton = document.getElementById('home-button');
    const clanDetails = document.getElementById('clan-details');
    const elementsToHide = document.querySelectorAll('body > *:not(#background-animation):not(#clan-details)');
    const fadeElements = document.querySelectorAll('.fade-in');

    aboutButton.addEventListener('click', () => {
        // Add exit animation to elements that need to be hidden
        elementsToHide.forEach(element => {
            element.classList.add('exit-animation');
        });

        // Wait for the animation to finish, then show clan details
        setTimeout(() => {
            elementsToHide.forEach(element => {
                element.style.display = 'none';
            });
            clanDetails.style.display = 'block';
            
            // Ensure clan details are positioned over the background
            clanDetails.style.position = 'absolute';
            clanDetails.style.top = '0';
            clanDetails.style.left = '0';
            clanDetails.style.width = '100%';
            clanDetails.style.height = '100%';
            clanDetails.style.zIndex = '10';
            clanDetails.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'; // Semi-transparent background

            // Trigger fade-in animations
            fadeElements.forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('active');
                }, index * 200); // Stagger the animations
            });
        }, 500); // 500ms matches the exit animation duration
    });

    homeButton.addEventListener('click', () => {
        // Hide clan details
        clanDetails.style.display = 'none';

        // Show all previously hidden elements
        elementsToHide.forEach(element => {
            element.style.display = '';
            element.classList.remove('exit-animation');
        });

        // Reset fade elements
        fadeElements.forEach(el => {
            el.classList.remove('active');
        });
    });

    // Add animation to all buttons with the 'animated-button' class
    const animatedButtons = document.querySelectorAll('.animated-button');
    animatedButtons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            gsap.to(button, {
                scale: 1.1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
});
document.addEventListener('DOMContentLoaded', () => {


    const discordButton = document.querySelector('button[data-text="Contact"]');
    const discordPrompt = document.getElementById('discord-prompt');
    const confirmDiscord = document.getElementById('confirm-discord');
    const cancelDiscord = document.getElementById('cancel-discord');

    discordButton.addEventListener('click', (e) => {
        e.preventDefault();
        discordPrompt.style.display = 'block';
    });

    confirmDiscord.addEventListener('click', () => {
        window.location.href = 'https://discord.gg/joinog';
    });

    cancelDiscord.addEventListener('click', () => {
        discordPrompt.style.display = 'none';
    });
});
document.addEventListener('DOMContentLoaded', () => {
  

    const achievementsButton = document.getElementById('achievements-button');
    const achievementsSection = document.getElementById('achievements');

    achievementsButton.addEventListener('click', (e) => {
        e.preventDefault();
        achievementsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });

   
});
