import type { Color } from "./palette";

export class Task {
    prepTime? : number
    constructor(public hours: number, public title: string, public cssColor: Color) {}
}