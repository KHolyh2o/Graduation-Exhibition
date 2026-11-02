// 전 페이지 글자 크기 +2pt — sha_copy/js/common.js 의 "GLOBAL FONT SIZE +2pt" 이식.
// 디자이너는 런타임에 CSS 를 고쳐 쓰지만, React 는 빌드할 때 한 번에 바꿔서 깜빡임이 없다.
// 새 CSS 를 쓸 때는 평소처럼 font-size 를 적으면 자동으로 +2pt 가 더해진다 (여기서 또 더하지 말 것).
const KEYWORDS = /^(inherit|initial|unset|revert|revert-layer|larger|smaller|xx-small|x-small|small|medium|large|x-large|xx-large|xxx-large)$/i;

const fontPlusTwoPt = () => ({
  postcssPlugin: 'font-plus-two-pt',
  Once(root) {
    root.walkDecls('font-size', (decl) => {
      const value = decl.value.trim();
      if (!value || KEYWORDS.test(value)) return;
      decl.value = value === '0' ? '2pt' : `calc(${value} + 2pt)`;
    });
  },
});
fontPlusTwoPt.postcss = true;

export default {
  plugins: [fontPlusTwoPt()],
};
