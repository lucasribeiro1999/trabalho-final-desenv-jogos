export function tryCalculateDrop(luckLevel = 0) {
    const dropChance = 0.20 + (luckLevel * 0.05);

    if (Math.random() >= dropChance) {
        return null;
    }

    const pickWeighted = (options) => {
        let totalWeight = 0;
        for (const opt of options) {
            totalWeight += opt.weight;
        }

        let random = Math.random() * totalWeight;
        for (const opt of options) {
            if (random < opt.weight) {
                return opt.value;
            }
            random -= opt.weight;
        }
        return options[0].value;
    };

    const weaponTypeOptions = [
        { value: "pistol", weight: 60 },
        { value: "rifle", weight: 30 + (luckLevel * 10) },
        { value: "shotgun", weight: 10 + (luckLevel * 5) }
    ];
    const type = pickWeighted(weaponTypeOptions);

    const levelOptions = [
        { value: 1, weight: 70 },
        { value: 2, weight: 20 + (luckLevel * 10) },
        { value: 3, weight: 10 + (luckLevel * 5) }
    ];
    const level = pickWeighted(levelOptions);

    let rarity = "common";
    if (level === 2) rarity = "rare";
    if (level === 3) rarity = "legendary";

    return {
        type: type,
        level: level,
        rarity: rarity
    };
}
