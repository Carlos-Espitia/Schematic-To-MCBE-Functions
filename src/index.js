import chalk from 'chalk';
import inquirer from 'inquirer';
import fs from 'fs'
import { exec } from 'child_process'
const exe = util.promisify(exec);
import util from 'util';
import path from 'path'
import extract from 'extract-zip'



class converter {
    constructor() {
        this.extractionPath = path.resolve(`./datapacks/extraction`);
        this.dataPackPath = path.resolve(`./datapacks`);
        this.converterPath = path.resolve(`./src/converter/schemToNBT.jar`)
    }

    async start() {
        console.clear();
        console.log(chalk.yellow(`\nThis tool is used for converting schematics and NBT Pack into a mcbe setblock/fill commands MCFunction file.\n`));
        const answers = await inquirer.prompt({
            name: `selected`,
            type:  `list`,
            message: chalk.blue(`Choose a converter\n`),
            choices: [
                `Schematic => MCFunction (MCBE)`,
                // `NBT Pack => MCFunction (MCBE)`,
            ]
        })
        console.clear();
        if(answers.selected == `Schematic => MCFunction (MCBE)`) this.schematicToMCFunction()
        // if(answers.selected == `NBT Pack => MCFunction (MCBE)`) return
    }

    async schematicToMCFunction() {
        console.log(
            chalk.yellow(
                `1. Convert schematic to a Data Pack\n` + 
                `2. Save the Data Pack in the "datapacks" folder\n` + 
                `3. Exit out the program\n`
            ))

        console.log(chalk.redBright(`Required settings`))
        
        console.log(

            `${chalk.cyan(`Enable:`)} ✅ | ${chalk.cyan(`Optional:`)} ▬ | ${chalk.cyan(`Disable:`)} ❌\n\n` +

            `${chalk.blue(`Output:`)} ${chalk.bgGrey(`Data Pack`)}\n` +
            `${chalk.blue(`New Command Offset:`)} ${chalk.bgGrey(`East No Space`)}\n` +
            `${chalk.blue(`Base:`)} ${chalk.bgGrey(`NONE`)}\n` +
            `${chalk.blue(`XYZ Build Offset:`)} ▬\n\n` +

            `${chalk.blue(`Quiet:`)} ▬\n` +
            `${chalk.blue(`Clear:`)} ▬\n` +
            `${chalk.blue(`No Dangerous Blocks:`)} ▬\n` +
            `${chalk.blue(`No Monsters:`)} ✅\n` +
            `${chalk.blue(`No Mobs:`)} ✅\n` +
            `${chalk.blue(`No Projectiles:`)} ✅\n` +
            `${chalk.blue(`Limit Cmd Distance:`)} ❌\n` +
            `${chalk.blue(`Server Safe:`)} ❌\n` +
            `${chalk.blue(`Remove Darriers:`)} ▬\n` +
            `${chalk.blue(`Ignore Unneeded Block State:`)} ✅\n` +
            `${chalk.blue(`Redstone Dots to Pulses:`)} ✅\n` +
            `${chalk.blue(`Complex Rails:`)} ✅\n` +
            `${chalk.blue(`Min Water:`)} ✅\n` +
            `${chalk.blue(`Min Entities:`)} ✅\n` +
            `${chalk.blue(`Hollow Out:`)} ▬\n` +
            `${chalk.blue(`Clone Areas:`)} ❌\n` +
            `${chalk.blue(`Imperfect Fills:`)} ❌\n`
        )


        await exe(`start /wait ${this.converterPath}`);
        console.clear();
        this.convertDataPacksToMCFunctions()
        // console.log('stdout:', stdout);
        // console.log('stderr:', stderr);
    }

    async convertDataPacksToMCFunctions() {

        let dataPacks = fs.readdirSync('./datapacks')
        for(var dataPack of dataPacks) {
            // error occured or invalid format
            const error = await this.extractDataPack(dataPack)
            if(error) continue
            this.createMCFunction(dataPack)
        }

        console.log('Press any key to exit');
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.on('data', process.exit.bind(process, 0));
    }


    async extractDataPack(dataPack) {
        const extname = path.extname(dataPack);
        if(extname != ".zip") {
            // console.log(`Not a zip file`)
            return true
        }

        try {
            await extract(`${this.dataPackPath}/${dataPack}`, { dir: this.extractionPath })
        } catch (err) {
            console.log(err)
            console.log(`error on extraction`)
            return true
        }

        // console.log(`Extracted ${dataPack}`)
        return false
    }


    async createMCFunction(dataPack) {
        // console.log(`Creating MCBE MCFunction for ${dataPack}`)

        // java program create folder dir with dataPackName
        const dataPackName = path.parse(dataPack).name
        let data;

        try {
            data = await fs.promises.readFile(`${this.extractionPath}/data/s2cb/functions/${dataPackName}/spawn.mcfunction`, { encoding: 'utf8' });
        } catch (err) {
            console.log(err);
            console.log(`error on reading NBT Data Pack`)
            return
        }

        fs.writeFile(`./mcfunctions/${dataPackName}.mcfunction`, data.replace(/\[.+\]|{.+}/gm, ''),  {encoding: 'utf8'}, () => {
            console.log(`${dataPackName}.mcfunction created`)
        })
    }
}

new converter().start()
