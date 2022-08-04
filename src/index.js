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
        this.converterPath = path.resolve(`./src/converter/SchemToCMD.jar`)
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
                `1. Copy and paste data into pastedata.txt file\n` +
                `2. Exit out program\n`
            ))

        console.log(chalk.redBright(`Required settings`))
        
        console.log(

            `${chalk.cyan(`Enable:`)} ✅ | ${chalk.cyan(`Optional:`)} ▬ | ${chalk.cyan(`Disable:`)} ❌\n\n` +

            `${chalk.blue(`New Command Offset:`)} ${chalk.bgGrey(`East No Space`)}\n` +
            `${chalk.blue(`Base:`)} ${chalk.bgGrey(`NONE`)}\n` +
            `${chalk.blue(`XYZ Build Offset:`)} ▬\n\n` +

            `${chalk.blue(`Quiet:`)} ▬\n` +
            `${chalk.blue(`Clear:`)} ▬\n` +
            `${chalk.blue(`No Dangerous Blocks:`)} ▬\n` +
            `${chalk.blue(`No Monsters:`)} ✅\n` +
            `${chalk.blue(`No Mobs:`)} ✅\n` +
            `${chalk.blue(`Remove Darriers:`)} ▬\n` +
            `${chalk.blue(`Ignore Wire Power:`)} ✅\n` +
            `${chalk.blue(`Complex Rails:`)} ✅\n` +
            `${chalk.blue(`Min Water:`)} ✅\n` +
            `${chalk.blue(`Min Entities:`)} ✅\n`
        )

        await exe(`start /wait ${this.converterPath}`);

        const fileName = await inquirer.prompt({
            name: `input`,
            type:  `input`,
            message: chalk.blue(`Input File Name:`)
        })

        this.convertDataToMCFunction(fileName.input)
    }


    async convertDataToMCFunction(fileName) {
        const data = await fs.promises.readFile(`./pasteData.txt`, { encoding: 'utf8' });
        const regex = /(setblock ~(\d+ |\D)~(\d+ |\D)~(\d+ |\D)(\w+ |\w+)(\d+|)|fill ~(\d+ |\D)~(\d+ |\D)~(\d+ |\D)~(\d+ |\D)~(\d+ |\D)~(\d+ |\D)(\w+ |\w+)(\d+|))/gm
        const commands = data.match(regex)

        let dir = fs.readdirSync('./mcfunctions')

        // removes all files 
        for(var file of dir) {
            try {
                fs.unlinkSync(`./mcfunctions/${file}`)
            } catch(err) {
                console.error(err)
            }
        }

        let files = Math.floor(commands.length/10000)

        //create main function
        fs.writeFile(`./mcfunctions/${fileName}.mcfunction`, '', () => {})

        if(files != 0) {

            var fileNum = 0
            for(var line in commands) {
                if(line % 10000 == 0) {
                    fileNum++ // 0 % 10000 = 0
                    fs.appendFileSync(`./mcfunctions/${fileName}.mcfunction`, `function ${fileName}${fileNum}\n`);
                }

                fs.appendFileSync(`./mcfunctions/${fileName}${fileNum}.mcfunction`, `${commands[line]}\n`);
            }

        } else {
            for(var command of commands) {
                fs.appendFileSync(`./mcfunctions/${fileName}.mcfunction`, `${command}\n`);
            }
        }

        console.clear();
        console.log(chalk.yellow(`\nFinished converting`));
        console.log('\nPress any key to exit');
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.on('data', process.exit.bind(process, 0));
    }


    // may be used for new updates
    // async convertDataPacksToMCFunctions() {

    //     let dataPacks = fs.readdirSync('./datapacks')
    //     for(var dataPack of dataPacks) {
    //         // error occured or invalid format
    //         const error = await this.extractDataPack(dataPack)
    //         if(error) continue
    //         this.createMCFunction(dataPack)
    //     }

    //     console.log('Press any key to exit');
    //     process.stdin.setRawMode(true);
    //     process.stdin.resume();
    //     process.stdin.on('data', process.exit.bind(process, 0));
    // }


    // async extractDataPack(dataPack) {
    //     const extname = path.extname(dataPack);
    //     if(extname != ".zip") {
    //         // console.log(`Not a zip file`)
    //         return true
    //     }

    //     try {
    //         await extract(`${this.dataPackPath}/${dataPack}`, { dir: this.extractionPath })
    //     } catch (err) {
    //         console.log(err)
    //         console.log(`error on extraction`)
    //         return true
    //     }

    //     // console.log(`Extracted ${dataPack}`)
    //     return false
    // }


    // async createMCFunction(dataPack) {
    //     // console.log(`Creating MCBE MCFunction for ${dataPack}`)

    //     // java program create folder dir with dataPackName
    //     const dataPackName = path.parse(dataPack).name
    //     let data;

    //     try {
    //         data = await fs.promises.readFile(`${this.extractionPath}/data/s2cb/functions/${dataPackName}/spawn.mcfunction`, { encoding: 'utf8' });
    //     } catch (err) {
    //         console.log(err);
    //         console.log(`error on reading NBT Data Pack`)
    //         return
    //     }

    //     fs.writeFile(`./mcfunctions/${dataPackName}.mcfunction`, data.replace(/\[.+\]|{.+}/gm, ''),  {encoding: 'utf8'}, () => {
    //         console.log(`${dataPackName}.mcfunction created`)
    //     })
    // }
}

new converter().start()
