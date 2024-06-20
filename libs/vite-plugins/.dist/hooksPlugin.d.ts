export default function hooksPlugin({ rmFiles, afterBuild, beforeBuild, }: {
    beforeBuild?: Function;
    afterBuild?: Function;
    rmFiles?: string[];
}): {
    name: string;
    buildStart(): void;
    buildEnd(err?: Error): void;
};
