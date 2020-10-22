const building_bases = require('./buildings_bases.json');
const research_bases = require('./research_bases.json');
const unit_bases = require('./units_bases.json');

const _ = require('lodash');
const c = require('config');

module.exports = (/*available_tech, available_infrastructure, required_tech,required_infrastructure*/) => {
    const avail = {
        "tech_requirements": {
            "Power Plant": 1,
        },
        "infrastructure_requirements": {
            "Research Facility": 2,
            "Power Plant": 3
        }
    }
    const required = {
        "tech_requirements": {
            "Power Plant": 1
        },
        "infrastructure_requirements": {
            "Power Plant": 1,
            "Research Facility": 2,
        }
    }

    const required_tech = required.tech_requirements;
    const required_infra = required.infrastructure_requirements;
    const available_tech = avail.tech_requirements;
    const available_infra = avail.infrastructure_requirements;

    for(let [rki,rvi] of Object.entries(required_infra)) {
        for(let [aki,avi] of Object.entries(available_infra)) {
            if(rki===aki && rvi>avi) return false;
        }
    }
    for(let [rkr,rvr] of Object.entries(required_tech)) {
        for(let [akr,avr] of Object.entries(available_tech)) {
            if(rkr===akr && rvr>avr) return false;
        }
    }
    return true;
}