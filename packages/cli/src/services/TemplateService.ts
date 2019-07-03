import { resolve, join } from 'path';
import { readdir, readFile, writeFile, stat, ensureDir, pathExists } from 'fs-extra';
import { SdkService } from './SdkService';

export class TemplateService {
  private static SRC_DIR = resolve(__dirname, '../../template');

  constructor(private workingPath: string) {
    //
  }

  public templateExists(): Promise<boolean> {
    return pathExists(
      join(this.workingPath, 'package.json'),
    );
  }

  public async createTemplate(app: SdkService.IApp): Promise<void> {
    const fileNames = await readdir(TemplateService.SRC_DIR);
    const copyMap: {
      src: string;
      dest: string;
    }[] = [];

    for (const fileName of fileNames) {
      const filePath = join(TemplateService.SRC_DIR, fileName);
      const fileStat = await stat(filePath);

      if (fileStat.isDirectory()) {
        const subFileNames = await readdir(filePath);

        await ensureDir(join(this.workingPath, fileName));

        for (const subFileName of subFileNames) {
          const subFilePath = join(filePath, subFileName);
          const subFileStat = await stat(subFilePath);

          if (!subFileStat.isDirectory()) {
            copyMap.push({
              src: subFilePath,
              dest: join(this.workingPath, fileName, subFileName),
            });
          }
        }
      } else {
        copyMap.push({
          src: filePath,
          dest: join(this.workingPath, fileName),
        });
      }
    }

    for (const { src, dest } of copyMap) {
      let content = await readFile(src, 'utf8');

      if (app) {
        content = content.replace(
          new RegExp('\\$\\{([a-zA-Z\\.]+)\\}', 'ig'),
          (result: string, found: string) => {
            switch (found) {
              case 'app.name':
                result = app.name;
                break;

              case 'app.description':
                result = app.description || '';
                break;

              case 'app.alias':
                result = app.alias;
                break;
            }

            return result;
          },
        );
      }

      await writeFile(dest, content, 'utf8');
    }
  }
}
