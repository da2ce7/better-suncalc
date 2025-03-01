/**
 * @file tools/expand-exports.tests.ts
 * @description Test suite for export expansion script (updated to match actual code behavior)
 */

import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { Project, SourceFile } from "ts-morph";

const consoleLogMock = jest.spyOn(console, "log").mockImplementation(() => {});
const consoleErrorMock = jest
  .spyOn(console, "error")
  .mockImplementation(() => {});

describe("expand-exports script", () => {
  let project: Project;
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "export-test-"));
    project = new Project({
      useInMemoryFileSystem: true,
      compilerOptions: { outDir: tempDir },
    });
    consoleLogMock.mockClear();
    consoleErrorMock.mockClear();
  });

  afterEach(() => fs.rmSync(tempDir, { recursive: true, force: true }));

  function createSourceFile(filePath: string, content: string): SourceFile {
    return project.createSourceFile(filePath, content);
  }

  function runScript(args: string[] = []) {
    process.argv = ["node", "script.ts", ...args];
    require("./expand-exports");
  }

  test("ignores files without expand_exports variable", () => {
    createSourceFile("src/index.ts", `export * from './module';`);
    runScript();
    expect(consoleLogMock).not.toHaveBeenCalled();
    expect(consoleErrorMock).not.toHaveBeenCalled();
  });

  test("processes files with expand_exports declaration (dry run)", () => {
    createSourceFile("src/module.ts", `export const foo = 1;`);
    const index = createSourceFile(
      "src/index.ts",
      `const expand_exports = ['./module'];\nexport * from './module';`,
    );

    runScript();

    // Verify dry-run messages
    expect(consoleLogMock).toHaveBeenCalledWith(
      expect.stringContaining("Processing"),
    );
    expect(consoleLogMock).toHaveBeenCalledWith(
      expect.stringContaining("Would update"),
    );

    // Verify no actual file changes
    expect(index.getText()).toMatchInlineSnapshot(`
      "const expand_exports = ['./module'];
      export * from './module';"
    `);
  });

  test("transforms exports when --write specified (position preserved)", () => {
    createSourceFile(
      "src/module.ts",
      `export const A = 1; export const B = 2;`,
    );
    const index = createSourceFile(
      "src/index.ts",
      `// Header comment\nconst expand_exports = ['./module'];\n\nexport * from './module';\n\n// Footer comment`,
    );

    runScript(["--write"]);

    // Verify transformation messages
    expect(consoleLogMock).toHaveBeenCalledWith(
      expect.stringContaining("Updated ./module"),
    );

    // Verify ordering and template preservation
    expect(index.getText()).toMatchInlineSnapshot(`
      "// Header comment
      const expand_exports = ['./module'];

      export { A, B } from './module';

      // Footer comment"
    `);
  });

  test("handles multiple exports with correct positioning", () => {
    createSourceFile("src/a.ts", "export const X = 1;");
    createSourceFile("src/b.ts", "export const Y = 2;");
    const index = createSourceFile(
      "src/index.ts",
      `const expand_exports = ['./a', './b'];\n` +
        `export * from './a';\n` +
        `export * as ns from './b';`,
    );

    runScript(["--write"]);

    expect(index.getText()).toMatchInlineSnapshot(`
      "const expand_exports = ['./a', './b'];
      export { X } from './a';
      export { Y } from './b';"
    `);
  });

  test("handles unresolved modules gracefully", () => {
    const index = createSourceFile(
      "src/index.ts",
      `const expand_exports = ['./ghost'];\nexport * from './ghost';`,
    );

    runScript();

    expect(consoleErrorMock).toHaveBeenCalledWith("Unresolved module: ./ghost");
    expect(index.getText()).toMatchInlineSnapshot(`
      "const expand_exports = ['./ghost'];
      export * from './ghost';"
    `);
  });

  test("handles empty exports correctly", () => {
    createSourceFile("src/empty.ts", "export default {};");
    const index = createSourceFile(
      "src/index.ts",
      `const expand_exports = ['./empty'];\nexport * from './empty';`,
    );

    runScript(["--write"]);

    expect(index.getText()).toMatchInlineSnapshot(`
      "const expand_exports = ['./empty'];
      export { } from './empty';"
    `);
  });
});
