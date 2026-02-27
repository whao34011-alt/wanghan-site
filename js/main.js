// ============ 全局变量 ============
let currentUser = null;
let commentsData = [];

// ============ 页面加载 ============
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
    loadWanghanInfo();
    loadComments();
    loadGallery();
    setupEventListeners();
    setupScrollAnimations();
});

// ============ 事件监听 ============
function setupEventListeners() {
    // 评论字数统计
    const commentTextarea = document.getElementById('commentContent');
    if (commentTextarea) {
        commentTextarea.addEventListener('input', (e) => {
            document.getElementById('charCount').textContent = e.target.value.length;
        });
    }

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

    document.querySelectorAll('.about-card, .video-card, .comment-item').forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

// ============ 认证相关 ============
async function checkAuthStatus() {
    try {
        const response = await fetch('/api/me');
        const data = await response.json();
        
        if (data.loggedIn) {
            currentUser = data.username;
            showUserInfo(data.username);
        } else {
            showAuthButtons();
        }
    } catch (error) {
        console.error('检查登录状态失败:', error);
        showAuthButtons();
    }
}

function showUserInfo(username) {
    document.getElementById('authButtons').style.display = 'none';
    document.getElementById('userInfo').style.display = 'flex';
    document.getElementById('username').textContent = username;
}

function showAuthButtons() {
    document.getElementById('authButtons').style.display = 'flex';
    document.getElementById('userInfo').style.display = 'none';
}

// ============ 弹窗控制 ============
function showLoginModal() {
    document.getElementById('loginModal').classList.add('show');
}

function showRegisterModal() {
    document.getElementById('registerModal').classList.add('show');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

// ============ 登录处理 ============
async function handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
        username: formData.get('username'),
        password: formData.get('password')
    };

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            showNotification('登录成功！欢迎回来 💕', 'success');
            closeModal('loginModal');
            currentUser = result.username;
            showUserInfo(result.username);
            loadComments(); // 刷新评论列表
        } else {
            showNotification(result.error || '登录失败', 'error');
        }
    } catch (error) {
        showNotification('网络错误，请稍后重试', 'error');
    }
}

// ============ 注册处理 ============
async function handleRegister(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password')
    };

    // 简单验证
    if (data.username.length < 2 || data.username.length > 20) {
        showNotification('用户名长度应为2-20字符', 'error');
        return;
    }

    if (data.password.length < 6) {
        showNotification('密码长度至少6位', 'error');
        return;
    }

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            showNotification('注册成功！欢迎加入 💕', 'success');
            closeModal('registerModal');
            currentUser = result.username;
            showUserInfo(result.username);
            e.target.reset();
        } else {
            showNotification(result.error || '注册失败', 'error');
        }
    } catch (error) {
        showNotification('网络错误，请稍后重试', 'error');
    }
}

// ============ 登出 ============
async function logout() {
    try {
        await fetch('/api/logout', { method: 'POST' });
        currentUser = null;
        showAuthButtons();
        showNotification('已退出登录', 'info');
        loadComments();
    } catch (error) {
        showNotification('退出失败', 'error');
    }
}

// ============ 加载王涵信息 ============
async function loadWanghanInfo() {
    try {
        const response = await fetch('/api/wanghan/info');
        const data = await response.json();
        
        // 更新头像
        updateAvatar(data.avatar);
        
        // 渲染视频列表
        renderVideos(data.videos);
    } catch (error) {
        console.error('加载信息失败:', error);
    }
}

// ============ 加载相册图片 ============
async function loadGallery() {
    try {
        const response = await fetch('/api/gallery');
        const images = await response.json();
        renderGallery(images);
    } catch (error) {
        console.error('加载相册失败:', error);
    }
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

// ============ 更新头像 ============
function updateAvatar(avatarUrl) {
    // 更新Hero区域头像
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

// ============ 评论相关 ============
async function loadComments() {
    try {
        const response = await fetch('/api/comments');
        commentsData = await response.json();
        renderComments();
    } catch (error) {
        console.error('加载评论失败:', error);
        document.getElementById('commentsList').innerHTML = '<p style="text-align:center;color:#888;">加载评论失败，请刷新重试</p>';
    }
}

function renderComments() {
    const container = document.getElementById('commentsList');
    if (!container) return;

    if (commentsData.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#888;padding:40px;">还没有评论，快来抢沙发吧~ 💕</p>';
        return;
    }

    container.innerHTML = commentsData.map(comment => `
        <div class="comment-item">
            <div class="comment-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="comment-content">
                <div class="comment-header">
                    <span class="comment-author">${escapeHtml(comment.username)}</span>
                    <span class="comment-time">${formatTime(comment.created_at)}</span>
                </div>
                <p class="comment-text">${escapeHtml(comment.content)}</p>
                <div class="comment-actions">
                    <button onclick="likeComment(${comment.id})" class="${comment.liked ? 'liked' : ''}">
                        <i class="fas fa-heart"></i> ${comment.likes || 0}
                    </button>
                    <button>
                        <i class="fas fa-reply"></i> 回复
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

async function submitComment() {
    const content = document.getElementById('commentContent').value.trim();
    
    if (!content) {
        showNotification('评论内容不能为空哦~', 'error');
        return;
    }

    try {
        const response = await fetch('/api/comments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content })
        });

        const result = await response.json();

        if (response.ok) {
            showNotification('评论发布成功！💕', 'success');
            document.getElementById('commentContent').value = '';
            document.getElementById('charCount').textContent = '0';
            loadComments();
        } else {
            showNotification(result.error || '发布失败', 'error');
        }
    } catch (error) {
        showNotification('网络错误，请稍后重试', 'error');
    }
}

async function likeComment(commentId) {
    if (!currentUser) {
        showNotification('请先登录后再点赞~', 'info');
        showLoginModal();
        return;
    }

    try {
        const response = await fetch(`/api/comments/${commentId}/like`, {
            method: 'POST'
        });

        const result = await response.json();

        if (response.ok) {
            loadComments(); // 刷新评论列表
            if (result.liked) {
                showNotification('点赞成功！💕', 'success');
            }
        }
    } catch (error) {
        showNotification('操作失败', 'error');
    }
}

// ============ 工具函数 ============
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    // 小于1分钟
    if (diff < 60000) {
        return '刚刚';
    }
    // 小于1小时
    if (diff < 3600000) {
        return Math.floor(diff / 60000) + '分钟前';
    }
    // 小于24小时
    if (diff < 86400000) {
        return Math.floor(diff / 3600000) + '小时前';
    }
    // 小于7天
    if (diff < 604800000) {
        return Math.floor(diff / 86400000) + '天前';
    }
    
    return date.toLocaleDateString('zh-CN');
}

// ============ 通知系统 ============
function showNotification(message, type = 'info') {
    // 移除已有通知
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-icon">
            ${type === 'success' ? '✅' : type === 'error' ? '❌' : '💕'}
        </span>
        <span class="notification-text">${message}</span>
    `;

    // 添加样式
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: white;
        padding: 15px 25px;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        border-left: 4px solid ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#ff6b9d'};
    `;

    document.body.appendChild(notification);

    // 3秒后自动消失
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
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