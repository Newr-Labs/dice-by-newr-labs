
import { Language, ToolType } from '../types';

/**
 * MASTER LOCALIZATION DICTIONARY
 * Fully verified translations for the reduced set of 9 supported languages.
 */
export const TRANSLATIONS: Record<Language, any> = {
  en: {
    tools: {
      [ToolType.DICE]: 'Dice', [ToolType.COIN]: 'Coin', [ToolType.YES_NO]: 'Yes/No',
      [ToolType.NUMBER]: 'Numbers', [ToolType.WHEEL]: 'Wheel', [ToolType.PICKER]: 'Picker',
      [ToolType.COLOR]: 'Colors', [ToolType.TRUTH_DARE]: 'Truth/Dare'
    },
    bios: {
      [ToolType.DICE]: 'Mechanical Probability', [ToolType.COIN]: 'Heads / Tails',
      [ToolType.YES_NO]: 'Oracle Core', [ToolType.NUMBER]: 'Integer Synthesis',
      [ToolType.WHEEL]: 'Mechanical Selection', [ToolType.PICKER]: 'Random Extraction',
      [ToolType.COLOR]: 'Chroma Analysis', [ToolType.TRUTH_DARE]: 'Fate Consultation',
      tagline: 'Let fate decide.'
    },
    common: {
      generate: 'Go!', rolling: 'Rolling...', tossing: 'Flipping...',
      heads: 'Heads', tails: 'Tails', yes: 'YES', no: 'NO', maybe: 'MAYBE',
      total: 'Total', quantity: 'Amount', result: 'Result', copy: 'Copy',
      copied: 'Got it!', reset: 'Reset', save: 'Save', registry: 'History',
      resolved: 'Past Events', clearAll: 'Wipe All', truth: 'Truth', dare: 'Dare',
      consulting: 'Thinking...', purge: 'Purge', options: 'Options',
      onlineRequired: 'Internet Required', aiPowered: 'AI Powered',
      vault: 'Chroma Vault', favorites: 'Favorites',
      confirmPurge: 'Sure?', confirmReset: 'Reset App?',
      placeholderSearch: 'Search colors, vibes, hex...',
      clearResult: 'Clear Result', tapToConsult: 'Tap to Consult',
      analyzing: 'Analyzing...', outcomeSelected: 'Outcome Selected',
      emptyReel: 'Empty Reel', systemIdle: 'System Idle', autoPurge: 'Auto-Purge',
      runSelection: 'Run Selection', processing: 'Processing...',
      selectedUnit: 'Selected Unit', tapToCopy: 'Tap to Copy',
      version: 'v1.4.2', today: 'Today', yesterday: 'Yesterday',
      min: 'Min', max: 'Max', listInput: 'List Input', optionsPool: 'Options Pool',
      vibePrompt: 'Vibe Prompt', rename: 'Rename', delete: 'Delete',
      abort: 'Abort', confirmWipe: 'Confirm Wipe', units: 'units',
      placeholderList: 'One item per line...', placeholderWheel: 'Comma separated options...',
      madeBy: 'Made by', historyTooltip: 'History Log', settingsTooltip: 'System Settings',
      decisionLatched: 'Decision Latched',
      vibes: {
        casual: 'Casual', party: 'Party', deep: 'Deep', cyberRebel: 'Cyber-Rebel',
        boy: 'Boy', girl: 'Girl', neon: 'Neon', nature: 'Nature', royal: 'Royal'
      }
    },
    settings: {
      title: 'Settings', language: 'Language', audio: 'Sounds',
      voice: 'AI Voice', haptics: 'Haptics', fidelity: 'Visual FX',
      voicePersona: 'AI Persona', theme: 'Accent', brightness: 'Brightness',
      diceSkin: 'Dice Skin', coinSkin: 'Coin Skin', factoryReset: 'Factory Reset',
      social: 'Community', github: 'Source Code', discord: 'Discord',
      skins: {
        standard: 'Classic', stealth: 'Stealth', neon: 'Neon', marble: 'Marble',
        digital: 'Digital', abstract: 'Abstract'
      },
      themes: {
        light: 'Light', dark: 'Dark', midnight: 'Midnight', sepia: 'Sepia',
        nord: 'Nord', sakura: 'Sakura', forest: 'Forest'
      }
    }
  },
  es: {
    tools: {
      [ToolType.DICE]: 'Dados', [ToolType.COIN]: 'Moneda', [ToolType.YES_NO]: 'Sí/No',
      [ToolType.NUMBER]: 'Números', [ToolType.WHEEL]: 'Ruleta', [ToolType.PICKER]: 'Selector',
      [ToolType.COLOR]: 'Colores', [ToolType.TRUTH_DARE]: 'Verdad/Reto'
    },
    bios: {
      [ToolType.DICE]: 'Probabilidad mecánica', [ToolType.COIN]: 'Cara / Cruz',
      [ToolType.YES_NO]: 'Núcleo del oráculo', [ToolType.NUMBER]: 'Síntesis de enteros',
      [ToolType.WHEEL]: 'Selección mecánica', [ToolType.PICKER]: 'Extracción aleatoria',
      [ToolType.COLOR]: 'Análisis de color', [ToolType.TRUTH_DARE]: 'Consulta del destino',
      tagline: 'Deja que el destino decida.'
    },
    common: {
      generate: '¡Ir!', rolling: 'Lanzando...', tossing: 'Girando...',
      heads: 'Cara', tails: 'Cruz', yes: 'SÍ', no: 'NO', maybe: 'QUIZÁS',
      total: 'Total', quantity: 'Cantidad', result: 'Resultado', copy: 'Copiar',
      copied: '¡Copiado!', reset: 'Reiniciar', save: 'Guardar', registry: 'Historial',
      resolved: 'Pasado', clearAll: 'Borrar todo', truth: 'Verdad', dare: 'Reto',
      consulting: 'Pensando...', purge: 'Purgar', options: 'Opciones',
      onlineRequired: 'Internet requerido', aiPowered: 'Con IA',
      vault: 'Bóveda de color', favorites: 'Favoritos',
      confirmPurge: '¿Seguro?', confirmReset: '¿Reiniciar?',
      placeholderSearch: 'Buscar colores...',
      clearResult: 'Borrar resultado', tapToConsult: 'Toca para consultar',
      analyzing: 'Analizando...', outcomeSelected: 'Resultado seleccionado',
      emptyReel: 'Rueda vacía', systemIdle: 'Sistema inactivo', autoPurge: 'Auto-purga',
      runSelection: 'Ejecutar', processing: 'Procesando...',
      selectedUnit: 'Unidad elegida', tapToCopy: 'Toca para copiar',
      version: 'v1.4.2', today: 'Hoy', yesterday: 'Ayer',
      min: 'Mín', max: 'Máx', listInput: 'Lista', optionsPool: 'Opciones',
      vibePrompt: 'Vibe', rename: 'Renombrar', delete: 'Eliminar',
      abort: 'Abortar', confirmWipe: 'Confirmar', units: 'unidades',
      placeholderList: 'Uno por línea...', placeholderWheel: 'Opciones por comas...',
      madeBy: 'Hecho por', historyTooltip: 'Historial', settingsTooltip: 'Ajustes',
      decisionLatched: 'Decisión tomada',
      vibes: {
        casual: 'Casual', party: 'Fiesta', deep: 'Profundo', cyberRebel: 'Ciber Rebelde',
        boy: 'Chico', girl: 'Chica', neon: 'Neón', nature: 'Naturaleza', royal: 'Real'
      }
    },
    settings: {
      title: 'Ajustes', language: 'Idioma', audio: 'Sonidos',
      voice: 'Voz IA', haptics: 'Vibración', fidelity: 'Gráficos',
      voicePersona: 'Persona IA', theme: 'Acento', brightness: 'Brillo',
      diceSkin: 'Piel Dados', coinSkin: 'Piel Moneda', factoryReset: 'Reset Fábrica',
      social: 'Comunidad', github: 'Código', discord: 'Discord',
      skins: { standard: 'Clásico', stealth: 'Sigilo', neon: 'Neón', marble: 'Mármol', digital: 'Digital', abstract: 'Abstracto' },
      themes: { light: 'Claro', dark: 'Oscuro', midnight: 'Medianoche', sepia: 'Sepia', nord: 'Nord', sakura: 'Sakura', forest: 'Bosque' }
    }
  },
  fr: {
    tools: {
      [ToolType.DICE]: 'Dés', [ToolType.COIN]: 'Pièce', [ToolType.YES_NO]: 'Oui/Non',
      [ToolType.NUMBER]: 'Nombres', [ToolType.WHEEL]: 'Roue', [ToolType.PICKER]: 'Sélecteur',
      [ToolType.COLOR]: 'Couleurs', [ToolType.TRUTH_DARE]: 'Action/Vérité'
    },
    bios: {
      [ToolType.DICE]: 'Probabilité mécanique', [ToolType.COIN]: 'Pile / Face',
      [ToolType.YES_NO]: 'Cœur de l\'oracle', [ToolType.NUMBER]: 'Synthèse d\'entiers',
      [ToolType.WHEEL]: 'Sélection mécanique', [ToolType.PICKER]: 'Extraction aléatoire',
      [ToolType.COLOR]: 'Analyse chroma', [ToolType.TRUTH_DARE]: 'Consultation du sort',
      tagline: 'Laissez le destin décider.'
    },
    common: {
      generate: 'Allez !', rolling: 'Lancement...', tossing: 'Lancement...',
      heads: 'Face', tails: 'Pile', yes: 'OUI', no: 'NON', maybe: 'PEUT-ÊTRE',
      total: 'Total', quantity: 'Quantité', result: 'Résultat', copy: 'Copier',
      copied: 'Copié !', reset: 'Reset', save: 'Sauver', registry: 'Historique',
      resolved: 'Événements', clearAll: 'Tout effacer', truth: 'Vérité', dare: 'Action',
      consulting: 'Réflexion...', purge: 'Purger', options: 'Options',
      onlineRequired: 'Internet requis', aiPowered: 'Propulsé par IA',
      vault: 'Coffre Chroma', favorites: 'Favoris',
      confirmPurge: 'Sûr ?', confirmReset: 'Reset App?',
      placeholderSearch: 'Chercher couleurs...',
      clearResult: 'Effacer résultat', tapToConsult: 'Appuyez pour consulter',
      analyzing: 'Analyse...', outcomeSelected: 'Résultat choisi',
      emptyReel: 'Roue vide', systemIdle: 'Système inactif', autoPurge: 'Auto-purge',
      runSelection: 'Lancer', processing: 'Traitement...',
      selectedUnit: 'Unité choisie', tapToCopy: 'Copier',
      version: 'v1.4.2', today: 'Aujourd\'hui', yesterday: 'Hier',
      min: 'Min', max: 'Max', listInput: 'Liste', optionsPool: 'Options',
      vibePrompt: 'Vibe', rename: 'Renommer', delete: 'Supprimer',
      abort: 'Annuler', confirmWipe: 'Confirmer', units: 'unités',
      placeholderList: 'Un par ligne...', placeholderWheel: 'Par virgules...',
      madeBy: 'Fait par', historyTooltip: 'Historique', settingsTooltip: 'Paramètres',
      decisionLatched: 'Décision fixée',
      vibes: {
        casual: 'Casual', party: 'Fête', deep: 'Profond', cyberRebel: 'Cyber Rebelle',
        boy: 'Garçon', girl: 'Fille', neon: 'Néon', nature: 'Nature', royal: 'Royal'
      }
    },
    settings: {
      title: 'Paramètres', language: 'Langue', audio: 'Sons',
      voice: 'Voz IA', haptics: 'Haptique', fidelity: 'Effets FX',
      voicePersona: 'Persona IA', theme: 'Accent', brightness: 'Luminosité',
      diceSkin: 'Skin Dés', coinSkin: 'Skin Pièce', factoryReset: 'Reset usine',
      social: 'Communauté', github: 'Code', discord: 'Discord',
      skins: { standard: 'Classique', stealth: 'Furtif', neon: 'Néon', marble: 'Marbre', digital: 'Numérique', abstract: 'Abstrait' },
      themes: { light: 'Clair', dark: 'Sombre', midnight: 'Minuit', sepia: 'Sépia', nord: 'Nord', sakura: 'Sakura', forest: 'Forêt' }
    }
  },
  de: {
    tools: {
      [ToolType.DICE]: 'Würfel', [ToolType.COIN]: 'Münze', [ToolType.YES_NO]: 'Ja/Nein',
      [ToolType.NUMBER]: 'Zahlen', [ToolType.WHEEL]: 'Rad', [ToolType.PICKER]: 'Auswahl',
      [ToolType.COLOR]: 'Farben', [ToolType.TRUTH_DARE]: 'Wahrheit/Pflicht'
    },
    bios: {
      [ToolType.DICE]: 'Mechanik', [ToolType.COIN]: 'Kopf / Zahl',
      [ToolType.YES_NO]: 'Orakel', [ToolType.NUMBER]: 'Synthese',
      [ToolType.WHEEL]: 'Selektion', [ToolType.PICKER]: 'Extraktion',
      [ToolType.COLOR]: 'Analyse', [ToolType.TRUTH_DARE]: 'Konsultation',
      tagline: 'Lass das Schicksal entscheiden.'
    },
    common: {
      generate: 'Los!', rolling: 'Würfeln...', tossing: 'Werfen...',
      heads: 'Kopf', tails: 'Zahl', yes: 'JA', no: 'NEIN', maybe: 'VIELLEICHT',
      total: 'Summe', quantity: 'Menge', result: 'Ergebnis', copy: 'Kopieren',
      copied: 'Kopiert!', reset: 'Reset', save: 'Speichern', registry: 'Verlauf',
      resolved: 'Ereignisse', clearAll: 'Alle löschen', truth: 'Wahrheit', dare: 'Pflicht',
      consulting: 'Denken...', purge: 'Löschen', options: 'Optionen',
      onlineRequired: 'Internet nötig', aiPowered: 'KI-gestützt',
      vault: 'Farbtresor', favorites: 'Favoriten',
      confirmPurge: 'Sicher?', confirmReset: 'App-Reset?',
      placeholderSearch: 'Farben suchen...',
      clearResult: 'Ergebnis löschen', tapToConsult: 'Tippen zum Fragen',
      analyzing: 'Analyse...', outcomeSelected: 'Ergebnis gewählt',
      emptyReel: 'Leeres Rad', systemIdle: 'Standby', autoPurge: 'Auto-Löschen',
      runSelection: 'Starten', processing: 'Wird verarbeitet...',
      selectedUnit: 'Gewählt', tapToCopy: 'Kopieren',
      version: 'v1.4.2', today: 'Heute', yesterday: 'Gestern',
      min: 'Min', max: 'Max', listInput: 'Liste', optionsPool: 'Optionen',
      vibePrompt: 'Vibe', rename: 'Umbenennen', delete: 'Löschen',
      abort: 'Abbruch', confirmWipe: 'Bestätigen', units: 'Einheiten',
      placeholderList: 'Eine pro Zeile...', placeholderWheel: 'Mit Komma...',
      madeBy: 'Von', historyTooltip: 'Verlauf', settingsTooltip: 'Einstellungen',
      decisionLatched: 'Entscheidung fix',
      vibes: {
        casual: 'Lässig', party: 'Party', deep: 'Tief', cyberRebel: 'Cyber-Rebell',
        boy: 'Junge', girl: 'Mädchen', neon: 'Neon', nature: 'Natur', royal: 'Königlich'
      }
    },
    settings: {
      title: 'Einstellungen', language: 'Sprache', audio: 'Töne',
      voice: 'KI Stimme', haptics: 'Haptik', fidelity: 'Grafik',
      voicePersona: 'KI Persona', theme: 'Akzent', brightness: 'Thema',
      diceSkin: 'Würfel-Skin', coinSkin: 'Münz-Skin', factoryReset: 'Werkseinstellungen',
      social: 'Community', github: 'Code', discord: 'Discord',
      skins: { standard: 'Klassisch', stealth: 'Stealth', neon: 'Neon', marble: 'Marmor', digital: 'Digital', abstract: 'Abstrakt' },
      themes: { light: 'Hell', dark: 'Dunkel', midnight: 'Mitternacht', sepia: 'Sepia', nord: 'Nord', sakura: 'Sakura', forest: 'Wald' }
    }
  },
  ru: {
    tools: {
      [ToolType.DICE]: 'Кости', [ToolType.COIN]: 'Монета', [ToolType.YES_NO]: 'Да/Нет',
      [ToolType.NUMBER]: 'Числа', [ToolType.WHEEL]: 'Колесо', [ToolType.PICKER]: 'Выбор',
      [ToolType.COLOR]: 'Цвета', [ToolType.TRUTH_DARE]: 'Правда/Действие'
    },
    bios: {
      [ToolType.DICE]: 'Механическая вероятность', [ToolType.COIN]: 'Орел / Решка',
      [ToolType.YES_NO]: 'Ядро Оракула', [ToolType.NUMBER]: 'Синтез чисел',
      [ToolType.WHEEL]: 'Механический выбор', [ToolType.PICKER]: 'Случайный выбор',
      [ToolType.COLOR]: 'Хрома-анализ', [ToolType.TRUTH_DARE]: 'Консультация судьбы',
      tagline: 'Пусть решит судьба.'
    },
    common: {
      generate: 'Пуск!', rolling: 'Бросаем...', tossing: 'Бросаем...',
      heads: 'Орел', tails: 'Решка', yes: 'ДА', no: 'НЕТ', maybe: 'МОЖЕТ',
      total: 'Всего', quantity: 'Кол-во', result: 'Результат', copy: 'Копировать',
      copied: 'Готово!', reset: 'Сброс', save: 'Сохранить', registry: 'История',
      resolved: 'Прошлое', clearAll: 'Очистить всё', truth: 'Правда', dare: 'Действие',
      consulting: 'Думаю...', purge: 'Удалить', options: 'Опции',
      onlineRequired: 'Нужен интернет', aiPowered: 'С ИИ',
      vault: 'Хранилище', favorites: 'Избранное',
      confirmPurge: 'Уверены?', confirmReset: 'Сброс?',
      placeholderSearch: 'Поиск...',
      clearResult: 'Очистить', tapToConsult: 'Нажмите, чтобы спросить',
      analyzing: 'Анализ...', outcomeSelected: 'Выбрано',
      emptyReel: 'Пусто', systemIdle: 'Ожидание', autoPurge: 'Авто-удаление',
      runSelection: 'Старт', processing: 'Обработка...',
      selectedUnit: 'Объект', tapToCopy: 'Копировать',
      version: 'v1.4.2', today: 'Сегодня', yesterday: 'Вчера',
      min: 'Мин', max: 'Макс', listInput: 'Список', optionsPool: 'Пул',
      vibePrompt: 'Вайб', rename: 'Переименовать', delete: 'Удалить',
      abort: 'Отмена', confirmWipe: 'Очистить', units: 'ед.',
      placeholderList: 'По одному в строке...', placeholderWheel: 'Через запятую...',
      madeBy: 'Создано', historyTooltip: 'История', settingsTooltip: 'Настройки',
      decisionLatched: 'Решение принято',
      vibes: {
        casual: 'Обычный', party: 'Вечеринка', deep: 'Глубокий', cyberRebel: 'Мятеж',
        boy: 'Мальчик', girl: 'Девочка', neon: 'Неон', nature: 'Природа', royal: 'Король'
      }
    },
    settings: {
      title: 'Настройки', language: 'Язык', audio: 'Звуки',
      voice: 'Голос ИИ', haptics: 'Вибрация', fidelity: 'Визуал',
      voicePersona: 'ИИ Личность', theme: 'Акцент', brightness: 'Тема',
      diceSkin: 'Скин Костей', coinSkin: 'Скин Монеты', factoryReset: 'Сброс настроек',
      social: 'Сообщество', github: 'Код', discord: 'Discord',
      skins: { standard: 'Классика', stealth: 'Стелс', neon: 'Неон', marble: 'Мрамор', digital: 'Цифра', abstract: 'Абстракция' },
      themes: { light: 'Светлая', dark: 'Темная', midnight: 'Полночь', sepia: 'Сепия', nord: 'Норд', sakura: 'Сакура', forest: 'Лес' }
    }
  },
  ja: {
    tools: {
      [ToolType.DICE]: 'サイコロ', [ToolType.COIN]: 'コイン', [ToolType.YES_NO]: 'はい/いいえ',
      [ToolType.NUMBER]: '数字', [ToolType.WHEEL]: 'ルーレット', [ToolType.PICKER]: 'ピッカー',
      [ToolType.COLOR]: 'カラー', [ToolType.TRUTH_DARE]: '真実か挑戦か'
    },
    bios: {
      [ToolType.DICE]: '確率', [ToolType.COIN]: '表 / 裏',
      [ToolType.YES_NO]: 'お告げ', [ToolType.NUMBER]: '合成',
      [ToolType.WHEEL]: '選択', [ToolType.PICKER]: '抽出',
      [ToolType.COLOR]: '解析', [ToolType.TRUTH_DARE]: '相談',
      tagline: '運命に任せよう。'
    },
    common: {
      generate: '開始', rolling: '回転中...', tossing: 'トス中...',
      heads: '表', tails: '裏', yes: 'はい', no: 'いいえ', maybe: 'たぶん',
      total: '合計', quantity: '個数', result: '結果', copy: 'コピー',
      copied: '完了', reset: 'リセット', save: '保存', registry: '履歴',
      resolved: '過去', clearAll: '消去', truth: '真実', dare: '挑戦',
      consulting: '考え中...', purge: '消去', options: 'オプション',
      onlineRequired: 'ネット接続', aiPowered: 'AI搭載',
      vault: '保管庫', favorites: 'お気に入り',
      confirmPurge: 'OK?', confirmReset: 'リセット?',
      placeholderSearch: '検索...',
      clearResult: '結果クリア', tapToConsult: 'タップして尋ねる',
      analyzing: '解析中...', outcomeSelected: '選択完了',
      emptyReel: '空', systemIdle: '待機中', autoPurge: '自動消去',
      runSelection: '実行', processing: '処理中...',
      selectedUnit: '選択済み', tapToCopy: 'コピー',
      version: 'v1.4.2', today: '今日', yesterday: '昨日',
      min: '最小', max: '最大', listInput: 'リスト', optionsPool: 'プール',
      vibePrompt: '雰囲気', rename: '名前変更', delete: '削除',
      abort: '中止', confirmWipe: '確認', units: '件',
      placeholderList: '1行に1つ...', placeholderWheel: 'カンマ区切り...',
      madeBy: '制作', historyTooltip: '履歴', settingsTooltip: '設定',
      decisionLatched: '決定',
      vibes: {
        casual: 'カジュアル', party: 'パーティ', deep: 'ディープ', cyberRebel: 'サイバー',
        boy: '男の子', girl: '女の子', neon: 'ネオン', nature: '自然', royal: '王室'
      }
    },
    settings: {
      title: '設定', language: '言語', audio: '音',
      voice: 'AIボイス', haptics: '振動', fidelity: 'ビジュアル',
      voicePersona: 'AI人格', theme: '色', brightness: 'テーマ',
      diceSkin: 'サイコロ外見', coinSkin: 'コイン外見', factoryReset: '初期化',
      social: 'コミュニティ', github: 'コード', discord: 'Discord',
      skins: { standard: '標準', stealth: 'ステルス', neon: 'ネオン', marble: '大理石', digital: 'デジタル', abstract: '抽象' },
      themes: { light: 'ライト', dark: 'ダーク', midnight: '真夜中', sepia: 'セピア', nord: 'ノード', sakura: '桜', forest: '森' }
    }
  },
  zh: {
    tools: {
      [ToolType.DICE]: '骰子', [ToolType.COIN]: '硬币', [ToolType.YES_NO]: '是/否',
      [ToolType.NUMBER]: '数字', [ToolType.WHEEL]: '转盘', [ToolType.PICKER]: '挑选器',
      [ToolType.COLOR]: '颜色', [ToolType.TRUTH_DARE]: '真心话/大冒险'
    },
    bios: {
      [ToolType.DICE]: '概率', [ToolType.COIN]: '正 / 反',
      [ToolType.YES_NO]: '预言', [ToolType.NUMBER]: '合成',
      [ToolType.WHEEL]: '选择', [ToolType.PICKER]: '抽取',
      [ToolType.COLOR]: '分析', [ToolType.TRUTH_DARE]: '咨询',
      tagline: '让命运决定。'
    },
    common: {
      generate: '开始', rolling: '掷骰中...', tossing: '抛币中...',
      heads: '正面', tails: '反面', yes: '是', no: '否', maybe: '也许',
      total: '合计', quantity: '数量', result: '结果', copy: '复制',
      copied: '已复制', reset: '重置', save: '保存', registry: '历史',
      resolved: '过往', clearAll: '清除全部', truth: '真心话', dare: '大冒险',
      consulting: '思考中...', purge: '清除', options: '选项',
      onlineRequired: '需网络', aiPowered: 'AI支持',
      vault: '色库', favorites: '收藏',
      confirmPurge: '确定?', confirmReset: '重置?',
      placeholderSearch: '搜索颜色...',
      clearResult: '清除结果', tapToConsult: '点击咨询',
      analyzing: '分析中...', outcomeSelected: '已选',
      emptyReel: '空', systemIdle: '待机', autoPurge: '自动清除',
      runSelection: '运行', processing: '处理中...',
      selectedUnit: '已选单位', tapToCopy: '复制',
      version: 'v1.4.2', today: '今天', yesterday: '昨天',
      min: '最小', max: '最大', listInput: '列表', optionsPool: '池',
      vibePrompt: '氛围', rename: '重命名', delete: '删除',
      abort: '取消', confirmWipe: '确认', units: '单位',
      placeholderList: '每行一个...', placeholderWheel: '逗号分隔...',
      madeBy: '制作者', historyTooltip: '历史', settingsTooltip: '设置',
      decisionLatched: '已决定',
      vibes: {
        casual: '休闲', party: '派对', deep: '深度', cyberRebel: '赛博',
        boy: '男孩', girl: '女孩', neon: '霓虹', nature: '自然', royal: '皇室'
      }
    },
    settings: {
      title: '设置', language: '语言', audio: '音效',
      voice: 'AI语音', haptics: '震动', fidelity: '视觉',
      voicePersona: 'AI人格', theme: '配色', brightness: '主题',
      diceSkin: '骰子外观', coinSkin: '硬币外观', factoryReset: '工厂重置',
      social: '社区', github: '代码', discord: 'Discord',
      skins: { standard: '标准', stealth: '隐形', neon: '霓虹', marble: '大理石', digital: '数字', abstract: '抽象' },
      themes: { light: '亮色', dark: '暗色', midnight: '午夜', sepia: '褐色', nord: '北欧', sakura: '樱花', forest: '森林' }
    }
  },
  ar: {
    tools: {
      [ToolType.DICE]: 'نرد', [ToolType.COIN]: 'عملة', [ToolType.YES_NO]: 'نعم/لا',
      [ToolType.NUMBER]: 'أرقام', [ToolType.WHEEL]: 'عجلة', [ToolType.PICKER]: 'اختيار',
      [ToolType.COLOR]: 'ألوان', [ToolType.TRUTH_DARE]: 'حقيقة/تحدي'
    },
    bios: {
      [ToolType.DICE]: 'احتمالية ميكانيكية', [ToolType.COIN]: 'ملك / كتابة',
      [ToolType.YES_NO]: 'جوهر العرافة', [ToolType.NUMBER]: 'توليف الأرقام',
      [ToolType.WHEEL]: 'الاختيار الميكانيكي', [ToolType.PICKER]: 'الاستخراج العشوائي',
      [ToolType.COLOR]: 'تحليل الألوان', [ToolType.TRUTH_DARE]: 'استشارة القدر',
      tagline: 'دع القدر يقرر.'
    },
    common: {
      generate: 'ابدأ!', rolling: 'يتم الرمي...', tossing: 'يتم القلب...',
      heads: 'ملك', tails: 'كتابة', yes: 'نعم', no: 'لا', maybe: 'ربما',
      total: 'المجموع', quantity: 'الكمية', result: 'النتيجة', copy: 'نسخ',
      copied: 'تم النسخ!', reset: 'إعادة ضبط', save: 'حفظ', registry: 'السجل',
      resolved: 'الأحداث الماضية', clearAll: 'مسح الكل', truth: 'صراحة', dare: 'تحدي',
      consulting: 'يفكر...', purge: 'تطهير', options: 'خيارات',
      onlineRequired: 'مطلوب إنترنت', aiPowered: 'ذكاء اصطناعي',
      vault: 'خزانة الألوان', favorites: 'المفضلات',
      confirmPurge: 'متأكد؟', confirmReset: 'إعادة ضبط التطبيق؟',
      placeholderSearch: 'البحث عن الألوان...',
      clearResult: 'مسح النتيجة', tapToConsult: 'اضغط للاستشارة',
      analyzing: 'جاري التحليل...', outcomeSelected: 'النتيجة المختارة',
      emptyReel: 'قائمة فارغة', systemIdle: 'النظام خامل', autoPurge: 'تطهير تلقائي',
      runSelection: 'بدء الاختيار', processing: 'جاري المعالجة...',
      selectedUnit: 'الوحدة المختارة', tapToCopy: 'اضغط للنسخ',
      version: 'v1.4.2', today: 'اليوم', yesterday: 'أمس',
      min: 'الأدنى', max: 'الأقصى', listInput: 'إدخال القائمة', optionsPool: 'مجموعة الخيارات',
      vibePrompt: 'وصف الجو', rename: 'إعادة تسمية', delete: 'حذف',
      abort: 'إلغاء', confirmWipe: 'تأكيد المسح', units: 'وحدات',
      placeholderList: 'عنصر واحد لكل سطر...', placeholderWheel: 'خيارات مفصولة بفاصلة...',
      madeBy: 'صنع بواسطة', historyTooltip: 'سجل التاريخ', settingsTooltip: 'إعدادات النظام',
      decisionLatched: 'القرار مغلق',
      vibes: {
        casual: 'بسيط', party: 'حفلة', deep: 'عميق', cyberRebel: 'متمرد',
        boy: 'ولد', girl: 'بنت', neon: 'نيون', nature: 'طبيعة', royal: 'ملكي'
      }
    },
    settings: {
      title: 'الإعدادات', language: 'اللغة', audio: 'الأصوات',
      voice: 'صوت AI', haptics: 'اللمس', fidelity: 'المؤثرات',
      voicePersona: 'شخصية AI', theme: 'اللون', brightness: 'السطوع',
      diceSkin: 'شكل النرد', coinSkin: 'شكل العملة', factoryReset: 'إعادة ضبط المصنع',
      social: 'المجتمع', github: 'كود المصدر', discord: 'ديسكورد',
      skins: { standard: 'كلاسيكي', stealth: 'تخفي', neon: 'نيون', marble: 'رخام', digital: 'رقمي', abstract: 'تجريدي' },
      themes: { light: 'فاتح', dark: 'داكن', midnight: 'ليل', sepia: 'قديم', nord: 'نورد', sakura: 'ساكورا', forest: 'غابة' }
    }
  },
  id: {
    tools: {
      [ToolType.DICE]: 'Dadu', [ToolType.COIN]: 'Koin', [ToolType.YES_NO]: 'Ya/Tidak',
      [ToolType.NUMBER]: 'Angka', [ToolType.WHEEL]: 'Roda', [ToolType.PICKER]: 'Pilih',
      [ToolType.COLOR]: 'Warna', [ToolType.TRUTH_DARE]: 'Jujur/Tantangan'
    },
    bios: {
      [ToolType.DICE]: 'Probabilitas Mekanik', [ToolType.COIN]: 'Gambar / Angka',
      [ToolType.YES_NO]: 'Inti Ramalan', [ToolType.NUMBER]: 'Sintesis Bilangan',
      [ToolType.WHEEL]: 'Seleksi Mekanis', [ToolType.PICKER]: 'Ekstraksi Acak',
      [ToolType.COLOR]: 'Analisis Warna', [ToolType.TRUTH_DARE]: 'Konsultasi Nasib',
      tagline: 'Biarkan takdir yang memilih.'
    },
    common: {
      generate: 'Mulai!', rolling: 'Mengocok...', tossing: 'Melempar...',
      heads: 'Gambar', tails: 'Angka', yes: 'IYA', no: 'TIDAK', maybe: 'MUNGKIN',
      total: 'Total', quantity: 'Jumlah', result: 'Hasil', copy: 'Salin',
      copied: 'Tersalin!', reset: 'Ulang', save: 'Simpan', registry: 'Riwayat',
      resolved: 'Data Terakhir', clearAll: 'Hapus Semua', truth: 'Jujur', dare: 'Tantangan',
      consulting: 'Berpikir...', purge: 'Bersihkan', options: 'Opsi',
      onlineRequired: 'Butuh Koneksi', aiPowered: 'Tenaga AI',
      vault: 'Gudang Warna', favorites: 'Favorit',
      confirmPurge: 'Yakin?', confirmReset: 'Reset Total?',
      placeholderSearch: 'Cari warna, vibe, hex...',
      clearResult: 'Hapus Hasil', tapToConsult: 'Klik untuk Tanya',
      analyzing: 'Menganalisis...', outcomeSelected: 'Hasil Terpilih',
      emptyReel: 'Data Kosong', systemIdle: 'Sistem Siaga', autoPurge: 'Hapus Otomatis',
      runSelection: 'Jalankan Seleksi', processing: 'Memproses...',
      selectedUnit: 'Unit Terpilih', tapToCopy: 'Klik untuk Salin',
      today: 'Hari Ini', yesterday: 'Kemarin',
      min: 'Min', max: 'Maks', listInput: 'Input Daftar', optionsPool: 'Kumpulan Opsi',
      vibePrompt: 'Prompt Vibe', rename: 'Ubah Nama', delete: 'Hapus',
      abort: 'Batal', confirmWipe: 'Konfirmasi Hapus', units: 'unit',
      placeholderList: 'Satu item per baris...', placeholderWheel: 'Opsi dipisahkan koma...',
      madeBy: 'Dibuat oleh', historyTooltip: 'Log Riwayat', settingsTooltip: 'Setelan Sistem',
      decisionLatched: 'Keputusan Terkunci',
      vibes: {
        casual: 'Santai', party: 'Pesta', deep: 'Dalam', cyberRebel: 'Pemberontak',
        boy: 'Laki-laki', girl: 'Perempuan', neon: 'Neon', nature: 'Alam', royal: 'Kerajaan'
      }
    },
    settings: {
      title: 'Setelan', language: 'Bahasa', audio: 'Suara',
      voice: 'Suara AI', haptics: 'Getaran', fidelity: 'Visual FX',
      voicePersona: 'AI Persona', theme: 'Accent', brightness: 'Kecerahan',
      diceSkin: 'Skin Dadu', coinSkin: 'Skin Koin', factoryReset: 'Reset Pabrik',
      social: 'Komunitas', github: 'Kode Sumber', discord: 'Discord',
      skins: { standard: 'Klasik', stealth: 'Stealth', neon: 'Neon', marble: 'Marmer', digital: 'Digital', abstract: 'Abstrak' },
      themes: { light: 'Terang', dark: 'Gelap', midnight: 'Midnight', sepia: 'Sepia', nord: 'Nord', sakura: 'Sakura', forest: 'Hutan' }
    }
  }
};

export const getTranslation = (lang: Language) => TRANSLATIONS[lang] || TRANSLATIONS.en;
