/**
 * @file tools/expand-exports.ts
 * @description Transforms exports to explicit named exports based on file-level annotations, maintaining their original positions.
 */
import { program } from "commander";
import path from "path";
import { ExportDeclaration, Node, Project, SourceFile } from "ts-morph";

// Setup CLI options using commander
program
  .description("Manage export expansions via file annotations")
  .option("--write", "Apply changes (default: dry run)")
  .parse();

const { write: shouldWrite } = program.opts<{ write?: boolean }>();
const project: Project = new Project({ tsConfigFilePath: "tsconfig.json" });

/**
 * Retrieves the list of module paths to expand from the `expand_exports` variable in the source file.
 * @param sourceFile - The source file to inspect.
 * @returns An array of module paths or null if the variable is not found or incorrectly typed.
 */
function getExpandPaths(sourceFile: SourceFile): string[] | null {
  const variable = sourceFile.getVariableDeclaration("expand_exports");
  if (!variable) return null;

  const typeNode = variable.getTypeNode();
  if (typeNode?.getText() !== "string[]") return null;

  const initializer = variable.getInitializer();
  if (!initializer || !Node.isArrayLiteralExpression(initializer)) return null;

  const paths: string[] = [];
  for (const element of initializer.getElements()) {
    if (Node.isStringLiteral(element)) {
      paths.push(element.getLiteralValue());
    } else {
      console.error(
        `Non-string element in expand_exports: ${element.getText()}`,
      );
      return null; // Strict enforcement: return null if any element isn't a string
    }
  }
  return paths.map((p: string) => path.normalize(p).replace(/\\/g, "/"));
}

/**
 * Processes an export declaration by updating it to explicitly list named exports from the module.
 * If `shouldWrite` is true, applies the changes; otherwise, logs the potential changes.
 * @param exportDecl - The export declaration to process.
 * @param shouldWrite - Whether to apply changes or perform a dry run.
 */
function processExport(
  exportDecl: ExportDeclaration,
  shouldWrite: boolean,
): void {
  const modulePath: string | undefined = exportDecl.getModuleSpecifierValue();
  if (!modulePath) return;

  const sourceFile: SourceFile | undefined =
    exportDecl.getModuleSpecifierSourceFile();
  if (!sourceFile) {
    console.error(`Unresolved module: ${modulePath}`);
    return;
  }

  const exports: string[] = Array.from(
    new Set(
      Array.from(sourceFile.getExportedDeclarations().keys()).filter(
        (k: string) => k !== "default",
      ),
    ),
  ).sort();

  if (shouldWrite) {
    exportDecl.set({
      namedExports: exports.map((name: string) => ({ name })),
    });
    console.log(
      `Updated ${modulePath} in ${exportDecl.getSourceFile().getFilePath()}`,
    );
  } else {
    const originalQuote: string = exportDecl.getModuleSpecifier()!.getText()[0];
    const newNamedExports: string = exports.length
      ? `{ ${exports.join(", ")} }`
      : "{}";
    const newStatement: string = `export ${newNamedExports} from ${originalQuote}${modulePath}${originalQuote};`;
    console.log(
      `Would update ${modulePath}:\n  - ${exportDecl.getText()}\n  + ${newStatement}`,
    );
  }
}

/**
 * Processes all index.ts files in the project, updating export declarations based on `expand_exports` annotations.
 * @param shouldWrite - Whether to apply changes or perform a dry run.
 */
function processIndexFiles(shouldWrite: boolean = false): void {
  const sourceFiles: SourceFile[] = project.getSourceFiles("src/**/index.ts");
  sourceFiles.forEach((sourceFile: SourceFile) => {
    const paths: string[] | null = getExpandPaths(sourceFile);
    if (!paths) return;

    let processed: boolean = false;
    paths.forEach((modulePath: string) => {
      sourceFile
        .getExportDeclarations()
        .forEach((exportDecl: ExportDeclaration) => {
          const exportPath: string | undefined =
            exportDecl.getModuleSpecifierValue();
          if (
            exportPath &&
            path.normalize(exportPath).replace(/\\/g, "/") === modulePath
          ) {
            if (!processed) {
              console.log(`Processing ${sourceFile.getFilePath()}`);
              processed = true;
            }
            processExport(exportDecl, shouldWrite);
          }
        });
    });
  });
}

// Execute the processing
processIndexFiles(shouldWrite);

if (shouldWrite) {
  project.saveSync();
  console.log("Changes saved");
} else {
  console.log("Dry run completed");
}
