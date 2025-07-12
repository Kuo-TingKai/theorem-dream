// 全局变量
let scene, camera, renderer, particles, particleSystem;
let currentPlateau = 1;
let animationId;

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initLoading();
    initThreeJS();
    initEventListeners();
    initSigmaMachine();
});

// 加载动画
function initLoading() {
    setTimeout(() => {
        document.getElementById('loading-screen').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('loading-screen').style.display = 'none';
            document.getElementById('main-container').classList.add('loaded');
        }, 500);
    }, 3000);
}

// 初始化Three.js
function initThreeJS() {
    const canvas = document.getElementById('threejs-canvas');
    
    // 创建场景
    scene = new THREE.Scene();
    
    // 创建相机
    camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // 创建渲染器
    renderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        antialias: true,
        alpha: true 
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setClearColor(0x000000, 0);
    
    // 创建粒子系统
    createParticleSystem();
    
    // 添加数学符号
    createMathSymbols();
    
    // 开始动画循环
    animate();
    
    // 响应窗口大小变化
    window.addEventListener('resize', onWindowResize);
}

// 创建粒子系统
function createParticleSystem() {
    const particleCount = 1000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 20;
        positions[i + 1] = (Math.random() - 0.5) * 20;
        positions[i + 2] = (Math.random() - 0.5) * 20;
        
        colors[i] = Math.random() * 0.5 + 0.5; // R
        colors[i + 1] = 1.0; // G
        colors[i + 2] = Math.random() * 0.5 + 0.5; // B
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
    });
    
    particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);
}

// 创建数学符号
function createMathSymbols() {
    const symbols = ['Σ', 'P', 'α', 'β', 'γ', 'δ', 'ω', '∅', '∀', '∃', '∈', '⊂'];
    const loader = new THREE.FontLoader();
    
    symbols.forEach((symbol, index) => {
        const geometry = new THREE.PlaneGeometry(0.5, 0.5);
        const material = new THREE.MeshBasicMaterial({
            color: 0x64ffda,
            transparent: true,
            opacity: 0.3
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10
        );
        mesh.userData = { symbol: symbol, originalPosition: mesh.position.clone() };
        scene.add(mesh);
    });
}

// 动画循环
function animate() {
    animationId = requestAnimationFrame(animate);
    
    // 旋转粒子系统
    if (particleSystem) {
        particleSystem.rotation.x += 0.001;
        particleSystem.rotation.y += 0.002;
    }
    
    // 更新数学符号
    scene.children.forEach(child => {
        if (child.userData && child.userData.symbol) {
            child.rotation.x += 0.01;
            child.rotation.y += 0.01;
            child.position.y += Math.sin(Date.now() * 0.001 + child.position.x) * 0.001;
        }
    });
    
    // 根据当前Plateau改变场景
    updateSceneForPlateau();
    
    renderer.render(scene, camera);
}

// 根据Plateau更新场景
function updateSceneForPlateau() {
    switch(currentPlateau) {
        case 1:
            // 平静的数学世界
            if (particleSystem) {
                particleSystem.material.opacity = 0.3;
            }
            break;
        case 2:
            // 语法崩坏 - 增加混乱
            if (particleSystem) {
                particleSystem.material.opacity = 0.8;
                particleSystem.rotation.x += 0.005;
                particleSystem.rotation.y += 0.01;
            }
            break;
        case 3:
            // 小说中的小说 - 镜像效果
            if (particleSystem) {
                particleSystem.material.opacity = 0.5;
                particleSystem.scale.x = Math.sin(Date.now() * 0.001) * 0.1 + 1;
                particleSystem.scale.y = Math.cos(Date.now() * 0.001) * 0.1 + 1;
            }
            break;
        case 4:
            // 拓扑记忆 - 莫比乌斯环效果
            if (particleSystem) {
                particleSystem.material.opacity = 0.6;
                particleSystem.rotation.z += 0.003;
            }
            break;
        case 5:
            // Σ-语言机 - 计算效果
            if (particleSystem) {
                particleSystem.material.opacity = 0.7;
                particleSystem.position.x = Math.sin(Date.now() * 0.0005) * 0.5;
                particleSystem.position.y = Math.cos(Date.now() * 0.0005) * 0.5;
            }
            break;
        case 6:
            // 结局之域 - 多重可能性
            if (particleSystem) {
                particleSystem.material.opacity = 0.9;
                particleSystem.rotation.x += 0.002;
                particleSystem.rotation.y += 0.004;
                particleSystem.rotation.z += 0.001;
            }
            break;
    }
}

// 窗口大小变化处理
function onWindowResize() {
    const canvas = document.getElementById('threejs-canvas');
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
}

// 初始化事件监听器
function initEventListeners() {
    // Plateau导航
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const plateau = parseInt(this.dataset.plateau);
            switchPlateau(plateau);
        });
    });
}

// 切换Plateau
function switchPlateau(plateau) {
    // 更新导航按钮状态
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-plateau="${plateau}"]`).classList.add('active');
    
    // 更新内容显示
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(`plateau-${plateau}`).classList.add('active');
    
    // 更新当前Plateau
    currentPlateau = plateau;
    
    // 添加切换动画
    gsap.fromTo(`#plateau-${plateau}`, 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
    );
}

// 初始化Σ-语言机
function initSigmaMachine() {
    const generateBtn = document.getElementById('generate-btn');
    const userInput = document.getElementById('user-input');
    const outputDisplay = document.getElementById('output-display');
    
    generateBtn.addEventListener('click', function() {
        const input = userInput.value.trim();
        if (input) {
            const output = processSigmaInput(input);
            displaySigmaOutput(output);
        }
    });
    
    // 回车键触发
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && e.ctrlKey) {
            generateBtn.click();
        }
    });
}

// 处理Σ-语言机输入
function processSigmaInput(input) {
    const responses = [
        {
            type: 'formal',
            text: `Σ-語言機分析：\n\n輸入：「${input}」\n\n形式化處理：\nP(x) = "${input}"\n\n證明狀態：可證\n\n結局 α：證明完成，轉化為小說\n\n「${input}」已成為《命題之夢》的一部分。`
        },
        {
            type: 'narrative',
            text: `Σ-語言機分析：\n\n輸入：「${input}」\n\n敘事化處理：\n「${input}」與林穆的筆記完全對應。\n\n證明狀態：已完成\n\n結局 β：小說完成了證明\n\n你不需要再證明，只需閱讀。`
        },
        {
            type: 'interactive',
            text: `Σ-語言機分析：\n\n輸入：「${input}」\n\n讀者介入檢測：\n你已輸入語句，Σ 判定你為可證性發生條件。\n\n證明狀態：進行中\n\n結局 γ：你是證明的觸發者\n\n你是此命題的一部分。`
        },
        {
            type: 'collapse',
            text: `Σ-語言機分析：\n\n輸入：「${input}」\n\n語法崩壞檢測：\n語言拒絕被證明。\n\n證明狀態：無解\n\n結局 δ：崩壞結局\n\n他將整套語法撕碎。證明不存在。語言自行焚毀。`
        }
    ];
    
    // 根据输入内容选择响应类型
    const inputLength = input.length;
    const hasMathSymbols = /[Σαβγδω∅∀∃∈⊂]/.test(input);
    const hasChinese = /[\u4e00-\u9fff]/.test(input);
    
    let responseType;
    if (hasMathSymbols && hasChinese) {
        responseType = 'formal';
    } else if (inputLength > 50) {
        responseType = 'narrative';
    } else if (inputLength < 20) {
        responseType = 'interactive';
    } else {
        responseType = 'collapse';
    }
    
    return responses.find(r => r.type === responseType);
}

// 显示Σ-语言机输出
function displaySigmaOutput(output) {
    const outputDisplay = document.getElementById('output-display');
    
    // 清空输出
    outputDisplay.textContent = '';
    
    // 逐字显示效果
    const text = output.text;
    let index = 0;
    
    function typeWriter() {
        if (index < text.length) {
            outputDisplay.textContent += text.charAt(index);
            index++;
            setTimeout(typeWriter, 30);
        }
    }
    
    typeWriter();
    
    // 添加闪烁效果
    outputDisplay.style.animation = 'none';
    setTimeout(() => {
        outputDisplay.style.animation = 'blink 0.5s ease-in-out';
    }, 100);
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
    }
`;
document.head.appendChild(style);

// 鼠标交互效果
document.addEventListener('mousemove', function(e) {
    const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    
    if (camera) {
        camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
        camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.05;
    }
});

// 键盘快捷键
document.addEventListener('keydown', function(e) {
    if (e.key >= '1' && e.key <= '6') {
        switchPlateau(parseInt(e.key));
    }
    
    // Ctrl + R 重新加载
    if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
        location.reload();
    }
});

// 添加滚动视差效果
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.site-header');
    const speed = scrolled * 0.5;
    
    if (parallax) {
        parallax.style.transform = `translateY(${speed}px)`;
    }
});

// 添加数学符号点击效果
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('math-formula') || 
        e.target.classList.contains('code-block')) {
        
        // 创建点击波纹效果
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(100, 255, 218, 0.3)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s linear';
        ripple.style.left = (e.clientX - 25) + 'px';
        ripple.style.top = (e.clientY - 25) + 'px';
        ripple.style.width = '50px';
        ripple.style.height = '50px';
        ripple.style.pointerEvents = 'none';
        ripple.style.zIndex = '1000';
        
        document.body.appendChild(ripple);
        
        setTimeout(() => {
            document.body.removeChild(ripple);
        }, 600);
    }
});

// 添加波纹动画
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle); 