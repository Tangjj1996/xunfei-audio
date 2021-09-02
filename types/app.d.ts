type prefixFetch = "prepare" | "upload" | "merge" | "getProgress" | "getResult";

type BaseFetchUrl = "https://raasr.xfyun.cn/api/";

type FullFetchUrl<T extends BaseFetchUrl, U extends prefixFetch> = `${T}${U}`;

type BaseOptions = {
    /**
     * 讯飞开放平台应用ID
     * @example 595f23df
     */
    app_id: string;
    /**
     * 加密数字签名
     * @example BFQEcN3SgZNC4eECvq0LFUPVHvI=
     */
    signa: string;
    /**
     * 时间戳
     * @example 1512041814
     */
    ts: number;
    /**
     * 任务ID（预处理接口返回值)
     * @example 4b705edda27a4140b31b462df0033cfa
     */
    task_id: string;
};

export type PrepareFetchUrl = FullFetchUrl<BaseFetchUrl, "prepare">;

export type UploadFetchUrl = FullFetchUrl<BaseFetchUrl, "upload">;

export type MergeFetchUrl = FullFetchUrl<BaseFetchUrl, "merge">;

export type GetProgressFetchUrl = FullFetchUrl<BaseFetchUrl, "getProgress">;

export type GetResultFetchUrl = FullFetchUrl<BaseFetchUrl, "getResult">;

export type PrepareOptions = {
    /**
     * 讯飞开放平台应用ID
     * @example 595f23df
     */
    app_id: string;
    /**
     * 加密数字签名
     * @example BFQEcN3SgZNC4eECvq0LFUPVHvI=
     */
    signa: string;
    /**
     * 当前时间戳，从1970年1月1日0点0分0秒开始到现在的秒数
     * @example 1512041814
     */
    ts: number;
    /**
     * 文件大小（单位：字节）
     * @example 160044
     */
    file_len: number;
    /**
     * 文件名称（带后缀）
     * @example lfasr_audio.wav
     */
    file_name: string;
    /**
     * 文件分片数目（建议分片大小为10M，若文件<10M，则slice_num=1）
     * @example 1
     */
    slice_num: number;
    /**
     * 转写类型，默认 0 0: (标准版，格式: wav,flac,opus,mp3,m4a) 2: (电话版，已取消)
     * @example 0
     * @default 0
     */
    lfasr_type?: number;
    /**
     * 转写结果是否包含分词信息
     * @default false
     */
    has_participle?: boolean;
    /**
     * 转写结果中最大的候选词个数
     * @default '0'
     * 最大不超过5
     */
    max_alternatives?: number;
    /**
     * 首尾是否带静音信息，不带静音信息可以使得词相对于本句子的起始帧更精确 0：不显示 1：显示
     * @default 1
     */
    eng_vad_margin?: number;
    /**
     * 开启或关闭顺滑词（目前只有中文、英文支持顺滑词，其他方言和小语种暂不支持顺滑词，也不支持顺滑词的关闭）开启：true 关闭：false
     * @default true
     */
    has_smooth?: boolean;
    /**
     * 发音人个数，可选值：0-10，0表示盲分 注：发音人分离目前还是测试效果达不到商用标准，如测试无法满足您的需求，请慎用该功能。
     * @default 2
     */
    speaker_number?: number;
    /**
     * 转写结果中是否包含发音人分离信息
     * @default false
     */
    has_seperate?: boolean;
    /**
     * 支持参数如下
     * 1: 通用角色分离
     */
    role_type?: string;
    /**
     * 语种
     * cn:中英文&中文（默认）
     * en:英文（英文不支持热词）
     * 其他小语种：可到控制台-语音转写-方言/语种处添加试用或购买，添加后会显示该小语种参数值。若未授权，使用将会报错26607。
     * @default cn
     */
    language?: string;
    /**
     * 控制广东话（粤语）返回的文本结果为繁体还是简体
     * 简体：0
     * 繁体：1
     */
    eng_rlang?: number;
    /**
     * 垂直领域个性化参数:
     * 法院: court
     * 教育: edu
     * 金融: finance
     * 医疗: medical
     * 科技: tech
     * 体育: sport
     * 政府: gov
     * 游戏: game
     * 电商: ecom
     * 汽车: car
     * pd为非必须设置参数，不设置参数默认为通用
     */
    pd?: string;
};

export type SuccessResponse = {
    ok: 0;
    err_no: 0;
    failed: null;
    data: string;
};

export type FailedResponse = {
    ok: -1;
    err_no: number;
    failed: string;
    data: null;
};

export type UploadOptions = {
    /**
     * 分片序号
     * @example aaaaaaaaaa，aaaaaaaaab
     */
    slice_id: string;
    /**
     * 分片文件内容
     */
    content: unknown;
} & BaseOptions;

export type MergeOptions = {} & BaseOptions;

export type GetProgressOptions = {} & BaseOptions;

export type GetResultOptions = {} & BaseOptions;

export type PostDataParam<T> = T extends PrepareFetchUrl
    ? PrepareOptions
    : T extends UploadFetchUrl
    ? UploadOptions
    : T extends MergeFetchUrl
    ? MergeOptions
    : T extends GetProgressFetchUrl
    ? GetProgressOptions
    : T extends GetResultFetchUrl
    ? GetResultOptions
    : never;
