/**
 * e.g:
 * url = "/:name/:id"
 * => replaceParam(url, "name", "john") => "/john/:id"
 * @param url 
 * @param key 
 * @param value 
 * @returns 
 */
export const replaceParam = (url: string, key: string, value: string) => {
    return url.replace(new RegExp(`:${key}\\b`), value);
}