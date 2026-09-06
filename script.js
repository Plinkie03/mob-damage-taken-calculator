const Monsters = {
    behemoth: {
        attack: 100,
        magical: false,
    },
    revenant: {
        attack: 110,
        magical: true,
    },
    shadow: {
        attack: 115,
        magical: true,
    },
    demon: {
        attack: 120,
        magical: true,
    },
    orc: {
        attack: 130,
        magical: false,
    },
    orcworker: {
        attack: 135,
        magical: false,
    },
    orcwarrior: {
        attack: 145,
        magical: false,
    },
    wildsoldier: {
        attack: 145,
        magical: false,
    },
    wasp: {
        attack: 140,
        magical: true,
    },
    berzerker: {
        attack: 165,
        magical: false,
    },
    shambler: {
        attack: 180,
        magical: false,
    },
    bloodseeker: {
        attack: 180,
        magical: false,
    },
    slimespitter: {
        attack: 180,
        magical: true,
    },
    bandit: {
        attack: 135,
        magical: false,
    },
    110: {
        attack: 230,
        magical: true,
    },
    120: {
        attack: 250,
        magical: true,
    },
    netherslime: {
        attack: 250,
        magical: false,
    },
    violator: {
        attack: 300,
        magical: false,
    },
    130: {
        attack: 300,
        magical: true,
    },
    hunter: {
        attack: 135,
        magical: false,
    },
    thief: {
        attack: 135,
        magical: false,
    },
};

const Wobble = [0.65, 1.3];
const critDamageMult = 2;

document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("btn");
    const level = document.getElementById("level");
    const armor = document.getElementById("armor");
    const defenseSkill = document.getElementById("defense-skill");
    const defenseBonus = document.getElementById("defense-bonus");
    const resistance = document.getElementById("resistance");
    const mob = document.getElementById("mob");

    const resultNoCrit = document.getElementById("dmg-range");
    const resultCrit = document.getElementById("dmg-range-crit");
    const flatRed = document.getElementById("flat-red");
    const resRed = document.getElementById("res-red");
    const totalRed = document.getElementById("total-red");

    const inputs = [level, armor, defenseSkill, defenseBonus, resistance, mob];

    inputs.forEach((input) => {
        const savedValue = localStorage.getItem(`damage-calc-${input.id}`);

        if (savedValue !== null) {
            input.value = savedValue;
        }

        input.addEventListener("input", () => {
            calculate();
            localStorage.setItem(`damage-calc-${input.id}`, input.value);
        });
    });

    function calculate() {
        const levelValue = parseInt(level.value) || 0;
        const armorValue = parseInt(armor.value) || 0;
        const defenseSkillValue = parseInt(defenseSkill.value) || 0;
        const defenseBonusValue = parseInt(defenseBonus.value) || 0;
        const resistanceValue = (parseInt(resistance.value) || 0) / 100;
        const mobData = Monsters[mob.value];
        const mobDamageValue =
            parseInt(mobData.attack * (mobData.magical ? 1.1 : 1)) || 0;

        const totalReduction = Math.floor(
            (defenseSkillValue + defenseBonusValue) / 5 + armorValue / 2,
        );

        function calcDamageWithWobble(wobbleN, isCrit = false) {
            const critMult = isCrit ? critDamageMult : 1;

            const damage =
                (mobDamageValue * wobbleN - mobDamageValue * resistanceValue) *
                    critMult -
                totalReduction;

            return Math.floor(Math.max(damage, 0));
        }

        function getRangeDamage(isCrit = false) {
            return Wobble.map((x) => calcDamageWithWobble(x, isCrit)).join("-");
        }

        flatRed.textContent = totalReduction.toString();
        resultNoCrit.textContent = getRangeDamage();
        resultCrit.textContent = getRangeDamage(true);
    }

    btn.addEventListener("click", calculate);

    calculate();
});
