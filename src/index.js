import chalk from 'chalk';
import inquirer from 'inquirer';
import fs from 'fs'
import path from 'path'
import { Schematic } from 'prismarine-schematic'
import dialog from 'node-file-dialog'



class converter {

    constructor() {}

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

    async selectFiles() {
        const config = {type:'open-files'}
        var selectedFiles;
        try {
            selectedFiles = await dialog(config)
        } catch(err) {
            console.log(err)
            return undefined
        }
        // this script auto adds \r at the end of new files
        for (var i = selectedFiles.length - 1; i >= 0; i--) {
            selectedFiles[i] = selectedFiles[i].replace(`\r`, '')
        }
        return selectedFiles
    }

    async convertBlockDataToBedrock(command) {

        const placeType = /(\/setblock|\/fill)/
        const coords = /\d+ \d+ \d+/

        const placeType2 = command.match(placeType)[0] // 0 returns place type match
        const coords2 = command.match(coords)[0]
        var blockType = command.split(' ')[4]// returns blocktype | need translations
        var state = ` ${command.split(' ')[5]}`// returns block state | need translations
        if(state == ' undefined' || state == undefined) state = ''

        // used to check if command was updated
        var blockTypeOld = blockType;
        var stateOld = state;

        // translations
        
        switch(blockType) {
            case 'stone': break
            case 'iron_ore': break
            case 'coal_ore': break
            case 'gold_ore': break
            case 'diamond_ore': break
            case 'crafting_table': break
            case 'dirt': break
            case 'glass': break
            case 'sea_lantern': break
            case 'enchanting_table': break
            case 'gold_block': break
            case 'sandstone': break
            case 'end_stone': break
            case 'quartz_block': break
            case 'sand': break
            case 'cobblestone': break
            case 'glowstone': break
            case 'smooth_stone': break
            case 'prismarine': break

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

            case 'spruce_planks': {
                blockType = 'planks'
                state = ' 1'
                break
            }

            case 'spruce_planks': {
                blockType = 'planks'
                state = ' 1'
                break
            }

            case 'cyan_stained_glass_pane': {
                blockType = 'stained_glass_pane'
                state = ' 9'
                break
            }

            case 'white_stained_glass': {
                blockType = 'stained_glass'
                state = ''
                break
            }

            case 'red_wool': {
                blockType = 'wool'
                state = ' 14'
                break
            }

            case 'black_wool': {
                blockType = 'wool'
                state = ' 15'
                break
            }

            case 'coarse_dirt': {
                blockType = 'dirt'
                state = ' 1'
                break
            }

            case 'green_carpet': {
                blockType = 'carpet'
                state = ' 13'
                break
            }

            case 'red_terracotta': {
                blockType = 'stained_hardened_clay'
                state = ' 14'
                break
            }

            case 'oak_wood': {
                // cant change axis
                blockType = 'wood'
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

            case 'prismarine_bricks': {
                blockType = 'prismarine'
                state = ''
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

            case 'birch_fence':{
                blockType = 'fence'
                state = ' 2' 
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


            case 'wall_torch': {
                blockType = "torch"
                const json = this.getBlockStateData(state)
                if(json.facing == 'west') state = ' 1'
                if(json.facing == 'east') state = ' 2'
                if(json.facing == 'north') state = ' 3'
                if(json.facing == 'south') state = ' 4'
                if(json.facing == 'top') state = ' 5'
                break
            }

            case 'activator_rail': {
                const json = this.getBlockStateData(state)
                if(json.shape == 'north_south') state = ' 0'
                if(json.shape == 'east_west') state = ' 1'
                if(json.shape == 'ascending_east') state = ' 2'
                if(json.shape == 'ascending_west') state = ' 3'
                if(json.shape == 'ascending_north') state = ' 4'
                if(json.shape == 'ascending_south') state = ' 5'
                break
            }

            case 'rail': {
                const json = this.getBlockStateData(state)
                if(json.shape == 'north_south') state = ' 0'
                if(json.shape == 'east_west') state = ' 1'
                if(json.shape == 'ascending_east') state = ' 2'
                if(json.shape == 'ascending_west') state = ' 3'
                if(json.shape == 'ascending_north') state = ' 4'
                if(json.shape == 'ascending_south') state = ' 5'
                break
            }

            case 'dropper': {
                const json = this.getBlockStateData(state)
                if(json.facing == 'down') state = ' 0'
                if(json.facing == 'up') state = ' 1'
                if(json.facing == 'north') state = ' 2'
                if(json.facing == 'south') state = ' 3'
                if(json.facing == 'west') state = ' 4'
                if(json.facing == 'east') state = ' 5'
                break
            }

            case 'hopper': {
                const json = this.getBlockStateData(state)
                if(json.facing == 'down') state = ' 0'
                if(json.facing == 'north') state = ' 2'
                if(json.facing == 'south') state = ' 3'
                if(json.facing == 'west') state = ' 4'
                if(json.facing == 'east') state = ' 5'
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
                // can't change upside down
                if(this.getBlockStateData(state).facing == 'north') state = ' 2'
                if(this.getBlockStateData(state).facing == 'south') state = ' 3'
                if(this.getBlockStateData(state).facing == 'west') state = ' 0'
                if(this.getBlockStateData(state).facing == 'east') state = ' 1'
                break
            }

            case 'spruce_stairs': {
                // can't change upside down
                const json = this.getBlockStateData(state)
                if(json.facing == 'north') state = ' 3'
                if(json.facing == 'south') state = ' 2'
                if(json.facing == 'west') state = ' 1'
                if(json.facing == 'east') state = ' 0'
                break
            }

            case 'quartz_stairs': {
                // can't change upside down
                if(this.getBlockStateData(state).facing == 'north') state = ' 3'
                if(this.getBlockStateData(state).facing == 'south') state = ' 2'
                if(this.getBlockStateData(state).facing == 'west') state = ' 1'
                if(this.getBlockStateData(state).facing == 'east') state = ' 0'
                break
            }

            case 'stone_brick_stairs': {
                // can't change upside down
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

            case 'birch_slab':{
                blockType = 'wooden_slab'
                const json = this.getBlockStateData(state)
                if(json.type == 'top') state = ' 10'
                if(json.type == 'bottom') state = ' 2'
                if(json.type == 'double') {
                    blockType = 'double_wooden_slab'
                    state = ' 2'
                }
                break
            }

            case 'spruce_slab':{
                blockType = 'wooden_slab'
                const json = this.getBlockStateData(state)
                if(json.type == 'top') state = ' 9'
                if(json.type == 'bottom') state = ' 1'
                if(json.type == 'double') {
                    blockType = 'double_wooden_slab'
                    state = ' 1'
                }
                break
            }

            case 'smooth_stone_slab':{
                blockType = 'stone_block_slab'
                const json = this.getBlockStateData(state)
                if(json.type == 'top') state = ' 8'
                if(json.type == 'bottom') state = ''
                if(json.type == 'double') {
                    blockType = 'double_stone_block_slab'
                    state = ''
                }
                break
            }

            case 'stone_brick_slab':{
                blockType = 'stone_block_slab'
                const json = this.getBlockStateData(state)
                if(json.type == 'top') state = ' 13'
                if(json.type == 'bottom') state = ' 5'
                if(json.type == 'double') {
                    blockType = 'double_stone_block_slab'
                    state = ' 5'
                }
                break
            }

            case 'quartz_slab':{
                blockType = 'stone_block_slab'
                const json = this.getBlockStateData(state)
                if(json.type == 'top') state = ' 14'
                if(json.type == 'bottom') state = ' 6'
                if(json.type == 'double') {
                    blockType = 'double_stone_block_slab'
                    state = ' 6'
                }
                break
            }

            case 'oak_leaves':{
                blockType = 'leaves'
                state = '' //data value might be messed
                break
            }

            case 'spruce_leaves':{
                blockType = 'leaves'
                state = ' 1' //data value might be messed
                break
            }

            case 'birch_leaves':{
                blockType = 'leaves'
                state = ' 2' //data value might be messed
                break
            }

            case 'jungle_leaves':{
                blockType = 'leaves'
                state = ' 3' //data value might be messed
                break
            }

            default: console.log(`${placeType2} ${coords2} ${blockType}${state}`)
        }
        //update command
        if(blockTypeOld != blockType || stateOld != state) command = `${placeType2} ${coords2} ${blockType}${state}`
        return `${placeType2} ${coords2} ${blockType}${state}`
    }

    async schematicToMCFunction2() {

        const selectedFiles = await this.selectFiles();

        for(var file of selectedFiles) {
            console.log(`Started Converting ${path.basename(file)}`)
            const schematic = await Schematic.read(await fs.promises.readFile(file))
            var commands = await schematic.makeWithCommands({x: '', y: '', z: ''}, 'pe') // air blocks removed modified in module


            // converts blocks to mcbe block data
            for(var i = commands.length - 1; i >= 0; i--) commands[i] = await this.convertBlockDataToBedrock(commands[i])

            //algorithm 

            console.log(commands.length)

            const placeTypeReg = /(\/setblock|\/fill)/
            const xyzReg = /\d+ \d+ \d+/

            for (var i = commands.length - 1; i >= 0; i--) {
                const command = commands[i]
                if(command == undefined) continue // block has been grouped into a fill command

                // block info parsers
                var placeType = command.match(placeTypeReg)[0]
                var xyz = command.match(xyzReg)[0].split(' ')
                var blockType = command.split(' ')[4]
                var state = ` ${command.split(' ')[5]}`
                if(state == ' undefined') state = '' 
                // block info parsers

                //filters
                if(placeType == '/fill') continue
                //filters

                /////////////////////////////////////////////////////////
                //check x ///////////////////////////////////////////////
                /////////////////////////////////////////////////////////

                // create connected block array
                var connectedBlocks = []
                // push first block
                connectedBlocks.push(command)

                var currentBlockCount = 0
                var operator = '+' 

                while(true) {
                    currentBlockCount++
                    
                    // validates connected blocks
                    const search = `/setblock ${eval(`${xyz[0]} ${operator} ${currentBlockCount}`)} ${xyz[1]} ${xyz[2]} ${blockType}${state}` // used eval to work with operator
                    const index = commands.indexOf(search)
                    if(index == -1) { 
                        //check both sides
                        if(operator == '+') {
                            operator = '-'
                            currentBlockCount = 0
                            continue // start from while loop
                        } else {
                            break // breaks while loop
                        }
                    }
                    // validates connected blocks
                    // if passes means that there are atleast 2 connected blocks

                    // push connected block
                    connectedBlocks.push(commands[index])
                    commands.splice(index, 1);
                    //if atleast 1 block connected splice main command && cehck if command exist in array
                    if(connectedBlocks.length == 2 && commands.indexOf(command) != -1) commands.splice(commands.indexOf(command), 1);
                }

                if(connectedBlocks.length != 1) { 
                    var setBlockNumsX = []
                    for(var cmd of connectedBlocks) {setBlockNumsX.push(Number(cmd.split(' ')[1]))}
                    commands.push(`/fill ${Math.min(...setBlockNumsX)} ${xyz[1]} ${xyz[2]} ${Math.max(...setBlockNumsX)} ${xyz[1]} ${xyz[2]} ${blockType}${state}`)
                    // console.log(`/fill ${Math.min(...setBlockNumsX)} ${xyz[1]} ${xyz[2]} ${Math.max(...setBlockNumsX)} ${xyz[1]} ${xyz[2]} ${blockType}${state}`)
                }

                /////////////////////////////////////////////////////////
                //check x ///////////////////////////////////////////////
                /////////////////////////////////////////////////////////

                /////////////////////////////////////////////////////////
                //check y ///////////////////////////////////////////////
                /////////////////////////////////////////////////////////

                connectedBlocks = []
                connectedBlocks.push(command)
                currentBlockCount = 0
                operator = '+' 

                while(true) {
                    currentBlockCount++
                    const search = `/setblock ${xyz[0]} ${eval(`${xyz[1]} ${operator} ${currentBlockCount}`)} ${xyz[2]} ${blockType}${state}` // used eval to work with operator
                    const index = commands.indexOf(search)
                    if(index == -1) { 
                        //check both sides
                        if(operator == '+') {
                            operator = '-'
                            currentBlockCount = 0
                            continue // start from while loop
                        } else {
                            break // breaks while loop
                        }
                    }
                    connectedBlocks.push(commands[index])
                    commands.splice(index, 1);
                    if(connectedBlocks.length == 2 && commands.indexOf(command) != -1) commands.splice(commands.indexOf(command), 1);
                }

                if(connectedBlocks.length != 1) { 
                    var setBlockNumsY = []
                    for(var cmd of connectedBlocks) {setBlockNumsY.push(Number(cmd.split(' ')[2]))}
                    commands.push(`/fill ${xyz[0]} ${Math.min(...setBlockNumsY)} ${xyz[2]} ${xyz[0]} ${Math.max(...setBlockNumsY)} ${xyz[2]} ${blockType}${state}`)
                    // console.log(`/fill ${xyz[0]} ${Math.min(...setBlockNumsY)} ${xyz[2]} ${xyz[0]} ${Math.max(...setBlockNumsY)} ${xyz[2]} ${blockType}${state}`)
                }

                /////////////////////////////////////////////////////////
                //check y ///////////////////////////////////////////////
                /////////////////////////////////////////////////////////

                /////////////////////////////////////////////////////////
                //check z ///////////////////////////////////////////////
                /////////////////////////////////////////////////////////

                connectedBlocks = []
                connectedBlocks.push(command)
                currentBlockCount = 0
                operator = '+' 

                while(true) {
                    currentBlockCount++
                    const search = `/setblock ${xyz[0]} ${xyz[1]} ${eval(`${xyz[2]} ${operator} ${currentBlockCount}`)} ${blockType}${state}` // used eval to work with operator
                    const index = commands.indexOf(search)
                    // if(index != -1) console.log(search)
                    if(index == -1) { 
                        //check both sides
                        if(operator == '+') {
                            operator = '-'
                            currentBlockCount = 0
                            continue // start from while loop
                        } else {
                            break // breaks while loop
                        }
                    }
                    connectedBlocks.push(commands[index])
                    commands.splice(index, 1);
                    if(connectedBlocks.length == 2 && commands.indexOf(command) != -1) commands.splice(commands.indexOf(command), 1);
                }

                if(connectedBlocks.length != 1) { 
                    var setBlockNumsZ = []
                    for(var cmd of connectedBlocks) {setBlockNumsZ.push(Number(cmd.split(' ')[3]))}
                    commands.push(`/fill ${xyz[0]} ${xyz[1]} ${Math.min(...setBlockNumsZ)} ${xyz[0]} ${xyz[1]} ${Math.max(...setBlockNumsZ)} ${blockType}${state}`)
                    // console.log(`/fill ${xyz[0]} ${xyz[1]} ${Math.min(...setBlockNumsZ)} ${xyz[0]} ${xyz[1]} ${Math.max(...setBlockNumsZ)} ${blockType}${state}`)
                }
                /////////////////////////////////////////////////////////
                //check z ///////////////////////////////////////////////
                /////////////////////////////////////////////////////////
            }

            // attachables may be changed if block ids change on updates
            const attachables = [
                ' torch',
                ' rail',
                ' sand'
            ]

            // moves blocks to the end that need block support
            for(const index in commands) {
                const block = commands[index].match(/ [a-zA-Z_]+/)[0]
                if(!attachables.includes(block)) continue
                // console.log(block)
                commands.push(commands.splice(index, 1)[0]);
            }

            //removes / and adds relative to player coords
            for(var i = commands.length - 1; i >= 0; i--) commands[i] = commands[i].replace('/', ``).replace(/(\b\d+\b )/g, `~$1`)

            console.log(commands.length)
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
