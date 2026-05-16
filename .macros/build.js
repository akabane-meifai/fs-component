// Name: ビルド
// Permissions: env stat read write

const files = await Editor.getFiles();
const getHTML = path => Editor.fileGetContents(path).then(f => new Blob([f], {type: 'text/html'}).text());
const index = await getHTML('/src/index.html');
const componentsHTML = [];
const appJS = [];
const scriptPattern = /<script(?:\s.*?)?>(.*?)<\/script>/mgs;
for (const componentFile of files) {
  if (!componentFile.startsWith('/src/components/') || !componentFile.endsWith('.html')) {
    continue;
  }
  const tagName = componentFile.slice(16, -5);
  Editor.log(`${tagName}を読込中`);
  const component = await getHTML(componentFile);
  const matches = Array.from(component.matchAll(scriptPattern), i => "{\n" + i.at(1).trim() + "\n}");
  componentsHTML.push(`<template id="${tagName}">` + "\n" + component.replaceAll(scriptPattern, '').trim() + "\n</template>\n");
  appJS.push(...matches);
}
Editor.log("app.jsを書込中");
Editor.filePutContents('/dist/app.js', appJS.join("\n"));
Editor.log("index.htmlを書込中");
Editor.filePutContents('/dist/index.html', index.replace('<%APP_JS%>', `<script src="app.js?version=${Editor.env.VERSION}"></script>`).replace('<%COMPONENTS%>', componentsHTML.join("") + '<script src="components_init.js"></script>'));
Editor.info("ビルド完了");
