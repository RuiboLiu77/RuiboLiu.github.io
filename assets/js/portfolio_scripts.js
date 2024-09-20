// portfolio_scripts.js

function loadPortfolio(language) {
    const fileName = language === 'zh' ? 'assets/data/portfolio_zh.json' : 'assets/data/portfolio_en.json?v=' + new Date().getTime();
    
    fetch(fileName)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok " + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const portfolioContainer = document.getElementById('portfolio-container');
            portfolioContainer.innerHTML = '';

            // 存储作品集数据以供弹出窗口使用
            window.portfolioData = data.projects;
            window.currentImageIndex = 0;

            // 遍历作品集项目
            data.projects.forEach((project, index) => {
                const imageUrl = project.image ? `assets/images/${project.image}` : 'assets/images/placeholder.png'; // 使用占位符图片
                const projectElement = `
                    <div class="portfolio-item" onclick="openModal(${index})">
                        <img src="${imageUrl}" alt="${project.title}">
                        <h4>${project.title}</h4>
                    </div>
                `;
                portfolioContainer.innerHTML += projectElement;
            });
        })
        .catch(error => {
            console.error('Error fetching the portfolio JSON file:', error);
        });
}

// 打开弹出窗口
function openModal(index) {
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modal-image');
    const modalImagesContainer = document.getElementById('modal-images');
    const modalDescription = document.getElementById('modal-description');
    const modalVideoContainer = document.getElementById('modal-video-container');
    const modalVideo = document.getElementById('modal-video');
    const prevButton = document.getElementById('prev-image');
    const nextButton = document.getElementById('next-image');
    
    let toggleMediaButton = document.getElementById('toggle-media');
    if (!toggleMediaButton) {
        toggleMediaButton = document.createElement('button');
        toggleMediaButton.id = 'toggle-media';
        modalDescription.parentNode.insertBefore(toggleMediaButton, modalDescription.nextSibling);
    }

    window.currentImageIndex = index;
    const project = window.portfolioData[index];

    // 初始化
    modalVideoContainer.style.display = 'none';
    modalImagesContainer.style.display = 'none';
    prevButton.style.display = 'none';
    nextButton.style.display = 'none';
    toggleMediaButton.style.display = 'none';

    // 如果项目有视频和图片，显示切换按钮
    if (project.video && project.images && project.images.length > 0) {
        toggleMediaButton.innerText = '查看图片';
        toggleMediaButton.style.display = 'block';

        modalVideoContainer.style.display = 'block';
        modalVideo.src = `assets/videos/${project.video}`;
        modalVideo.load();
        modalVideo.play();

        toggleMediaButton.onclick = function() {
            if (modalVideoContainer.style.display === 'block') {
                modalVideo.pause();
                modalVideoContainer.style.display = 'none';
                modalImagesContainer.style.display = 'block';
                window.currentModalImageIndex = 0;
                const modalImageUrl = `assets/images/${project.images[window.currentModalImageIndex]}`;
                modalImage.src = modalImageUrl;

                if (project.images.length > 1) {
                    prevButton.style.display = 'block';
                    nextButton.style.display = 'block';
                }
                toggleMediaButton.innerText = '查看视频';
            } else {
                modalImagesContainer.style.display = 'none';
                prevButton.style.display = 'none';
                nextButton.style.display = 'none';
                modalVideoContainer.style.display = 'block';
                modalVideo.play();
                toggleMediaButton.innerText = '查看图片';
            }
        };
    } else if (project.video) {
        modalVideoContainer.style.display = 'block';
        modalVideo.src = `assets/videos/${project.video}`;
        modalVideo.load();
        modalVideo.play();
    } else if (project.images && project.images.length > 0) {
        modalImagesContainer.style.display = 'block';
        window.currentModalImageIndex = 0;
        const modalImageUrl = `assets/images/${project.images[window.currentModalImageIndex]}`;
        modalImage.src = modalImageUrl;

        if (project.images.length > 1) {
            prevButton.style.display = 'block';
            nextButton.style.display = 'block';
        }
    } else {
        modalImagesContainer.style.display = 'block';
        modalImage.src = 'assets/images/placeholder.png';
    }

    const formattedDescription = project.description.replace(/\n/g, '<br>');
    modalDescription.innerText = project.description;
    modal.style.display = 'block';

    // **调整弹窗的最大高度和宽度**
    adjustModalSize();
}

// 调整弹窗大小以适应视窗
function adjustModalSize() {
    const modal = document.getElementById('modal');
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // 限制弹窗的高度和宽度
    const maxHeight = Math.min(viewportHeight * 0.9, 600);  // 最大高度为视窗的90%或600px
    const maxWidth = Math.min(viewportWidth * 0.9, 700);    // 最大宽度为视窗的90%或800px

    modal.style.maxHeight = `${maxHeight}px`;
    modal.style.maxWidth = `${maxWidth}px`;
    modal.style.width = `${Math.min(viewportWidth * 0.8, 700)}px`;  // 弹窗宽度不超过80%或700px

    // 确保关闭按钮可见
    const closeButton = document.getElementById('close-modal');
    closeButton.style.right = '15px';
    closeButton.style.top = '10px';
}

// 关闭弹出窗口
function closeModal() {
    const modal = document.getElementById('modal');
    const modalVideo = document.getElementById('modal-video');

    modal.style.display = 'none';

    if (!modalVideo.paused) {
        modalVideo.pause();
    }
    modalVideo.src = '';
}

// 左右翻阅图片
function navigateModal(step) {
    const modalImage = document.getElementById('modal-image');
    const project = window.portfolioData[window.currentImageIndex];

    // 计算新的图片索引
    window.currentModalImageIndex += step;
    if (window.currentModalImageIndex < 0) {
        window.currentModalImageIndex = project.images.length - 1; // 循环到最后一张图片
    } else if (window.currentModalImageIndex >= project.images.length) {
        window.currentModalImageIndex = 0; // 循环到第一张图片
    }

    // 更新图片显示
    const modalImageUrl = `assets/images/${project.images[window.currentModalImageIndex]}`;
    modalImage.src = modalImageUrl;
}

// 初始化语言和tab的切换
function initTabs() {
    const tabResume = document.getElementById('tab-resume');
    const tabPortfolio = document.getElementById('tab-portfolio');
    const resumeContent = document.getElementById('resume-content');
    const portfolioContent = document.getElementById('portfolio-content');

    tabResume.addEventListener('click', function() {
        tabResume.classList.add('active');
        tabPortfolio.classList.remove('active');
        resumeContent.style.display = 'block';
        portfolioContent.style.display = 'none';
    });

    tabPortfolio.addEventListener('click', function() {
        tabPortfolio.classList.add('active');
        tabResume.classList.remove('active');
        resumeContent.style.display = 'none';
        portfolioContent.style.display = 'block';
        loadPortfolio(currentLanguage); // 根据当前语言加载作品集
    });
}

// 默认语言
let currentLanguage = 'zh';

// 监听语言切换事件
document.getElementById('lang-en').addEventListener('click', function() {
    currentLanguage = 'en';
    document.getElementById('tab-resume').innerText = 'Resume';
    document.getElementById('tab-portfolio').innerText = 'Portfolio';
    loadResume('en');
    if (document.getElementById('tab-portfolio').classList.contains('active')) {
        loadPortfolio('en');
    }
    document.getElementById('lang-zh').classList.remove('active');
    document.getElementById('lang-en').classList.add('active');
});

document.getElementById('lang-zh').addEventListener('click', function() {
    currentLanguage = 'zh';
    document.getElementById('tab-resume').innerText = '简历';
    document.getElementById('tab-portfolio').innerText = '作品集';
    loadResume('zh');
    if (document.getElementById('tab-portfolio').classList.contains('active')) {
        loadPortfolio('zh');
    }
    document.getElementById('lang-en').classList.remove('active');
    document.getElementById('lang-zh').classList.add('active');
});

// 关闭弹出窗口按钮
document.getElementById('close-modal').addEventListener('click', closeModal);

// 点击弹窗外部关闭
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target == modal) {
        closeModal();
    }
};

// 导航图片
document.getElementById('prev-image').addEventListener('click', () => navigateModal(-1));
document.getElementById('next-image').addEventListener('click', () => navigateModal(1));

window.onresize = adjustModalSize;  // 当窗口调整大小时，自动调整弹窗大小
