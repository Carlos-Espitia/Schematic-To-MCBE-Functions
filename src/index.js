import chalk from 'chalk';
import inquirer from 'inquirer';
import fs from 'fs'
import { exec } from 'child_process'
const exe = util.promisify(exec);
import util from 'util';
import path from 'path'
// import extract from 'extract-zip'


import { Schematic } from 'prismarine-schematic'
import dialog from 'node-file-dialog'



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
                `Schematic => MCBEFunction latest (MCBE)`,
            ]
        })
        console.clear();
        if(answers.selected == 'Schematic => MCBEFunction latest (MCBE)') this.schematicToMCFunction2()
    }

    getBlockStateData(data) {
        const newData = JSON.parse(data
        .replaceAll(' ', '')
        .replaceAll('[', '{')
        .replaceAll(']', '}')
        .replaceAll('=', ':')
        .replaceAll(':', '":') 
        .replaceAll(',', ',"')
        .replaceAll('{', '{"'))

        return newData
    }

    async javaBlockDataToBedrockBlockData() {
        //move block data code here
    }


    async schematicToMCFunction2() {
        const config = {type:'open-files'}

        var selectedFiles;

        try {
            selectedFiles = await dialog(config)
        } catch(err) {
            console.log(err)
            return
        }

        for(var file of selectedFiles) {
            console.log(`Started Converting ${path.basename(file)}`)
            const schematic = await Schematic.read(await fs.promises.readFile(file))
            var commands = await schematic.makeWithCommands({x: '', y: '', z: ''}, 'pe') // air blocks removed modified in module

            // craete for loop to switch all commands to valid mcbe commands
            const placeType = /(\/setblock|\/fill)/
            const coords = /\d+ \d+ \d+/

            console.log(commands.length)

            // converts all blocks to mcbe data blocks
            for(var i = commands.length - 1; i >= 0; i--) {
                const mainCommand = commands[i]

                const placeType2 = mainCommand.match(placeType)[0] // 0 returns place type match
                const coords2 = mainCommand.match(coords)[0]// 0 returns cords match
                var blockType = mainCommand.split(' ')[4]// returns blocktype | need to create block conversion
                var state = ` ${mainCommand.split(' ')[5]}`// returns block state
                if(state == ' undefined' || state == undefined) state = ''

                //used to check if command was updated
                var blockTypeOld = blockType;
                var stateOld = state;


                
                switch(blockType) {
                    // case 'stone': continue
                    // case 'iron_ore': continue
                    // case 'coal_ore': continue
                    // case 'gold_ore': continue
                    // case 'diamond_ore': continue
                    // case 'crafting_table': continue
                    // case 'dirt': continue
                    // case 'glass': continue
                    // case 'prismarine': continue
                    // case 'sea_lantern': continue
                    // case 'enchanting_table': continue
                    // case 'gold_block': continue

                    case 'stone': {
                        state = ''
                        break
                    }

                    case 'iron_bars': {
                        state = ''
                        break
                    }

                    case 'water': {
                        state = ''
                        break
                    }

                    case 'fern': {
                        blockType = 'tallgrass'
                        state = ' 2'
                        break
                    }

                    case 'grass': {
                        blockType = 'tallgrass'
                        state = ' 1'
                        break
                    }

                    case 'grass_block': {
                        blockType = 'grass'
                        state = ''
                        break
                    }

                    case 'dark_prismarine': {
                        blockType = 'prismarine'
                        state = ' 1'
                        break
                    }

                    case 'oak_log': {
                        blockType = "log"
                        state = ' 0'
                        break
                    }

                    case 'cobblestone_wall':{
                        state = ' 0' 
                        break
                    }

                    case 'oak_fence':{
                        blockType = 'fence'
                        state = ' 0' 
                        break
                    }

                    case 'birch_leaves':{
                        blockType = 'leaves'
                        state = ' 2' //data value might be messed
                        break
                    }

                    
                    case 'quartz_pillar': {
                        blockType = "quartz_block"
                        state = ' 2'
                        break
                    }

                    case 'stone_bricks': {
                        blockType = "stonebrick"
                        break
                    }
                    case 'mossy_stone_bricks': {
                        blockType = "stonebrick"
                        state = ' 1'
                        break
                    }
                    case 'cracked_stone_bricks': {
                        blockType = "stonebrick"
                        state = ' 2'
                        break
                    }

                    case 'diorite': {
                        blockType = "stone"
                        state = ' 3'
                        break
                    }
                    case 'polished_diorite': {
                        blockType = "stone"
                        state = ' 4'
                        break
                    }
                    case 'andesite': {
                        blockType = 'stone'
                        state = ' 5'
                        break
                    }
                    case 'polished_andesite': {
                        blockType = "stone"
                        state = ' 6'
                        break
                    }

                    case 'pink_glazed_terracotta': { 
                        if(this.getBlockStateData(state).facing == 'north') state = ' 2'
                        if(this.getBlockStateData(state).facing == 'south') state = ' 3'
                        if(this.getBlockStateData(state).facing == 'west') state = ' 4'
                        if(this.getBlockStateData(state).facing == 'east') state = ' 5'
                        break
                    }

                    case 'damaged_anvil': { // can't change damage value 
                        blockType = "anvil"
                        if(this.getBlockStateData(state).facing == 'north') state = ' 1'
                        if(this.getBlockStateData(state).facing == 'south') state = ' 3'
                        if(this.getBlockStateData(state).facing == 'west') state = ' 0'
                        if(this.getBlockStateData(state).facing == 'east') state = ' 2'
                        break
                    }

                    case 'iron_trapdoor': {
                        //find out how to make upside down
                        if(this.getBlockStateData(state).facing == 'north') state = ' 2'
                        if(this.getBlockStateData(state).facing == 'south') state = ' 3'
                        if(this.getBlockStateData(state).facing == 'west') state = ' 0'
                        if(this.getBlockStateData(state).facing == 'east') state = ' 1'
                        break
                    }

                    case 'quartz_stairs': {
                        //find out how to make upside down
                        if(this.getBlockStateData(state).facing == 'north') state = ' 3'
                        if(this.getBlockStateData(state).facing == 'south') state = ' 2'
                        if(this.getBlockStateData(state).facing == 'west') state = ' 1'
                        if(this.getBlockStateData(state).facing == 'east') state = ' 0'
                        break
                    }

                    case 'stone_brick_stairs': {
                        //find out how to make upside down
                        // console.log(this.getBlockStateData(state))
                        if(this.getBlockStateData(state).facing == 'north') state = ' 3'
                        if(this.getBlockStateData(state).facing == 'south') state = ' 2'
                        if(this.getBlockStateData(state).facing == 'west') state = ' 1'
                        if(this.getBlockStateData(state).facing == 'east') state = ' 0'
                        break
                    }

                    case 'ladder': {
                        if(this.getBlockStateData(state).facing == 'north') state = ' 2'
                        if(this.getBlockStateData(state).facing == 'south') state = ' 3'
                        if(this.getBlockStateData(state).facing == 'west') state = ' 4'
                        if(this.getBlockStateData(state).facing == 'east') state = ' 5'
                        break
                    }
                    case 'furnace': {
                        if(this.getBlockStateData(state).facing == 'north') state = ' 2'
                        if(this.getBlockStateData(state).facing == 'south') state = ' 3'
                        if(this.getBlockStateData(state).facing == 'west') state = ' 4'
                        if(this.getBlockStateData(state).facing == 'east') state = ' 5'
                        break
                    }
                    case 'chest': {
                        if(this.getBlockStateData(state).facing == 'north') state = ' 2'
                        if(this.getBlockStateData(state).facing == 'south') state = ' 3'
                        if(this.getBlockStateData(state).facing == 'west') state = ' 4'
                        if(this.getBlockStateData(state).facing == 'east') state = ' 5'
                        break
                    }

                    case 'nether_brick_slab':{
                        blockType = 'stone_block_slab'
                        if(this.getBlockStateData(state).type == 'top') state = ' 15'
                        if(this.getBlockStateData(state).type == 'bottom') state = ' 7'
                        if(this.getBlockStateData(state).type == 'double') {
                            blockType = 'double_stone_block_slab'
                            state = ' 7'
                        }
                        break
                    }

                    case 'stone_brick_slab':{
                        blockType = 'stone_block_slab'
                        if(this.getBlockStateData(state).type == 'top') state = ' 13'
                        if(this.getBlockStateData(state).type == 'bottom') state = ' 5'
                        if(this.getBlockStateData(state).type == 'double') {
                            blockType = 'double_stone_block_slab'
                            state = ' 5'
                        }
                        break
                    }
                    case 'stone_slab':{
                        blockType = 'stone_block_slab4'
                        if(this.getBlockStateData(state).type == 'top') state = ' 10'
                        if(this.getBlockStateData(state).type == 'bottom') state = ' 2'
                        if(this.getBlockStateData(state).type == 'double') {
                            blockType = 'double_stone_block_slab4'
                            state = ' 2'
                        }
                        break
                    }
                }
                //update command
                if(blockTypeOld != blockType || stateOld != state) commands[i] = `${placeType2} ${coords2} ${blockType}${state}`

            }

            // convert /setblock commands to fill commands if possible
            // redo algorithm

            for (var i = commands.length - 1; i >= 0; i--) {
                if(commands[i] == undefined) continue // block has been grouped to a fill
                const mainCommand = commands[i]
                const placeType2 = mainCommand.match(placeType)[0] // 0 returns place type match
                if(placeType2 == '/fill') continue //skip fill commands
                const coords2 = mainCommand.match(coords)[0]// 0 returns cords match
                const xyz = coords2.split(' ') // returns xyz in list
                var blockType = mainCommand.split(' ')[4]// returns blocktype | need to create block conversion
                var state = ` ${mainCommand.split(' ')[5]}`// returns block state
                if(state == ' undefined' || state == undefined) state = ''


                // check for connected blocks in x
                var connectedList = [] // array to create fill commands with
                var operator = "-" // used to get both ways of xyz
                var connected = true; // true if blocks are still connected in the process 
                var j = 0 // connect counter 
                var search; // used for checking match 
                while(connected) {
                    j++
                    if(operator == "-") search = `/setblock ${Number(xyz[0] - j).toString()} ${xyz[1]} ${xyz[2]} ${blockType}${state}`
                    if(operator == "+") search = `/setblock ${Number(xyz[0] + j).toString()} ${xyz[1]} ${xyz[2]} ${blockType}${state}`
                    var index = commands.indexOf(search)
                    if(commands[index] == undefined) {
                        // loop again to check other side
                        if(operator == "-") {
                            operator = "+"
                            j = 0
                            continue
                        } 
                        connected = false
                        // include the main command if connected blocks found
                        if(connectedList.length != 0) {
                            connectedList.push(mainCommand)
                            commands.splice(commands.indexOf(mainCommand), 1);
                        }
                    }

                    // push connected block
                    if(commands[index] != undefined) {
                        connectedList.push(commands[index])
                        commands.splice(commands.indexOf(commands[index]), 1);
                    }

                    // create fill command
                    if(connectedList.length != 0 && connected == false) { 
                        var setBlockNumsX = []
                        for(var cmd of connectedList) {setBlockNumsX.push(Number(cmd.split(' ')[1]))}
                        commands.push(`/fill ${Math.min(...setBlockNumsX)} ${xyz[1]} ${xyz[2]} ${Math.max(...setBlockNumsX)} ${xyz[1]} ${xyz[2]} ${blockType}${state}`)
                        // console.log(`/fill ${Math.min(...setBlockNumsX)} ${xyz[1]} ${xyz[2]} ${Math.max(...setBlockNumsX)} ${xyz[1]} ${xyz[2]} ${blockType}${state}`)
                    }
                }

                // check for connected blocks in y
                connectedList = [] // array to create fill commands with
                operator = "-" // used to get both ways of xyz
                connected = true; // true if blocks are still connected in the process 
                j = 0 // connect counter 
                search; // used for checking match 
                while(connected) {
                    j++
                    if(operator == "-") search = `/setblock ${xyz[0]} ${Number(xyz[1] - j).toString()} ${xyz[2]} ${blockType}${state}`
                    if(operator == "+") search = `/setblock ${xyz[0]} ${Number(xyz[1] + j).toString()} ${xyz[2]} ${blockType}${state}`
                    var index = commands.indexOf(search)
                    if(commands[index] == undefined) {
                        // loop again to check other side
                        if(operator == "-") {
                            operator = "+"
                            j = 0
                            continue
                        } 
                        connected = false
                        // include the main command if connected blocks found
                        if(connectedList.length != 0) {
                            connectedList.push(mainCommand)
                            commands.splice(commands.indexOf(mainCommand), 1);
                        }
                    }

                    // push connected block
                    if(commands[index] != undefined) {
                        connectedList.push(commands[index])
                        commands.splice(commands.indexOf(commands[index]), 1);
                    }

                    // create fill command
                    if(connectedList.length != 0 && connected == false) { 
                        var setBlockNumsX = []
                        for(var cmd of connectedList) {setBlockNumsX.push(Number(cmd.split(' ')[2]))}
                        
                        commands.push(`/fill ${xyz[0]} ${Math.min(...setBlockNumsX)} ${xyz[2]} ${xyz[0]} ${Math.max(...setBlockNumsX)} ${xyz[2]} ${blockType}${state}`)
                        // console.log(`/fill ${xyz[0]} ${Math.min(...setBlockNumsX)} ${xyz[2]} ${xyz[0]} ${Math.max(...setBlockNumsX)} ${xyz[2]} ${blockType}${state}`)
                    }
                }

                // check for connected blocks in z
                connectedList = [] // array to create fill commands with
                operator = "-" // used to get both ways of xyz
                connected = true; // true if blocks are still connected in the process 
                j = 0 // connect counter 
                search; // used for checking match 
                while(connected) {
                    j++
                    if(operator == "-") search = `/setblock ${xyz[0]} ${xyz[1]} ${Number(xyz[2] - j).toString()} ${blockType}${state}`
                    if(operator == "+") search = `/setblock ${xyz[0]} ${xyz[1]} ${Number(xyz[2] + j).toString()} ${blockType}${state}`
                    var index = commands.indexOf(search)
                    if(commands[index] == undefined) {
                        // loop again to check other side
                        if(operator == "-") {
                            operator = "+"
                            j = 0
                            continue
                        } 
                        connected = false
                        // include the main command if connected blocks found
                        if(connectedList.length != 0) {
                            connectedList.push(mainCommand)
                            commands.splice(commands.indexOf(mainCommand), 1);
                        }
                    }

                    // push connected block
                    if(commands[index] != undefined) {
                        connectedList.push(commands[index])
                        commands.splice(commands.indexOf(commands[index]), 1);
                    }

                    // create fill command
                    if(connectedList.length != 0 && connected == false) { 
                        var setBlockNumsX = []
                        for(var cmd of connectedList) {setBlockNumsX.push(Number(cmd.split(' ')[3]))}
                        
                        commands.push(`/fill ${xyz[0]} ${xyz[1]} ${Math.min(...setBlockNumsX)} ${xyz[0]} ${xyz[1]} ${Math.max(...setBlockNumsX)} ${blockType}${state}`)
                        //console.log(`/fill ${xyz[0]} ${xyz[1]} ${Math.min(...setBlockNumsX)} ${xyz[0]} ${xyz[1]} ${Math.max(...setBlockNumsX)} ${blockType}${state}`)
                    }
                    
                }

            }

            // return
            console.log(commands.length)
            // console.log(commands)
            console.log(`Finished converting schematic`)

            const fileName = path.parse(path.basename(file)).name
            let files = Math.floor(commands.length/10000)


            if(fs.existsSync(`./mcfunctions/${fileName}`)) {
                let dir = fs.readdirSync(`./mcfunctions/${fileName}`)
                // removes all files 
                for(var file of dir) fs.unlinkSync(`./mcfunctions/${fileName}/${file}`)
            } else {
                fs.mkdirSync(`./mcfunctions/${fileName}`);
            }

            //create main function
            fs.writeFileSync(`./mcfunctions/${fileName}/${fileName}.mcfunction`, '', () => {})
    
            if(files != 0) {
                var fileNum = 0
                for(var line in commands) {
                    if(line % 10000 == 0) {
                        fileNum++ // 0 % 10000 = 0
                        fs.appendFileSync(`./mcfunctions/${fileName}/${fileName}.mcfunction`, `function ${fileName}${fileNum}\n`);
                    }
                    fs.appendFileSync(`./mcfunctions/${fileName}/${fileName}${fileNum}.mcfunction`, `${commands[line]}\n`);
                }
            } else {
                for(var command of commands) {
                    fs.appendFileSync(`./mcfunctions/${fileName}/${fileName}.mcfunction`, `${command}\n`);
                }
            }

        }

    }
}

new converter().start()
