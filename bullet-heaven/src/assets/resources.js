export let GAME_RESOURCES = [

    /* Graphics.
     * @example
     * { name: "example", type:"image", src: "data/img/example.png" },
     */
    { name: "bullet", type: "image", src: "src/assets/bullet.png" },
    { name: "player", type: "json", src: "src/assets/player/player.json" },
    { name: "player", type: "image", src: "src/assets/player/player.png" },
    { name: "zombie-axe-idle", type: "image", src: "src/assets/zombie-axe/idle.png" },
    { name: "zombie-axe-death", type: "image", src: "src/assets/zombie-axe/death.png" },
    { name: "zombie-big-idle", type: "image", src: "src/assets/zombie-big/idle.png" },
    { name: "zombie-big-death", type: "image", src: "src/assets/zombie-big/death.png" },
    { name: "zombie-small-idle", type: "image", src: "src/assets/zombie-small/idle.png" },
    { name: "zombie-small-death", type: "image", src: "src/assets/zombie-small/death.png" },
    { name: "fire-up", type: "image", src: "src/assets/shoots/fire/up.png" },
    { name: "fire-down", type: "image", src: "src/assets/shoots/fire/down.png" },
    { name: "fire-left", type: "image", src: "src/assets/shoots/fire/left.png" },
    { name: "fire-right", type: "image", src: "src/assets/shoots/fire/right.png" },
    { name: "map-01", type: "image", src: "src/assets/zombie-bleak-city-2.png" },
    { name: "filled-heart", type: "image", src: "src/assets/health/filled-heart.png" },
    { name: "empty-heart", type: "image", src: "src/assets/health/empty-heart.png" },
    { name: "heart", type: "image", src: "src/assets/health/heart.png" },
    { name: "cell", type: "image", src: "src/assets/ui/cell.png" },
    { name: "mana", type: "image", src: "src/assets/ui/mana.png" },
    { name: "button-not-pressed", type: "image", src: "src/assets/ui/button-not-pressed.png" },
    { name: "rifle", type: "image", src: "src/assets/weapons/rifle.png" },
    { name: "pistol", type: "image", src: "src/assets/weapons/pistol.png" },
    { name: "shotgun", type: "image", src: "src/assets/weapons/shotgun.png" },
    { name: "heal", type: "image", src: "src/assets/upgrades/heal.png" },
    { name: "luck-increase", type: "image", src: "src/assets/upgrades/luck-increase.png" },
    { name: "more-max-health", type: "image", src: "src/assets/upgrades/more-max-health.png" },
    { name: "move-speed-increase", type: "image", src: "src/assets/upgrades/move-speed-increase.png" },
    { name: "xp-drop-increase", type: "image", src: "src/assets/upgrades/xp-drop-increase.png" },

    /* Maps.
     * @example
     * { name: "example01", type: "tmx", src: "data/map/example01.tmx" },
     * { name: "example01", type: "tmx", src: "data/map/example01.json" },
     */
    // { name: "map-01", type: "tmx", src: "src/assets/zombie-apocalypse.json" },


    /* Tilesets.
     * @example
     * { name: "example01", type: "tsx", src: "data/map/example01.tsx" },
     * { name: "example01", type: "tsx", src: "data/map/example01.json" },
     */
    // { name: "tileset", type: "tsx", src: "src/assets/green-urban-tileset.json" },


    /* Background music.
     * @example
     * { name: "example_bgm", type: "audio", src: "data/bgm/" },
     */
    // ⬇️ CAMINHO CORRETO: Aponta para a PASTA (sem o nome do arquivo)
    { name: "gameplay-theme", type: "audio", src: "src/assets/audio/music/" },

    /* Sound effects.
     * @example
     * { name: "example_sfx", type: "audio", src: "data/sfx/" }
     */
    // { name: "cling", type: "audio", src: "data/sfx/" },
    // { name: "die", type: "audio", src: "data/sfx/" },
    // { name: "enemykill", type: "audio", src: "data/sfx/" },
    // { name: "jump", type: "audio", src: "data/sfx/" },


    /* Atlases
     * @example
     * { name: "example_tps", type: "json", src: "data/img/example_tps.json" },
     */
    // texturePacker
    // { name: "texture", type: "json", src: "data/img/texture.json" },
    // { name: "texture", type: "image", src: "data/img/texture.png" },

    /* Bitmap Font
    * @example
    * { name: "example_fnt", type: "image", src: "data/img/example_fnt.png" },
    * { name: "example_fnt", type: "binary", src: "data/img/example_fnt.fnt" },
    */
    // { name: "PressStart2P", type: "image", src: "data/fnt/PressStart2P.png" },
    // { name: "PressStart2P", type: "binary", src: "data/fnt/PressStart2P.fnt" }
];