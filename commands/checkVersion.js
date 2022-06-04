const greaterVersion = (v_old, v_new) => {
    let res = {
        major : false,
        minor : false,
        patch : false
    };
    if(v_old[0] > v_new[0]){        //existing version is major update(s) ahead
        return res
    }
    if(v_old[0] < v_new[0]){        //existing version is major update(s) behind
        return {...res, major : true}
    }
    if(v_old[1] > v_new[1]){        //existing version is minor update(s) ahead
        return res
    }
    if(v_old[1] < v_new[1]){        //existing version is minor update(s) behind
        return {...res, minor : true}
    }
    if(v_old[2] >= v_new[2]){       //existing version is patch update(s) ahead or is at same version
        return res
    }
    return {...res,patch : true}    //existing version is patch update(s) behind
}

const checkVersion = (version_old, version_new) => {
    version_new = version_new.split('.').map(Number)
    let versionInfo = new Array(new Array());
    if(version_old.includes('-')){
        versionInfo[0] = version_old.split('-')[0].split('.').map(Number);
        versionInfo[1] = version_old.split('-')[1].split('.').map(Number);
        let lowerResponse = greaterVersion(versionInfo[0], version_new);
        let lowerFlag = false;
        for (const key in lowerResponse) {
            if(lowerResponse[key]){
                lowerFlag = true;
            }
        }
        if(!lowerFlag){     //below lower range -> requires no update
            return {
                satisfied : true
            }
        }
        let upperResponse = greaterVersion(version_new, versionInfo[1]);
        let upperFlag = false;
        for (const key in upperResponse) {
            if(upperResponse[key]){
                upperFlag = true;
            }
        }
        if(!upperFlag){     //below upper range -> requires normal update
            return {
                satisfied : false
            }
        }else{              //above upper range -> requires force update
            return {
                satisfied : false,
                forceRequired : true
            }
        }
    }else if(version_old.charAt() === '^' || version_old.charAt() === '~'){
        versionInfo[0] = version_old.slice(1).split('.').map(Number);
        let gtResponse = greaterVersion(versionInfo[0], version_new);
        if(!(gtResponse["major"] || gtResponse["minor"] || gtResponse["patch"])){          //above specified version -> requires no update
            return {
                satisfied : true
            }
        }
        if(gtResponse["major"]){      //requires major update
            return {
                satisfied : false,
                forceRequired : true
            }
        }else if(version_old.charAt() === '~' && gtResponse["minor"]){    //requires minor update
            return {
                satisfied : false,
                forceRequired : true
            }
        }
        else{                          //requires normal update
            return {
                satisfied : false
            }
        }
    }
    else if((version_old.split('.').length - 1) == 0){
        versionInfo[0] = version.split('.').map(Number).concat([0,0]);
        let gtResponse = greaterVersion(versionInfo[0], version_new);
        if(!(gtResponse["major"] || gtResponse["minor"] || gtResponse["patch"])){          //above specified version -> requires no update
            return {
                satisfied : true
            }
        }
        if(gtResponse["major"]){      //requires major update
            return {
                satisfied : false,
                forceRequired : true
            }
        }else{
            return {            //requires normal update
                satisfied : false
            }
        }
    }else if((version_old.split('.').length - 1) == 1){
        versionInfo[0] = version.split('.').map(Number).concat([0]);
        let gtResponse = greaterVersion(versionInfo[0],version_new);
        if(!(gtResponse["major"] || gtResponse["minor"] || gtResponse["patch"])){          //above specified version -> requires no update
            return {
                satisfied : true
            }
        }
        if(gtResponse["major"] || gtResponse["minor"]){      //requires major or minor update
            return {
                satisfied : false,
                forceRequired : true
            }
        }
        else{                          //requires normal update
            return {
                satisfied : false
            }
        }
    }
}

export default checkVersion;