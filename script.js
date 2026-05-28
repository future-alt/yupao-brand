// === 鱼泡直聘品牌资产网站 ===

// 移动端侧边栏切换
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');

menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
});

// 品牌VIS下拉菜单切换
document.querySelectorAll('.nav-parent[data-toggle]').forEach(parent => {
    parent.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = parent.getAttribute('data-toggle');
        const subMenu = document.getElementById(targetId);
        const arrow = parent.querySelector('.arrow');
        if (subMenu) {
            subMenu.classList.toggle('open');
            if (arrow) arrow.classList.toggle('collapsed');
        }
    });
});

// 点击导航链接后关闭侧边栏（移动端）
document.querySelectorAll('.nav-sub .nav-link, .nav-parent:not([data-toggle])').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 1024) {
            sidebar.classList.remove('open');
        }
    });
});

// 滚动时高亮当前导航
const sections = document.querySelectorAll('section[id]');
const allNavLinks = document.querySelectorAll('.nav-link');
const visParent = document.querySelector('.nav-parent[data-toggle="vis-sub"]');

// VIS 区域的 section id 列表
const visSectionIds = new Set(['vis', 'a1', 'a2', 'a3', 'a4', 'a5', 'a6']);

function updateActiveNav() {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    // 清空所有active
    allNavLinks.forEach(link => link.classList.remove('active'));

    // 当前section对应的链接
    const targetLink = document.querySelector(`.nav-link[href="#${current}"]`);
    if (targetLink) targetLink.classList.add('active');

    // 如果当前在VIS子区域，VIS父级也高亮
    if (visParent) {
        if (visSectionIds.has(current)) {
            visParent.classList.add('active');
        } else {
            visParent.classList.remove('active');
        }
    }
}

window.addEventListener('scroll', updateActiveNav);
// 页面加载时也运行一次
updateActiveNav();

// === Lightbox（点击放大/再点关闭）===
const lightbox = document.createElement('div');
lightbox.className = 'lightbox';
lightbox.innerHTML = `
    <div class="lightbox-loader"><div class="spinner"></div><span>加载中...</span></div>
    <img src="" alt="">
    <button class="lightbox-arrow lightbox-prev" aria-label="上一张">‹</button>
    <button class="lightbox-arrow lightbox-next" aria-label="下一张">›</button>
    <div class="lightbox-counter"></div>
`;
document.body.appendChild(lightbox);
const lightboxImg = lightbox.querySelector('img');
const lightboxLoader = lightbox.querySelector('.lightbox-loader');
const lightboxPrev = lightbox.querySelector('.lightbox-prev');
const lightboxNext = lightbox.querySelector('.lightbox-next');
const lightboxCounter = lightbox.querySelector('.lightbox-counter');

let currentGroup = [];
let currentIndex = 0;

function loadLightboxImage(src) {
    lightboxLoader.style.display = 'flex';
    lightboxLoader.innerHTML = '<div class="spinner"></div><span>加载中...</span>';
    lightboxImg.style.opacity = '0';

    const tempImg = new Image();
    tempImg.onload = () => {
        lightboxImg.src = src;
        lightboxImg.style.opacity = '1';
        lightboxLoader.style.display = 'none';
    };
    tempImg.onerror = () => {
        lightboxLoader.innerHTML = '<span>加载失败</span>';
    };
    tempImg.src = src;
}

function updateLightboxNav() {
    if (currentGroup.length > 1) {
        lightboxPrev.style.display = 'flex';
        lightboxNext.style.display = 'flex';
        lightboxCounter.style.display = 'block';
        lightboxCounter.textContent = `${currentIndex + 1} / ${currentGroup.length}`;
    } else {
        lightboxPrev.style.display = 'none';
        lightboxNext.style.display = 'none';
        lightboxCounter.style.display = 'none';
    }
}

function openLightbox(group, index) {
    currentGroup = group;
    currentIndex = index;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    loadLightboxImage(currentGroup[currentIndex]);
    updateLightboxNav();
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function showPrev(e) {
    e.stopPropagation();
    currentIndex = (currentIndex - 1 + currentGroup.length) % currentGroup.length;
    loadLightboxImage(currentGroup[currentIndex]);
    updateLightboxNav();
}

function showNext(e) {
    e.stopPropagation();
    currentIndex = (currentIndex + 1) % currentGroup.length;
    loadLightboxImage(currentGroup[currentIndex]);
    updateLightboxNav();
}

lightboxPrev.addEventListener('click', showPrev);
lightboxNext.addEventListener('click', showNext);

// 点击 lightbox 任意位置关闭（按钮区除外）
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === lightboxImg) {
        closeLightbox();
    }
});
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft' && currentGroup.length > 1) showPrev(e);
    if (e.key === 'ArrowRight' && currentGroup.length > 1) showNext(e);
});

// === VIS 图片点击放大（使用高清图，全部图片为一组）===
const visImgs = document.querySelectorAll('.full-image');
const visGroup = Array.from(visImgs).map(img => img.src.replace('/JPG/', '/JPG-hd/'));
visImgs.forEach((img, idx) => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => openLightbox(visGroup, idx));
});

// LOGO 下载区图片点击放大（所有 LOGO 为一组）
const logoImgs = document.querySelectorAll('.download-preview img');
const logoGroup = Array.from(logoImgs).map(img => img.src);
logoImgs.forEach((img, idx) => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => openLightbox(logoGroup, idx));
});

// === 你好模块鼠标跟随光效 ===
const welcomeSection = document.getElementById('welcome');
const welcomeGlow = document.getElementById('welcomeGlow');

if (welcomeSection && welcomeGlow) {
    welcomeSection.addEventListener('mousemove', (e) => {
        const rect = welcomeSection.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        welcomeGlow.style.left = x + 'px';
        welcomeGlow.style.top = y + 'px';
    });
}
