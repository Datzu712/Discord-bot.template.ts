import { Keyword, KeywordOptions } from '../../structures/Keyword';
import { IBaseCommand } from '../../structures/BaseCommand';

/**
 * Create keywords for a command.
 * @param { string } defaultPrefix - Default prefix for all keywords (you cant add one manually).
 * @param { KeywordOptions } keywordsData - Keywords data.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function addKeywords(defaultPrefix: string, keywordsData: RequireAtLeastOneOf<KeywordOptions>[]): any {
    return function decorator<K extends new (...args: unknown[]) => IBaseCommand>(command: K, propertyKey: keyof K) {
        const propertyTarget: Keyword[] = ((command[propertyKey] as unknown as Keyword[]) = []);

        for (const data of keywordsData) {
            const keyword = new Keyword(data);

            keyword.prefix = keyword.prefix ?? defaultPrefix;

            propertyTarget.push(keyword);
        }
    };
}
