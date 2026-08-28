import { readFile, readdir } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';

const root = process.cwd();
const sourceRoot = join(root, 'src');
const canonicalFile = join(sourceRoot, 'lib', 'external-links.ts');
const canonicalUrl = 'https://pf.kakao.com/_mWxcMb/chat';
const forbiddenPatterns = [
  /app\.tryangle-official\.co\.kr\/go\/kakao/i,
  /https?:\/\/pf\.kakao\.com/i,
];

async function sourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return ['.ts', '.tsx', '.js', '.jsx', '.mjs'].includes(extname(entry.name)) ? [path] : [];
  }));
  return nested.flat();
}

const canonicalSource = await readFile(canonicalFile, 'utf8');
if (!canonicalSource.includes(`'${canonicalUrl}'`)) {
  throw new Error(`카카오 고유 주소가 변경되었습니다. 반드시 운영자 승인 후 수정하세요: ${canonicalUrl}`);
}

const violations = [];
for (const file of await sourceFiles(sourceRoot)) {
  if (file === canonicalFile) continue;
  const content = await readFile(file, 'utf8');
  if (forbiddenPatterns.some((pattern) => pattern.test(content))) {
    violations.push(relative(root, file));
  }
}

if (violations.length > 0) {
  throw new Error(
    `카카오 주소를 직접 작성하거나 중간 추적 주소를 사용한 파일이 있습니다:\n- ${violations.join('\n- ')}\n` +
    'src/lib/external-links.ts의 KAKAO_CHANNEL_CHAT_URL을 사용하세요.',
  );
}

console.log(`카카오 링크 검사 통과: ${canonicalUrl}`);
