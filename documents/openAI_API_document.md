# openAI API documents

### React, Node.js, Express, Mongoose, 그리고 OpenAI API를 사용한 AI 챗봇을 만들기

1. 초기 프로젝트 설정
    - React 앱 생성 (create-react-app)
    - Node.js 및 Express로 백엔드 서버 구축
    - Mongoose를 사용하여 MongoDB 데이터베이스 설정
2. OpenAI API 사용하기   ← 여기부터 실행
    - OpenAI API 키 얻기: 먼저 OpenAI 사이트에 가입하고 인증 키를 받기
    - API 호출을 위한 Node.js 코드 작성: API 문서를 참조하여 백엔드 서버에 연결 기능을 구현
3. 프론트엔드 React 채팅 인터페이스 생성
    - React 컴포넌트를 사용하여 채팅 인터페이스를 구성 (채팅창, 메시지 입력창, 대화 목록)
    - React 컴포넌트 간의 상태 관리를 위해 useState, useContext, useReducer 또는 Redux와 같은 상태 관리 라이브러리를 사용(useState 사용, 추후 Redux로 개선하기)
4. Node.js 및 Mongoose로 DB와 의사소통
    - 백엔드와 프론트엔드 간 통신을 설정하고 필요에 따라 데이터를 저장하거나 가져올 때 Mongoose를 사용. Mongoose를 사용하여 사용자 프로필, 대화 목록과 기록 등과 같은 정보를 저장하고 검색
5. 채팅 및 AI 응답 로직 구현
    - 사용자가 메시지를 작성하면 React에서 Node.js Express 백엔드로 메시지를 전송
    - 백엔드에서는 메시지와 함께 작성된 모델을 사용하여 OpenAI API를 호출하고, 응답을 프론트엔드로 반환