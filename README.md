# 选秀之夜 · 篮球总经理

本地 H5 试玩。直接选择 30 个球队队标中的一个，球队显示城市名；再从五个位置各一名的真实球星中选一人，点击「执教」进入办公室。建队时自动随机补齐四名首发和五名替补，九名队友的游戏评分均不超过 84。阵容随存档保存。办公室显示日期、可用资金、声望、称号和行动力，并提供赛程、训练和首发入口。赛季页记录赛程与战绩。训练消耗行动力，可提升球员评分并安排球队战术。开局和经营页面统一沿用深蓝球馆背景、深蓝卡片与金色强调色。球员页用头像卡管理阵容。市场包含自由市场、教练、新秀与我的关注。联盟按东部、西部显示 30 队战绩，玩家占用所选球队的席位，系统只模拟其余球队。点球队可看名单、主教练和资金。设置可以更换队标或重开。

## 运行

双击 index.html 即可打开。要获得稳定的浏览器存档，建议在 D:\NBA 运行：

    python -m http.server 8765 --bind 127.0.0.1

浏览器打开 http://127.0.0.1:8765/ 。本项目无需构建，照片均随项目本地加载。存档保存在当前浏览器和站点，设置页可确认重开。

## 原型数据和范围

- 开场顺位依据 [2025 NBA 官方选秀看板](https://www.nba.com/draft/2025/draft-board)。自建队伍在假想开档中接手榜眼签。
- 阵容为精选名单；能力、潜力、工资帽、续约报价、赛程和赛果为试玩设定，未复刻完整 NBA 规则。
- 玩家阵容从一次休赛期开档。揭幕战包含可操作的关键球，后续五场按赛程自动模拟。推进日期会刷新行动力，并让联盟 AI 球队生成比赛战绩。
- 公开发行前需核实联盟及球队标识、球员肖像和照片的适用授权。

## 队标、名单与照片

- 30 支球队队标、常规球员头像取自 [NBA](https://www.nba.com/teams)。
- 联盟球队球员与主教练取自 [ESPN](https://www.espn.com/nba/teams) 的本地名单快照。资料快照与游戏内 2025 历史开档可以来自不同赛季。资金、签约候选、评分和战绩由游戏模拟。

- 文班亚马，Frenchieinportland，[原图](https://commons.wikimedia.org/wiki/File:Victor_Wembanyama_San_Antonio_Spurs_2024.jpg)，[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)。本地版本做了方向校正和缩小。
- 哈珀，Petsbikes，[照片](https://commons.wikimedia.org/wiki/File:Dylan_Harper_in_2026_(cropped).jpg)，[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)。此照片拍摄于开档赛季之后。
- 埃奇库姆，SneakinDeacon，[照片](https://commons.wikimedia.org/wiki/File:V._J._Edgecombe_Baylor_2025_(cropped).jpg)，[CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/)。项目使用 Commons 提供的缩略图。
- 亚历山大，All-Pro Reels，[照片](<https://commons.wikimedia.org/wiki/File:Shai_Gilgeous-Alexander_(51815871018)_(cropped).jpg>)，[CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/)。
- 爱德华兹，CCS Pictures，[照片](<https://commons.wikimedia.org/wiki/File:Anthony_Edwards_(cropped).jpg>)，[CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/)。
- 杰伦·布朗，All-Pro Reels，[照片](<https://commons.wikimedia.org/wiki/File:Jaylen_Brown_2022.jpg>)，[CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/)。
- 阿德托昆博，All-Pro Reels，[照片](<https://commons.wikimedia.org/wiki/File:Giannis_Antetokounmpo_(51664127127)_(cropped).jpg>)，[CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/)。
- 界面使用 CSS 裁切展示。建队球星照片已缩小，各照片保留各自许可。
- `assets/skins/` 里的 34 张插画头像是 AI 生成的，用来替换对应球员的官方照片。显示名是谐音中文名，数据在 `player-skins.js`。把文件顶部的 `USE_PLAYER_SKINS` 改成 `false` 即可回到原来的姓名和照片。
