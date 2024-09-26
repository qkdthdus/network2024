/*
	Dimension by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$footer = $('#footer'),
		$main = $('#main'),
		$main_articles = $main.children('article');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Fix: Flexbox min-height bug on IE.
		if (browser.name == 'ie') {

			var flexboxFixTimeoutId;

			$window.on('resize.flexbox-fix', function() {

				clearTimeout(flexboxFixTimeoutId);

				flexboxFixTimeoutId = setTimeout(function() {

					if ($wrapper.prop('scrollHeight') > $window.height())
						$wrapper.css('height', 'auto');
					else
						$wrapper.css('height', '100vh');

				}, 250);

			}).triggerHandler('resize.flexbox-fix');

		}

	// Nav.
		var $nav = $header.children('nav'),
			$nav_li = $nav.find('li');

		// Add "middle" alignment classes if we're dealing with an even number of items.
			if ($nav_li.length % 2 == 0) {

				$nav.addClass('use-middle');
				$nav_li.eq( ($nav_li.length / 2) ).addClass('is-middle');

			}

	// Main.
		var	delay = 325,
			locked = false;

		// Methods.
			$main._show = function(id, initial) {

				var $article = $main_articles.filter('#' + id);

				// No such article? Bail.
					if ($article.length == 0)
						return;

				// Handle lock.

					// Already locked? Speed through "show" steps w/o delays.
						if (locked || (typeof initial != 'undefined' && initial === true)) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Mark as visible.
								$body.addClass('is-article-visible');

							// Deactivate all articles (just in case one's already active).
								$main_articles.removeClass('active');

							// Hide header, footer.
								$header.hide();
								$footer.hide();

							// Show main, article.
								$main.show();
								$article.show();

							// Activate article.
								$article.addClass('active');

							// Unlock.
								locked = false;

							// Unmark as switching.
								setTimeout(function() {
									$body.removeClass('is-switching');
								}, (initial ? 1000 : 0));

							return;

						}

					// Lock.
						locked = true;

				// Article already visible? Just swap articles.
					if ($body.hasClass('is-article-visible')) {

						// Deactivate current article.
							var $currentArticle = $main_articles.filter('.active');

							$currentArticle.removeClass('active');

						// Show article.
							setTimeout(function() {

								// Hide current article.
									$currentArticle.hide();

								// Show article.
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

				// Otherwise, handle as normal.
					else {

						// Mark as visible.
							$body
								.addClass('is-article-visible');

						// Show article.
							setTimeout(function() {

								// Hide header, footer.
									$header.hide();
									$footer.hide();

								// Show main, article.
									$main.show();
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

			};

			$main._hide = function(addState) {

				var $article = $main_articles.filter('.active');

				// Article not visible? Bail.
					if (!$body.hasClass('is-article-visible'))
						return;

				// Add state?
					if (typeof addState != 'undefined'
					&&	addState === true)
						history.pushState(null, null, '#');

				// Handle lock.

					// Already locked? Speed through "hide" steps w/o delays.
						if (locked) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Deactivate article.
								$article.removeClass('active');

							// Hide article, main.
								$article.hide();
								$main.hide();

							// Show footer, header.
								$footer.show();
								$header.show();

							// Unmark as visible.
								$body.removeClass('is-article-visible');

							// Unlock.
								locked = false;

							// Unmark as switching.
								$body.removeClass('is-switching');

							// Window stuff.
								$window
									.scrollTop(0)
									.triggerHandler('resize.flexbox-fix');

							return;

						}

					// Lock.
						locked = true;

				// Deactivate article.
					$article.removeClass('active');

				// Hide article.
					setTimeout(function() {

						// Hide article, main.
							$article.hide();
							$main.hide();

						// Show footer, header.
							$footer.show();
							$header.show();

						// Unmark as visible.
							setTimeout(function() {

								$body.removeClass('is-article-visible');

								// Window stuff.
									$window
										.scrollTop(0)
										.triggerHandler('resize.flexbox-fix');

								// Unlock.
									setTimeout(function() {
										locked = false;
									}, delay);

							}, 25);

					}, delay);


			};

		// Articles.
			$main_articles.each(function() {

				var $this = $(this);

				// Close.
					$('<div class="close">Close</div>')
						.appendTo($this)
						.on('click', function() {
							location.hash = '';
						});

				// Prevent clicks from inside article from bubbling.
					$this.on('click', function(event) {
						event.stopPropagation();
					});

			});

		// Events.
			$body.on('click', function(event) {

				// Article visible? Hide.
					if ($body.hasClass('is-article-visible'))
						$main._hide(true);

			});

			$window.on('keyup', function(event) {

				switch (event.keyCode) {

					case 27:

						// Article visible? Hide.
							if ($body.hasClass('is-article-visible'))
								$main._hide(true);

						break;

					default:
						break;

				}

			});

			$window.on('hashchange', function(event) {

				// Empty hash?
					if (location.hash == ''
					||	location.hash == '#') {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Hide.
							$main._hide();

					}

				// Otherwise, check for a matching article.
					else if ($main_articles.filter(location.hash).length > 0) {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Show article.
							$main._show(location.hash.substr(1));

					}

			});

		// Scroll restoration.
		// This prevents the page from scrolling back to the top on a hashchange.
			if ('scrollRestoration' in history)
				history.scrollRestoration = 'manual';
			else {

				var	oldScrollPos = 0,
					scrollPos = 0,
					$htmlbody = $('html,body');

				$window
					.on('scroll', function() {

						oldScrollPos = scrollPos;
						scrollPos = $htmlbody.scrollTop();

					})
					.on('hashchange', function() {
						$window.scrollTop(oldScrollPos);
					});

			}

		// Initialize.

			// Hide main, articles.
				$main.hide();
				$main_articles.hide();

			// Initial article.
				if (location.hash != ''
				&&	location.hash != '#')
					$window.on('load', function() {
						$main._show(location.hash.substr(1), true);
					});

})(jQuery);

// 모달 열기
document.getElementById('openModal').onclick = function() {
	document.getElementById('myModal').style.display = 'flex';
	centerModal();
}

// 모달 닫기
function closeModal() {
const modal = document.getElementById('myModal');
if (modal) {
	modal.classList.add('fade-out');
	setTimeout(() => {
		modal.style.display = 'none'; // 모달을 숨김
		modal.classList.remove('fade-out'); // 애니메이션 클래스 제거
	}, 300); // 애니메이션 시간과 일치시킴
}
}

// 모달 외부 클릭 시 닫기
window.onclick = function(event) {
if (event.target === document.getElementById('myModal')) {
	closeModal();
}
}
// 모달을 화면 중앙에 위치시키는 함수
function centerModal() {
	const modal = document.getElementById('myModal');
	const modalContent = document.querySelector('.modal-content');

	// 모달이 열렸을 때 화면 스크롤을 조정
	const rect = modalContent.getBoundingClientRect();
	const scrollY = window.scrollY;
	const top = rect.top + scrollY;
	const height = window.innerHeight;
	const modalHeight = modalContent.offsetHeight;

	if (top + modalHeight / 2 > height / 2) {
		window.scrollTo({
			top: top - height / 2 + modalHeight / 2,
			behavior: 'smooth'
		});
	}
}


// 새로운 모달 요소들 선택
var modalNew = document.getElementById("modalNew");
var closeNew = document.getElementsByClassName("close-new")[0];
var modalVideoNew = document.getElementById("modalVideoNew");
var modalTitleNew = document.getElementById("gameTitle"); // 게임 이름을 표시할 요소

// elden ring 링크 클릭 이벤트
document.getElementById("openModalNew").addEventListener("click", function(e) {
	e.preventDefault();
	modalNew.style.display = "flex"; // 모달 표시
	modalTitleNew.textContent = "Elden Ring"; // 게임 이름 업데이트
	modalVideoNew.src = "https://video.akamai.steamstatic.com/store_trailers/256889456/movie480_vp9.webm?t=1654109241"; // 동영상 링크 추가
});

// 'There Is No Game' 링크 클릭 이벤트
document.getElementById("openModalNew2").addEventListener("click", function(e) {
	e.preventDefault();
	modalNew.style.display = "flex"; // 모달 표시
	modalTitleNew.textContent = "There Is No Game: Wrong Dimension"; // 게임 이름 업데이트
	modalVideoNew.src = "https://video.steamstatic.com/store_trailers/256793611/movie480.mp4?t=1595513367"; // 동영상 링크 추가
});

// 'Little Nightmare' 링크 클릭 이벤트
document.getElementById("openModalNew3").addEventListener("click", function(e) {
	e.preventDefault();
	modalNew.style.display = "flex"; // 모달 표시
	modalTitleNew.textContent = "Little Nightmare"; // 게임 이름 업데이트
	modalVideoNew.src = "https://video.akamai.steamstatic.com/store_trailers/256697666/movie480.webm?t=1507652098"; // 동영상 링크 추가
});

// 모달 닫기 이벤트
closeNew.onclick = function() {
	modalNew.style.display = "none";
	modalVideoNew.src = ""; // 모달을 닫을 때 비디오 재생 중지
}

// 모달 외부 클릭 시 닫기
window.onclick = function(event) {
	if (event.target == modalNew) {
		modalNew.style.display = "none";
		modalVideoNew.src = ""; // 모달을 닫을 때 비디오 재생 중지
	}
}

/// 문장 배열
const messages = [
	"🎉짜잔🎉",
    "\\(˵ ͡~ ͜ʖ ͡°˵)너무 귀엽지 않나요(˵ ͡~ ͜ʖ ͡°˵)ﾉ",
    "강아지 자랑하고 싶어서 만든 페이지 입니다.◠ ̫◠",
	"저희집 귀염둥이 앙쥬를 소개합니다!",
    "!당신은 행운의 앙쥬를 만났습니다!ଘ(੭ꆤᴗꆤ)━☆ﾟ.*･"
];

// 팝업 엘리먼트 가져오기
const popup = document.getElementById('popup');
const article = document.getElementById('ANGE');

// 현재 문장 인덱스 초기화
let currentMessageIndex = 0;
let popupInterval = null; // 팝업 타이머를 저장할 변수

// 팝업 표시 함수
function showPopup() {
	// URL 확인
	if (!shouldShowPopup()) {
		clearTimeout(popupInterval);
		popup.classList.remove('show');
		return;
	}

	// 현재 문장 설정
	popup.textContent = messages[currentMessageIndex];
	
	// 팝업 보이게 함
	popup.classList.add('show');

	// 일정 시간 후 팝업 숨기기
	setTimeout(hidePopup, 3000); // 3초 후 팝업 숨기기
}

// 팝업 숨기기 함수
function hidePopup() {
	// 팝업 숨김
	popup.classList.remove('show');
	
	// 다음 문장으로 넘어가기
	currentMessageIndex = (currentMessageIndex + 1) % messages.length; // 문장 배열 루프
	
	// 팝업을 숨기고 나서 일정 시간 후에 다시 팝업 표시
	popupInterval = setTimeout(showPopup, 1000); // 1초 후 다음 팝업 표시
}

// 팝업을 표시할지 여부를 확인하는 함수
function shouldShowPopup() {
	const currentUrl = window.location.hash; // 현재 URL 해시 가져오기
	return currentUrl === '#ANGE'; // URL 해시가 '#ANGE'인 경우만 팝업 표시
}

// 팝업 표시 로직을 조건에 맞게 실행
function checkAndShowPopup() {
	if (shouldShowPopup() && article) {
		// 첫 번째 팝업 표시
		showPopup();
	}
}

// 페이지 로드 시 팝업 체크
window.addEventListener('load', checkAndShowPopup);

// URL 변경 시 팝업 체크 (예: SPA 환경)
window.addEventListener('popstate', checkAndShowPopup);

// 아티클의 상태를 감지하여 팝업을 멈추거나 재시작
function observeArticle() {
	const observer = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
				// 아티클이 숨겨졌다면 팝업 멈추기
				if (window.getComputedStyle(article).display === 'none') {
					clearTimeout(popupInterval);
					popup.classList.remove('show');
				} else {
					checkAndShowPopup();
				}
			}
		});
	});
	
	// 아티클의 style 속성 변경 감지
	observer.observe(article, { attributes: true });
}

// 페이지가 로드될 때 아티클 관찰 시작
window.addEventListener('load', observeArticle);

// 링크 클릭 시 팝업 제어
document.querySelectorAll('ul li a').forEach(link => {
	link.addEventListener('click', (event) => {
		const href = event.target.getAttribute('href');
		// 링크 클릭 시 URL 확인 및 팝업 제어
		if (href !== '#ANGE') {
			clearTimeout(popupInterval);
			popup.classList.remove('show');
		}
	});
});
