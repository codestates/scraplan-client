module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    // Typescript 를 파싱하기 위해 사용
    'prettier',
    'only-warn',
    // 경고만 뜨도록 설정
  ],
  extends: [
    'plugin:react/recommended',
    // @eslint-plugin-react 의 규칙을 사용한다.
    'plugin:@typescript-eslint/recommended',
    // @typescript-eslint/eslint-plugin 의 규칙을 사용한다.
    'prettier',
    // @typescript-eslint/eslint-plugin의 규칙들 중 prettier와 충돌하는 규칙을 비활성
    'plugin:prettier/recommended',
    // eslint-plugin-prettier와 eslint-config-prettier를 활성화한다. prettier 에러를 eslint 에러로 표시해 줄 것이다.
    // 이 설정은 반드시 extends 배열의 마지막 값이어야 한다.
  ],
  rules: {},
};
