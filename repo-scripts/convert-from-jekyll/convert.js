// A quick-and-dirty script to assist in converting markdown files from our
// old Jekyll sites to files ready for Docusaurus.

const glob = require('glob');
const path = require('path');
const fs = require('fs');

const argv = process.argv.slice(2);
const folder = argv[0];

const files = glob.sync(`${folder}/**/*.md`);

for (let file of files) {
    console.log(file);
    convert(file);
    console.log();
}

function convert(file) {
    let content = fs.readFileSync(file, 'utf8');
    content = replaceJekyllLinks(content);
    content = cleanFrontMatter(content);
    content = convertStyles(content);
    fs.writeFileSync(file, content, 'utf8');
}

// Replace Liquid-style links like:
//
//   [help]({% link pages/help.md %})
//
// Into standard relative path links:
//
//   [help](../help)
//
function replaceJekyllLinks(content) {
    return content.replace(/\{% link pages\/(.+?)\.md %\}/g, (match, link) => {
        link = `docs/${link}`;
        link = path.relative(path.join(file, '..'), link);
        return link;
    });
}

// Replace or delete common frontmatter elements that aren't
// supported by Docusaurus.
//
function cleanFrontMatter(content) {
    let lines = content.split(/\r?\n/);
    let frontMatterStarted = false;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        if (line.startsWith('---')) {
            if (frontMatterStarted) break;
            frontMatterStarted = true;
        } else if (line.startsWith('navigation_source:')) {
            lines.splice(i--, 1);
        } else if (line.startsWith('layout:')) {
            lines.splice(i--, 1);
        }
    }

    return lines.join('\n');
}

// Convert "HTML" styles attributes into "MDX" (React) styles attributes.
//
// Works for most simple inline styles but it is regex-based, so review
// the output for issues. This is intended only as a first-pass; ideally
// remaining styles should be sucked out into custom.css or into a
// React component with styles.
//
// Input:
//
//   <div style="width:300px; background-color: blue">
//
// Output:
//
//   <div style={{ width: "300px", backgroundColor: "blue" }}>
//
function convertStyles(content) {
    return content.replace(/style=(".+?")/g, (match, style) => {
        let components = style.slice(1, -1).split(/;\W*/);
        let obj = {};

        for (let component of components) {
            let [key, value] = component.split(/:\W*/);
            if (!key || !value) continue;
            key = key.replace(/(-[a-z])/g, (match, slug) => {
                return slug[1].toUpperCase();
            });
            obj[key] = value;
        }

        let props = Object.entries(obj).map(([key, value]) => `${key}: "${value}"`).join(', ');
        return `style={{ ${props} }}`;
    });
}
