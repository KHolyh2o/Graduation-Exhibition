// 전 페이지 글자 크기 확대 — sha_copy/js/common.js 의 "GLOBAL FONT SIZE" 와 같은 규칙을 빌드 때 한 번에 적용한다.
//   · 공통 영역(헤더/푸터: .common- / #common- / .site-header / .site-footer 선택자) : +2pt
//   · 그 외 콘텐츠 : +4pt
// 디자이너는 런타임에 CSS 를 고쳐 쓰지만, React 는 빌드 때 바꿔서 깜빡임이 없다.
// 새 CSS 를 쓸 때는 평소처럼 font-size 를 적으면 자동으로 더해진다 (여기서 또 더하지 말 것).
// sha_copy/ 폴더 CSS 는 건드리지 않는다 — 그쪽은 common.js 가 런타임에 직접 더한다(dev 서버로 열어도 이중 적용 방지).
const KEYWORDS = /^(inherit|initial|unset|revert|revert-layer|larger|smaller|xx-small|x-small|small|medium|large|x-large|xx-large|xxx-large)$/i;

const isCommonArea = (selector = '') =>
  selector.includes('.common-') ||
  selector.includes('#common-') ||
  selector.includes('.site-header') ||
  selector.includes('.site-footer');

const fontPlusPt = () => ({
  postcssPlugin: 'font-plus-pt',
  Once(root) {
    if (/[\\/]sha_copy[\\/]/.test(root.source?.input?.file ?? '')) return;
    root.walkDecls('font-size', (decl) => {
      const value = decl.value.trim();
      if (!value || KEYWORDS.test(value)) return;
      const pt = isCommonArea(decl.parent?.selector) ? 2 : 4;
      decl.value = value === '0' ? `${pt}pt` : `calc(${value} + ${pt}pt)`;
    });
  },
});
fontPlusPt.postcss = true;

export default {
  plugins: [fontPlusPt()],
};
