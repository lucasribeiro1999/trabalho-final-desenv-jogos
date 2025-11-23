const defines = {
    LASER: { WIDTH: 5, HEIGHT: 28 },
    PLAYER: { MAX_HEALTH: 5 },
    FIRE: { RATE_MS: 1000 },
    SPRITE: { SCALE_UP: 2 },
    XP: { PER_ZOMBIE: 10, REROLL_COST: 50 },
    COLORS: {
        WHITE: "#ebecfa",
        BLUE: "#1f4bc5",
        PURPLE: "#6f20b9",
        ORANGE: "#df4620",
        GREEN: "#2aee54",
        YELLOW: "#ffe02f",
        RED: "#f00c3e",
    },
    LEVEL: {
        XP_PER_LEVEL: 50,
        MAX_WEAPON_LEVEL: 5
    },
    WEAPONS: {
        PISTOL: { NAME: "pistol", RATE_MS: 1000 },
        RIFLE: { NAME: "rifle", RATE_MS: 320 },
        SHOTGUN: { NAME: "shotgun", RATE_MS: 3000 },
        CONFIG_BY_NAME: {
            pistol: {
                baseRateMs: 1000,
                baseDamage: 1,
                baseRange: 350,
                baseProjectiles: 1
            },
            rifle: {
                baseRateMs: 320,
                baseDamage: 1.5,
                baseRange: 550,
                baseProjectiles: 1
            },
            shotgun: {
                baseRateMs: 3000,
                baseDamage: 2,
                baseRange: 280,
                baseProjectiles: 3
            }
        }
    },
    ENEMY: { BASE_HEALTH: 5 },
    UPGRADES: {
        HEAL: "heal",
        LUCK_INCREASE: "luck-increase",
        MORE_MAX_HEALTH: "more-max-health",
        MOVE_SPEED_INCREASE: "move-speed-increase",
        XP_DROP_INCREASE: "xp-drop-increase",
    }
};

const WEAPON_DROP_RARITIES = [
    { type: "common", chance: 70, minLevel: 1, maxLevel: 2 },
    { type: "rare", chance: 20, minLevel: 3, maxLevel: 4 },
    { type: "legendary", chance: 10, minLevel: 5, maxLevel: 5 }
];

export default defines;
export { WEAPON_DROP_RARITIES };
