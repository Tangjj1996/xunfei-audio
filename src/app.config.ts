export default function createConfig<T>(params: { [key in keyof T]: T[key] }) {
    return {
        appId: "41ac2892",
        ...params,
    };
}
