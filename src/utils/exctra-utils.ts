import { nanoid } from 'nanoid';

export function generateTempUsername(name: string): string {
    return `${name}_${nanoid(10)}`;
}
