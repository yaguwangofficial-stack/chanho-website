# Chanho Park 개인 사이트 (2트랙 + 숨김 어드민)

미리보기: https://claude.ai/artifact/5NC2srHpJ7xVE6BD4P5bbn (비공개. 오른쪽 아래 빨간 버튼으로 어드민 미리보기)

## 구조
- `index.html` 첫 화면 팝업: "Get to know me" / "Work with me"
  - `주소#me` 개인 페이지: 지금 하는 것, 소셜 링크, 버킷리스트(The list), 프로모션 코드, 최신 영상
  - `주소#work` 브랜드 페이지: 숫자 카드, 제공 서비스, 이력(Resume), 포트폴리오, 연락처 + CV 버튼
  - 인스타 바이오엔 기본 주소, 브랜드에게는 `주소#work`를 보내면 팝업 없이 바로 열림
- `content.json` 사이트의 모든 글, 링크, 순서, 색. 어드민이 이 파일 하나만 고침
- `dugout/` 숨김 어드민 (사이트 어디에도 링크 없음, 검색엔진 차단). 폴더 이름을 바꾸면 주소도 바뀜
- `preview.html` 어드민 미리보기 전용

## 어드민으로 할 수 있는 것
- 섹션 글/링크/사진 수정, 순서 바꾸기(↑↓), 숨기기, 삭제, 새 섹션 추가 (11종류)
- 항목 추가/복제/삭제/순서, 버킷리스트 완료 체크
- 팝업 문구, 프로필 사진, 포인트 색, 제목 글꼴, 밝게/어둡게, 모서리, 폭
- PLACEHOLDER(점선 빨간 칸) = 아직 채워야 할 자리. 글을 고치면 자동으로 풀림. "디자인" 탭에서 한 번에 숨기기 가능
- 바꾼 내용은 바로 미리보기에 보이고 브라우저에 임시저장. "게시하기"를 눌러야 실제 사이트에 반영
- 되돌리기(↶ / Ctrl+Z), 전체 내용 백업 복사/붙여넣기

## 공개하는 방법 (한 번만, 약 10분, 무료)
1. GitHub 로그인 → 새 저장소 만들기 (이름 예: `chanho-website`, Public)
2. 이 `website` 폴더 안의 파일 전부를 저장소에 올리기 (저장소 화면 "Add file → Upload files"에 끌어다 놓기)
   - 또는 Claude에게 저장소 이름만 알려주면 Claude가 올림 (GitHub 연결 필요: https://claude.ai/connect-github)
3. 저장소 Settings → Pages → Source "Deploy from a branch", Branch `main` / `(root)` → Save
   - 1~2분 뒤 주소가 생김: `https://yaguwangofficial-stack.github.io/chanho-website/`
4. 어드민용 토큰 만들기: https://github.com/settings/personal-access-tokens/new
   - Repository access: Only select repositories → `chanho-website`
   - Permissions → Contents: Read and write → Generate
5. `주소/dugout/` 접속 → "게시" 탭 → 저장소(`yaguwangofficial-stack/chanho-website`), 토큰 붙여넣기 → "저장하고 연결 확인"
6. 이후엔 어드민에서 고치고 "게시하기"만 누르면 1분 안에 실제 사이트 반영

선택: 도메인(예: chanhopark.com, 연 1.5만원 정도)을 사서 Pages 설정의 Custom domain에 넣으면 그 주소로 바뀜.

## 보안 메모
- 어드민 주소를 알아도 토큰 없이는 아무것도 못 바꿈. 토큰은 그 기기 브라우저에만 저장됨
- 공용 PC에서는 "이 기기에서 토큰 지우기" 누르기

## 채워야 할 것 (PLACEHOLDER)
TikTok 아이디/링크, YouTube(없으면 숨기기), "Day __ of 100", 프로모션 코드, 최신 영상 링크/썸네일,
요금(Rates), DoubleDay·@wolhyu·@yaguwang 만든 연도, 유학 학교/연도, 포트폴리오 2개, 연락 이메일, CV PDF, 프로필 사진.
숫자 카드(팔로워 933, 30일 조회수 122K)는 11-22 기준이라 브랜드에 보내기 전 업데이트.
