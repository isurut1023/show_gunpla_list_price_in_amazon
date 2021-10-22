const gunpla_keywords = [
  "HG［ハイグレード］",
  "HG UNIVERSAL CENTURY",
  "HGUC",
  "HGCE",
  "HG COSMIC ERA",
  "HGFC",
  "HGAC",
  "HGAW",
  "HGCC",
  "HGBF",
  "HGBD",
  "HGBD:R",
  "HGPG",
  "HG FA",
  "HG",
  "FG［ファーストグレード］",
  "FG",
  "Realistic Model Series",
  "FULL MECHANICS[フルメカニクス]",
  "FULL MECHANICS",
  "フルメカニクス",
  "Hi-Resolution Model[ハイレゾリューションモデル]",
  "Hi-Resolution Model",
  "Hi-Resolution",
  "ハイレゾリューションモデル",
  "ENTRY GRADE",
  "EG",
  "Exploring Lab Nature[エクスプローリングラボネイチャー]",
  "Exploring Lab Nature",
  "Figure-rise Effect[フィギュアライズエフェクト]",
  "Figure-rise Effect",
  "フィギュアライズエフェクト",
  "Figure-rise Mechanics[フィギュアライズメカニクス]",
  "Figure-rise Mechanics",
  "フィギュアライズメカニクス",
  "Figure-rise Standard Amplified[フィギュアライズ スタンダード アンプリファイド]",
  "Figure-rise Standard Amplified",
  "フィギュアライズ スタンダード アンプリファイド",
  "Figure-rise Standard[フィギュアライズ スタンダード]",
  "Figure-rise Standard",
  "Figure-riseBust[フィギュアライズバスト]",
  "Figure-riseBust",
  "Figure-riseLABO[フィギュアライズラボ]",
  "Figure-riseLABO",
  "GUNDAM FACTORY YOKOHAMA",
  "MGEX[マスターグレードエクストリーム]",
  "MGEX",
  "MG[マスターグレード]",
  "MG",
  "PG[パーフェクトグレード]",
  "PG UNLEASHED",
  "PG",
  "RE/100[リボーンワンハンドレッド]",
  "RE/100",
  "RG[リアルグレード]",
  "RG",
  "AG[アドバンスドグレード]",
  "AG",
  "SDEXスタンダード",
  "SDガンダム クロスシルエット",
  "SDガンダムクロスシルエット",
  "BB戦士 LEGENDBB",
  "LEGEND BB",
  "LEGENDBB",
  "SDガンダムBB戦士",
  "BB戦士",
  "ブレイブバトルウォーリアーズ",
  "SDガンダム三国伝",
  "SD三国伝",
  "三国伝",
  "SD 三国創傑伝",
  "SD三国創傑伝",
  "SDガンダムシリーズ",
  "SDW HEROES",
  "SDガンダム",
  "SDガンダムGジェネレーション",
  "SDガンダム Gジェネレーション",
  "SDクロスシルエット",
  "SDCS",
  "ガンダムデカール",
  "ビルダーズパーツHD",
  "BPHD",
  "ビルダーズパーツ",
  "メカコレクション",
  "ガンダリウム合金モデル",
  "EXモデル",
  "U.C.HARD GRAPH",
  "メガサイズモデル",
  "メガサイズ",
  "キャラスタンドプレート",
  "1/100000",
  "1/1700",
  "1/1200",
  "1/1000",
  "1/550",
  "1/144",
  "1/100",
  "1/72",
  "1/60",
  "1/48",
  "1/35",
  "1/24",
  "1/12",
  "ノンスケール",
  "GUNDAM BREAKER BATTLOGUE",
  "SDガンダムワールド ヒーローズ",
  "STAR WARS",
  "ガンダム Gのレコンギスタ",
  "Gのレコンギスタ",
  "ポケプラ",
  "境界戦機",
  "機動戦士Vガンダム",
  "ガンプラくん",
  "宇宙戦艦ヤマト",
  "機動戦士ガンダム THE ORIGIN",
  "機動戦士ガンダム 逆襲のシャア",
  "機動戦士ガンダム 逆襲のシャア ベルトーチカチルドレン",
  "機動戦士ガンダム 逆襲のシャア ベルトーチカ・チルドレン",
  "機動戦士ガンダム サンダーボルト",
  "機動戦士ガンダム 閃光のハサウェイ",
  "機動戦士ガンダム 鉄血のオルフェンズ",
  "鉄血のオルフェンズ",
  "機動戦士ガンダム",
  "聖戦士ダンバイン",
  "装甲騎兵ボトムズ",
  "重戦機エルガイム",
  "機動戦士ガンダム0080 ポケットの中の戦争",
  "機動戦士ガンダム 第08MS小隊",
  "機動戦士ガンダム00[ダブルオー]",
  "機動戦士ガンダム00",
  "機動戦士ガンダムF91",
  "機動戦士ガンダムNT[ナラティブ]",
  "機動戦士ガンダムNT",
  "機動戦士ガンダムSEED DESTINY",
  "機動戦士ガンダムSEED",
  "機動戦士ガンダムSEED ASTRAY",
  "機動戦士ガンダムSEED ECLIPSE",
  "機動戦士ガンダムUC[ユニコーン]",
  "機動戦士ガンダムUC",
  "鉄血のオルフェンズ 1/100 フルメカニクス",
  "鉄血のオルフェンズ 1/100",
  "鉄血のオルフェンズ HG",
  "機動戦士Ζガンダム",
  "機動戦士Zガンダム",
  "超時空要塞マクロス",
  "新機動戦記ガンダムWシリーズ",
  "新機動戦記ガンダムW",
  "新機動戦記ガンダムW Endless Waltz",
  "新機動戦記ガンダムW Endless Waltz 敗者たちの栄光",
  "機動戦士ガンダム外伝 ミッシングリンク",
  "フルメタル・パニック!",
  "ガンダム・センチネル",
  "ガールズ＆パンツァー",
  "マクロスΔ（デルタ）",
  "機動戦士ガンダムZZ",
  "機動武闘伝Gガンダム",
  "機動新世紀ガンダムX",
  "ガンダムビルドダイバーズ Re:RISE",
  "ガンダムブレイカーバトローグ",
  "ガンダムビルドダイバーズ",
  "ガンダムビルドファイターズ",
  "機動戦士クロスボーン・ガンダム"
]
