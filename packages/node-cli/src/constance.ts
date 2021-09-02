export const APP_ID = "41ac2892";
export const SECRET_KEY = "476dbac45bca3f32bba334f702e3bc4f";
export const FILE_PIECE_SICE = 1024 * 1024;
export const BANNER = `/*
* bg	句子相对于本音频的起始时间，单位为ms
* ed	句子相对于本音频的终止时间，单位为ms
* onebest	句子内容
* speaker	说话人编号，从1开始，未开启说话人分离时speaker都为0
* si	句子标识，相同si表示同一句话，从0开始 注：仅开启分词或者多候选时返回
* wordsResultList	分词列表 注：仅开启分词或者多候选时返回，且英文暂不支持
* alternativeList	多候选列表，按置信度排名 注：仅开启分词或者多候选时返回，且英文暂不支持
* wordBg	词相对于本句子的起始帧，其中一帧是10ms 注：仅开启分词或者多候选时返回，且英文暂不支持
* wordEd	词相对于本句子的终止帧，其中一帧是10ms 注：仅开启分词或者多候选时返回，且英文暂不支持
* wordsName	词内容 注：仅开启分词或者多候选时返回，且英文暂不支持
* wc	句子置信度，范围为[0,1] 注：仅开启分词或者多候选时返回，且英文暂不支持
* wp	词属性，n代表普通词，r代表人名，d代表数字，m代表量词，s代表顺滑词（语气词），t代表地名&多音字，p代表标点，g代表分段标识 注：仅开启分词或者多候选时返回
*/


`;
