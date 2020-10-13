const building_bases = require('./buildings_bases.json');
const research_bases = require('./research_bases.json');
const unit_bases = require('./units_bases.json');

module.exports = (type, tier, level) => {

    let sheet = null;

    switch (type) {
        case 'B': {
            sheet = building_bases;
            break;
        }
        case 'R': {
            sheet = research_bases;
            break;
        }
        case 'F': {
            sheet = unit_bases;
            break;
        }
    }

    const { modifiers, buildings } = sheet;

    return {
        "resources_needed": bluntedPowMultiple(buildings[tier].cost, level, modifiers.res_modifier),
        "time_needed": bluntedPowSingle(buildings[tier].base_time, level, modifiers.t_modifier)
    }
}
//CONTAINED INSIDE BUILDINGS_BASE
//BASE_COST: cost.res_A/res_B/res_C ; BASE_TIME: base_time; MODIFIERS: modifiers.res_modifier, modifiers.t_modifier
function bluntedPowSingle(base_cost, pick_level, modifier) {
    //Returns flat time/resource cost, no bonus modifiers applied
    return Math.round(Math.pow(base_cost, (1 + pick_level * modifier - modifier)));
}

function bluntedPowMultiple(base_cost, pick_level, modifier) {
    return {
        "A_Cost": bluntedPowSingle(base_cost.res_A, pick_level, modifier),
        "B_Cost": bluntedPowSingle(base_cost.res_B, pick_level, modifier),
        "C_Cost": bluntedPowSingle(base_cost.res_C, pick_level, modifier),
    }
}