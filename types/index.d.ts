export declare type ItemType = {
    name: string;
    isDir: boolean;
    level: number;
    note: string;
    children?: ItemType[];
};
export declare function getFileNodes(nodes?: Array<ItemType>, dir?: string, level?: number): Array<ItemType>;
export declare function getMd(): string;
