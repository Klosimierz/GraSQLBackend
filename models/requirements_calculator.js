const _ = require('lodash');

module.exports = (infra_available,res_available,infra_required,res_required) => {

    if(_.isEmpty(infra_required) && _.isEmpty(res_required)) 
    {      
        return true;
    }

    let avail_infrastructure = {};
    let avail_research = {};

    infra_available.forEach((fullObject)=>{       
        avail_infrastructure[fullObject.name] = fullObject.level;
    });
    res_available.forEach((fullObject)=>{
        avail_research[fullObject.name] = fullObject.level;
    });

    for(let [rki,rvi] of Object.entries(infra_required)) {
        if(!_.has(avail_infrastructure,rki))
            return false;
            else {
                for(let [aki,avi] of Object.entries(avail_infrastructure)) {
                    if(rki===aki && rvi>avi)
                        return false;
                }
            }
        }
    for(let [rkr,rvr] of Object.entries(res_required)) {
        if(!_.has(avail_research,rkr))
            return false;
            else {
                for(let [akr,avr] of Object.entries(avail_infrastructure)) {
                    if(rkr===akr && rvr>avr)
                        return false;
                }
            }
    }
    return true;
}