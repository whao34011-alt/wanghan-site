// 静态数据版本 - 适用于 GitHub Pages
// ============ 静态数据 ============
const WANGHAN_DATA = {
    avatar: "images/1772120478281.JPG",
    videos: [
        {
            bvid: "BV1xx4y187hc",
            title: "人类高质量情感语录",
            pic: "https://i0.hdslb.com/bfs/archive/1772120478281.jpg",
            duration: "0:45",
            views: "12.5万",
            date: "2024-12-15"
        },
        {
            bvid: "BV1Xx4y1b7Hc",
            title: "治愈系日常分享",
            pic: "https://i0.hdslb.com/bfs/archive/IMG_2953.jpg",
            duration: "1:20",
            views: "8.3万",
            date: "2024-12-10"
        },
        {
            bvid: "BV1xx4y187hc",
            title: "少女感穿搭分享",
            pic: "https://i0.hdslb.com/bfs/archive/IMG_3281.jpg",
            duration: "2:15",
            views: "15.2万",
            date: "2024-12-05"
        },
        {
            bvid: "BV1Xx4y1b7Hc",
            title: "文艺情感短片",
            pic: "https://i0.hdslb.com/bfs/archive/IMG_3393.jpg",
            duration: "3:30",
            views: "20.1万",
            date: "2024-11-28"
        }
    ]
};

const GALLERY_DATA = [
    { src: "images/1772120478281.JPG", title: "日常美照" },
    { src: "images/IMG_2953(20251019-161342).jpg", title: "生活瞬间" },
    { src: "images/IMG_3281.PNG", title: "可爱自拍" },
    { src: "images/IMG_3393.JPG", title: "旅行记录" },
    { src: "images/IMG_3673.JPG", title: "精彩瞬间" }
];

// ============ 页面加载 ============
document.addEventListener('DOMContentLoaded', () => {
    loadWanghanInfo();
    loadGallery();
    setupEventListeners();
    setupScrollAnimations();
});

// ============ 事件监听 ============
function setupEventListeners() {
    // 点击模态框外部关闭
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    });

    // ESC键关闭弹窗
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.remove('show');
            });
        }
    });
}

// ============ 滚动动画 ============
function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.about-card, .video-card').forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

// ============ 加载王涵信息 ============
function loadWanghanInfo() {
    updateAvatar(WANGHAN_DATA.avatar);
    renderVideos(WANGHAN_DATA.videos);
}

// ============ 更新头像 ============
function updateAvatar(avatarUrl) {
    const heroAvatar = document.querySelector('.profile-placeholder');
    if (heroAvatar && avatarUrl) {
        heroAvatar.innerHTML = `<img src="${avatarUrl}" alt="王涵" referrerpolicy="no-referrer" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
    }
}

// ============ 渲染视频列表 ============
function renderVideos(videos) {
    const container = document.getElementById('videosGrid');
    if (!container) return;

    container.innerHTML = videos.map(video => `
        <a href="https://www.bilibili.com/video/${video.bvid}" target="_blank" class="video-card-link">
            <div class="video-card">
                <div class="video-thumbnail" style="position: relative; height: 180px; overflow: hidden;">
                    <img src="${video.pic}" referrerpolicy="no-referrer" style="width: 100%; height: 100%; object-fit: cover;" alt="${video.title}">
                    <div class="video-thumbnail-overlay"></div>
                    <i class="fas fa-play-circle"></i>
                    <span class="video-duration">${video.duration}</span>
                    <div class="video-overlay">
                        <span class="watch-text"><i class="fab fa-bilibili"></i> 点击观看</span>
                    </div>
                </div>
                <div class="video-info">
                    <h3 class="video-title">${video.title}</h3>
                    <div class="video-meta">
                        <span class="video-views"><i class="fas fa-eye"></i> ${video.views}</span>
                        <span class="video-date"><i class="fas fa-calendar"></i> ${video.date}</span>
                    </div>
                </div>
            </div>
        </a>
    `).join('');
}

// ============ 加载相册 ============
function loadGallery() {
    renderGallery(GALLERY_DATA);
}

// ============ 渲染相册 ============
function renderGallery(images) {
    const container = document.querySelector('.gallery-grid');
    if (!container || images.length === 0) return;

    container.innerHTML = images.map((img, index) => `
        <div class="gallery-item ${index === 0 ? 'large' : ''}" onclick="openImageModal('${img.src}')">
            <img src="${img.src}" referrerpolicy="no-referrer" alt="${img.title}" loading="lazy">
        </div>
    `).join('');
}

// ============ 打开图片预览 ============
function openImageModal(src) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="image-modal-overlay" onclick="this.parentElement.remove()"></div>
        <img src="${src}" referrerpolicy="no-referrer" alt="预览">
        <button class="close-modal" onclick="this.parentElement.remove()">&times;</button>
    `;
    document.body.appendChild(modal);
}

// 添加动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    .animate-on-scroll {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    .animate-on-scroll.visible {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);
