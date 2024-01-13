import {PrismaClient} from '@prisma/client';
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

async function addVoile(name: string) {
    const voile = await prisma.voile.create({data: {name: name}});
    console.log(voile);
    return voile;
}

async function addParam(name: string, value: number, pilot:string, voileId: number) {
    const param = await prisma.parameter.create({
        data: {
            name: name,
            value: value,
            pilot: pilot,
            voileId: voileId,
        }
    });
    console.log(param);
    return param;
}
interface StaticPilotParameters {
    kp_elevation: number,
    ki_elevation: number,
    kd_elevation: number,
    kp_lacet: number,
    ki_lacet: number,
    kd_lacet: number,
}

type StaticPilotParametersKey = keyof StaticPilotParameters;


/**
 * Example of function used to maintain data consistency when adding a set of parameters
 * @param voileId
 * @param values
 */
async function addStaticPilotParameters(voileId:number, values: StaticPilotParameters) {
    let params = [];

   for (const [key, value] of Object.entries(values)) {
        const param = await addParam(key, value, "static", voileId);
        params.push(param);
    }

    return params;
}

async function validateStaticPilotParameters(values: StaticPilotParameters) {
    const paramsDetails = await prisma.parameterDetails.findMany({where: {pilot: "static"}});

    let isValid = true;
    //if we want to get an output of type StaticPilotParameters
    paramsDetails?.forEach((paramDetail) => {
        
          if(!values.hasOwnProperty(paramDetail.name)){
                throw new Error("Missing parameter: " + paramDetail.name);
            }

            if(values[paramDetail.name as StaticPilotParametersKey] < paramDetail.min || values[paramDetail.name as StaticPilotParametersKey] > paramDetail.max){
                console.log("Parameter " + paramDetail.name + " is out of range. Min: " + paramDetail.min + " Max: " + paramDetail.max + " Value: "+ values[paramDetail.name as StaticPilotParametersKey]);
                isValid = false;
            }
    })

    return isValid;
}

async function retrieveStaticPilotParameters(voileId:number) {
    const params = await prisma.voile.findUnique({where: {id: voileId}}).Parameter({where: {pilot: "static"}});
    //or
    //const params = await prisma.parameter.findMany({where: {pilot: "static", voileId: voileId}});

    //if we want to get an output of type StaticPilotParameters
    const staticParams : StaticPilotParameters | undefined = params?.map((param) => {
        return {[param.name]: param.value};
    }).reduce((acc, curr) => ({...acc, ...curr}), {} as StaticPilotParameters);

    return staticParams;
}

async function main(){
    const allParams = await prisma.parameter.findMany({include:{details: true}});
    console.log(allParams);

    //Example of adding a parameter with a wrong name : The exception need to be handled
    try{
        const wrongNameParam = await addParam("wrong_name", 1, "test", 1);
        console.log(wrongNameParam);
    }catch(e){
        if(e instanceof PrismaClientKnownRequestError && e.code === "P2003"){
            console.log("The parameter \"name\" is wrong: no details found for this name");
        }else{
            throw e;
        }
    }

    //Add a set of parameters for a new voile (randomly generated name for the voile and random values for the parameters)
    const voile = await addVoile("voile_" + Math.floor(Math.random() * 1000));
    //generate random values for the parameters
    const randomValues : StaticPilotParameters = {
        kp_elevation: Math.random(),
        ki_elevation: Math.random(),
        kd_elevation: Math.random(),
        kp_lacet: Math.random(),
        ki_lacet: Math.random(),
        kd_lacet: Math.random(),
    }
    // const params = await addStaticPilotParameters(voile.id, randomValues);
    // console.log(params);


    //Retrieve the parameters for static pilot and the voile id 2
    const staticParams = await retrieveStaticPilotParameters(2);
    console.log(staticParams);


    //Validate the parameters for static pilot
    const isValid = await validateStaticPilotParameters(randomValues);
    console.log(isValid);


}


main()
    .catch(e => {
        throw e
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

