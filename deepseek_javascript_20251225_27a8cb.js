// DOM 요소
const loginModal = document.getElementById('loginModal');
const adminModal = document.getElementById('adminModal');
const mainContent = document.getElementById('mainContent');
const nicknameInput = document.getElementById('nickname');
const guestLoginBtn = document.getElementById('guestLoginBtn');
const adminLoginLink = document.getElementById('adminLoginLink');
const adminPasswordInput = document.getElementById('adminPassword');
const adminLoginBtn = document.getElementById('adminLoginBtn');
const adminCancelBtn = document.getElementById('adminCancelBtn');
const currentUserSpan = document.getElementById('currentUser');
const logoutBtn = document.getElementById('logoutBtn');
const adminPageLink = document.getElementById('adminPageLink');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const postList = document.getElementById('postList');
const totalPostsSpan = document.getElementById('totalPosts');
const postForm = document.getElementById('postForm');
const postTitleInput = document.getElementById('postTitle');
const postContentInput = document.getElementById('postContent');
const postCodeInput = document.getElementById('postCode');
const codeLanguageSelect = document.getElementById('codeLanguage');
const gotoAdminBtn = document.getElementById('gotoAdminBtn');

// 블로그 상태 관리
const state = {
    currentUser: null,
    isAdmin: false,
    usedNicknames: new Set(),
    posts: []
};

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function() {
    initBlog();
});

// 블로그 초기화
function initBlog() {
    // 로컬 스토리지에서 데이터 로드
    loadDataFromStorage();
    
    // 현재 사용자 확인
    const savedUser = localStorage.getItem('codit_currentUser');
    const savedIsAdmin = localStorage.getItem('codit_isAdmin') === 'true';
    
    if (savedUser) {
        state.currentUser = savedUser;
        state.isAdmin = savedIsAdmin;
        showMainContent();
    } else {
        showLoginModal();
    }
    
    // 이벤트 리스너 설정
    setupEventListeners();
    
    // 게시글 목록 렌더링
    renderPostList();
}

// 데이터 로드
function loadDataFromStorage() {
    // 게시글 로드
    const savedPosts = localStorage.getItem('codit_posts');
    if (savedPosts) {
        state.posts = JSON.parse(savedPosts);
    }
    
    // 사용된 닉네임 로드
    const savedNicknames = localStorage.getItem('codit_usedNicknames');
    if (savedNicknames) {
        state.usedNicknames = new Set(JSON.parse(savedNicknames));
    }
}

// 데이터 저장
function saveDataToStorage() {
    localStorage.setItem('codit_posts', JSON.stringify(state.posts));
    localStorage.setItem('codit_usedNicknames', JSON.stringify([...state.usedNicknames]));
    
    if (state.currentUser) {
        localStorage.setItem('codit_currentUser', state.currentUser);
        localStorage.setItem('codit_isAdmin', state.isAdmin);
    }
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 게스트 로그인
    guestLoginBtn.addEventListener('click', handleGuestLogin);
    
    // 관리자 로그인 링크
    adminLoginLink.addEventListener('click', function(e) {
        e.preventDefault();
        showAdminLoginModal();
    });
    
    // 관리자 로그인
    adminLoginBtn.addEventListener('click', handleAdminLogin);
    
    // 관리자 로그인 취소
    adminCancelBtn.addEventListener('click', function() {
        hideAdminLoginModal();
    });
    
    // 로그아웃
    logoutBtn.addEventListener('click', handleLogout);
    
    // 네비게이션
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            switchSection(targetId);
            
            // 활성화된 링크 업데이트
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // 게시글 폼 제출
    postForm.addEventListener('submit', handlePostSubmit);
    
    // 관리자 페이지로 이동
    if (gotoAdminBtn) {
        gotoAdminBtn.addEventListener('click', function() {
            window.location.href = 'admin.html';
        });
    }
    
    // 엔터 키로 로그인
    nicknameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleGuestLogin();
        }
    });
    
    adminPasswordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleAdminLogin();
        }
    });
    
    // 코드 언어 변경 시 UI 업데이트
    codeLanguageSelect.addEventListener('change', updateCodeLanguage);
}

// 게스트 로그인 처리
function handleGuestLogin() {
    const nickname = nicknameInput.value.trim();
    const nicknameError = document.getElementById('nicknameError');
    
    // 유효성 검사
    if (!nickname) {
        nicknameError.textContent = '닉네임을 입력해주세요.';
        return;
    }
    
    if (nickname.length > 10) {
        nicknameError.textContent = '닉네임은 최대 10자까지 입력 가능합니다.';
        return;
    }
    
    // 중복 닉네임 확인
    if (state.usedNicknames.has(nickname)) {
        nicknameError.textContent = '이미 사용 중인 닉네임입니다. 다른 닉네임을 선택해주세요.';
        return;
    }
    
    // 로그인 성공
    state.currentUser = nickname;
    state.usedNicknames.add(nickname);
    state.isAdmin = false;
    
    // 데이터 저장
    saveDataToStorage();
    
    // 메인 화면 표시
    showMainContent();
}

// 관리자 로그인 처리
function handleAdminLogin() {
    const password = adminPasswordInput.value;
    const adminError = document.getElementById('adminError');
    
    if (password === '1234') {
        // 관리자 로그인 성공
        state.currentUser = '관리자';
        state.isAdmin = true;
        
        // 데이터 저장
        saveDataToStorage();
        
        // 메인 화면 표시
        hideAdminLoginModal();
        showMainContent();
    } else {
        adminError.textContent = '비밀번호가 일치하지 않습니다.';
    }
}

// 로그아웃 처리
function handleLogout() {
    // 사용자 정보 초기화
    state.currentUser = null;
    state.isAdmin = false;
    
    // 로컬 스토리지에서 사용자 정보만 삭제
    localStorage.removeItem('codit_currentUser');
    localStorage.removeItem('codit_isAdmin');
    
    // 로그인 모달 표시
    showLoginModal();
}

// 게시글 제출 처리
function handlePostSubmit(e) {
    e.preventDefault();
    
    const title = postTitleInput.value.trim();
    const content = postContentInput.value.trim();
    const code = postCodeInput.value.trim();
    const language = codeLanguageSelect.value;
    
    const titleError = document.getElementById('titleError');
    const contentError = document.getElementById('contentError');
    
    let isValid = true;
    
    // 제목 검증
    if (!title) {
        titleError.textContent = '제목을 입력해주세요.';
        isValid = false;
    } else {
        titleError.textContent = '';
    }
    
    // 내용 검증
    if (!content) {
        contentError.textContent = '내용을 입력해주세요.';
        isValid = false;
    } else {
        contentError.textContent = '';
    }
    
    if (!isValid) return;
    
    // 새 게시글 생성
    const newPost = {
        id: Date.now(), // 고유 ID로 타임스탬프 사용
        title: title,
        content: content,
        code: code,
        language: language,
        author: state.currentUser,
        date: new Date().toISOString(),
        isAdmin: state.isAdmin
    };
    
    // 게시글 목록에 추가
    state.posts.unshift(newPost);
    
    // 데이터 저장
    saveDataToStorage();
    
    // 폼 초기화
    postForm.reset();
    codeLanguageSelect.value = 'javascript';
    updateCodeLanguage();
    
    // 게시글 목록으로 이동
    switchSection('posts');
    navLinks.forEach(navLink => navLink.classList.remove('active'));
    document.querySelector('a[href="#posts"]').classList.add('active');
    
    // 게시글 목록 업데이트
    renderPostList();
    
    // 성공 메시지
    alert('게시글이 성공적으로 등록되었습니다!');
}

// 게시글 목록 렌더링
function renderPostList() {
    if (state.posts.length === 0) {
        postList.innerHTML = `
            <div class="post-item empty-state">
                <h3>아직 게시글이 없습니다.</h3>
                <p>첫 번째 게시글을 작성해보세요!</p>
            </div>
        `;
        totalPostsSpan.textContent = '0';
        return;
    }
    
    // 게시글 목록 HTML 생성
    let postsHTML = '';
    
    state.posts.forEach(post => {
        const postDate = new Date(post.date);
        const formattedDate = `${postDate.getFullYear()}.${(postDate.getMonth()+1).toString().padStart(2, '0')}.${postDate.getDate().toString().padStart(2, '0')}`;
        
        // 내용 미리보기 (200자 제한)
        const contentPreview = post.content.length > 200 ? 
            post.content.substring(0, 200) + '...' : post.content;
        
        postsHTML += `
            <div class="post-item" data-id="${post.id}">
                <div class="post-header">
                    <div>
                        <h3 class="post-title">${escapeHtml(post.title)}</h3>
                        <div class="post-meta">
                            <span><i class="fas fa-user"></i> ${escapeHtml(post.author)}</span>
                            <span><i class="fas fa-calendar"></i> ${formattedDate}</span>
                            ${post.language && post.code ? `<span><i class="fas fa-code"></i> ${post.language.toUpperCase()}</span>` : ''}
                        </div>
                    </div>
                </div>
                <div class="post-content">
                    <div class="post-content-preview">${escapeHtml(contentPreview)}</div>
                </div>
                ${post.code ? `
                <div class="code-block">
                    <div class="code-header">
                        <span>${post.language.toUpperCase()}</span>
                        <button class="btn-small copy-code-btn" data-code="${escapeHtml(post.code)}">
                            <i class="fas fa-copy"></i> 복사
                        </button>
                    </div>
                    <pre><code>${escapeHtml(post.code)}</code></pre>
                </div>
                ` : ''}
                <div class="post-actions">
                    ${state.isAdmin ? `<button class="btn-small delete-post-btn" data-id="${post.id}"><i class="fas fa-trash"></i> 삭제</button>` : ''}
                </div>
            </div>
        `;
    });
    
    postList.innerHTML = postsHTML;
    totalPostsSpan.textContent = state.posts.length;
    
    // 코드 복사 버튼 이벤트 추가
    document.querySelectorAll('.copy-code-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const code = this.getAttribute('data-code');
            copyToClipboard(code);
            alert('코드가 클립보드에 복사되었습니다!');
        });
    });
    
    // 관리자 삭제 버튼 이벤트 추가
    if (state.isAdmin) {
        document.querySelectorAll('.delete-post-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const postId = parseInt(this.getAttribute('data-id'));
                if (confirm('정말 이 게시글을 삭제하시겠습니까?')) {
                    deletePost(postId);
                }
            });
        });
    }
}

// 게시글 삭제
function deletePost(postId) {
    state.posts = state.posts.filter(post => post.id !== postId);
    saveDataToStorage();
    renderPostList();
}

// 코드 언어 업데이트
function updateCodeLanguage() {
    const language = codeLanguageSelect.value;
    const codeHeader = document.querySelector('.code-header');
    if (codeHeader) {
        codeHeader.querySelector('span').textContent = language.toUpperCase();
    }
}

// 섹션 전환
function switchSection(sectionId) {
    sections.forEach(section => {
        if (section.id === sectionId) {
            section.classList.remove('hidden');
        } else {
            section.classList.add('hidden');
        }
    });
}

// 모달 표시/숨기기
function showLoginModal() {
    loginModal.classList.remove('hidden');
    mainContent.classList.add('hidden');
    nicknameInput.focus();
}

function showMainContent() {
    loginModal.classList.add('hidden');
    adminModal.classList.add('hidden');
    mainContent.classList.remove('hidden');
    
    // 사용자 정보 업데이트
    currentUserSpan.textContent = state.currentUser;
    
    // 관리자 링크 표시
    if (state.isAdmin) {
        adminPageLink.classList.remove('hidden');
    } else {
        adminPageLink.classList.add('hidden');
    }
    
    // 게시글 목록 렌더링
    renderPostList();
}

function showAdminLoginModal() {
    loginModal.classList.add('hidden');
    adminModal.classList.remove('hidden');
    adminPasswordInput.focus();
    document.getElementById('adminError').textContent = '';
}

function hideAdminLoginModal() {
    adminModal.classList.add('hidden');
    loginModal.classList.remove('hidden');
}

// 유틸리티 함수들
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function copyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
}

// 코드 언어에 따른 클래스 추가 (하이라이팅 용)
function getCodeLanguageClass(language) {
    const languageMap = {
        'javascript': 'language-js',
        'python': 'language-py',
        'html': 'language-html',
        'css': 'language-css',
        'java': 'language-java',
        'cpp': 'language-cpp',
        'plaintext': 'language-plaintext'
    };
    
    return languageMap[language] || 'language-plaintext';
}