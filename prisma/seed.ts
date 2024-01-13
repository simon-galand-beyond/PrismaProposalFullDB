import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

const seed = {
    ParameterDetails: [
        {name: "kp_elevation", publicName: "KP Elevation", unit: "", min:0, max:200, accessLevel:1},
        {name: "ki_elevation", publicName: "KI Elevation", unit: "", min:0, max:900, accessLevel:1},
        {name: "kd_elevation", publicName: "KD Elevation", unit: "", min:0, max:10, accessLevel:1},
        {name: "kp_lacet", publicName: "KP Lacet", unit: "", min:0, max:200, accessLevel:1},
        {name: "ki_lacet", publicName: "KI Lacet", unit: "", min:0, max:10, accessLevel:0},
        {name: "kd_lacet", publicName: "KD Lacet", unit: "", min:0, max:1, accessLevel:0},
        ]
}

async function main(){
    for (const detail of seed.ParameterDetails) {
        const paramDetail = await prisma.parameterDetails.upsert({where: {name: detail.name}, update: {}, create: detail});
        console.log(paramDetail);
    }
}

main()
    .catch(e => {
        throw e
    })
    .finally(async () => {
        await prisma.$disconnect()
    })