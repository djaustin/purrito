import { MessageEmbed } from 'discord.js'
import { PrintableObject } from './printableObject'

/**
 * Represents the JSON from the CRD
 */
export type IMonster = {
    name: string
    meta: string
    'Armor Class': string
    'Hit Points': string
    Speed: string
    STR: string
    STR_mod: string
    DEX: string
    DEX_mod: string
    CON: string
    CON_mod: string
    INT: string
    INT_mod: string
    WIS: string
    WIS_mod: string
    CHA: string
    CHA_mod: string
    'Saving Throws'?: string
    Skills?: string
    'Damage Immunities'?: string
    Senses: string
    Languages: string
    xp: number
    Actions?: string
    'Legendary Actions'?: string
    img_url: string
    environments?: Environment[]
}

/**
 * The class we used, used primarily for creating an embed
 */
export class Monster implements PrintableObject {
    name: string
    meta: string
    armorClass: string
    hitPoints: string
    Speed: string
    str: string
    strMod: string
    dex: string
    dexMod: string
    con: string
    conMod: string
    int: string
    intMod: string
    wis: string
    wisMod: string
    cha: string
    chaMod: string
    savingThrows?: string
    Skills?: string
    damageImmunities?: string
    Senses: string
    Languages: string
    xp: number
    Actions?: string
    legendaryActions?: string
    img_url: string
    environments?: Environment[]

    constructor(monster: IMonster) {
        this.name = monster.name
        this.meta = monster.meta
        this.armorClass = monster['Armor Class']
        this.hitPoints = monster['Hit Points']
        this.Speed = monster.Speed
        this.str = monster.STR
        this.strMod = monster.STR_mod
        this.dex = monster.DEX
        this.dexMod = monster.DEX_mod
        this.con = monster.CON
        this.conMod = monster.CON_mod
        this.int = monster.INT
        this.intMod = monster.INT_mod
        this.wis = monster.WIS
        this.wisMod = monster.WIS_mod
        this.cha = monster.CHA
        this.chaMod = monster.CHA_mod
        this.savingThrows = monster['Saving Throws']
        this.Skills = monster.Skills
        this.damageImmunities = monster['Damage Immunities']
        this.Senses = monster.Senses
        this.Languages = monster.Languages
        this.xp = monster.xp
        this.Actions = monster.Actions
        this.legendaryActions = monster['Legendary Actions']
        this.img_url = monster.img_url
        this.environments = monster.environments
    }

    createEmbed(): MessageEmbed {
        const embed = new MessageEmbed()
        embed.setTitle(this.name)
        embed.setDescription([
            this.meta,
            `Armor Class: ${this.armorClass}`,
            `Hit Points: ${this.hitPoints}`,
            `Speed: ${this.Speed}`,
            ,
        ])

        embed.addField('Stats', [
            `Strength: ${this.str} ${this.strMod}`,
            `Dexterity: ${this.dex} ${this.dexMod}`,
            `Constitution: ${this.con} ${this.conMod}`,
            `Intelligence: ${this.int} ${this.intMod}`,
            `Wisdom: ${this.wis} ${this.wisMod}`,
            `Charisma: ${this.cha} ${this.chaMod}`,
        ])

        embed.addField('Abilities', [
            `Senses: ${this.Senses}`,
            `Languages: ${this.Languages}`,
        ])

        if (this.savingThrows) {
            embed.addField('Saving Throws', this.savingThrows)
        }
        if (this.Skills) {
            embed.addField('Skills', this.Skills)
        }

        if (this.damageImmunities)
            embed.addField('Damage Immunites', this.damageImmunities)

        // Actions - this can get quite long so splitting it into chunks of 1024 length
        if (this.Actions) {
            // Remove all the HTML
            const formattedActions = this.Actions.replace(/<em>/g, '*')
                .replace(/<\/em>/g, '*')
                .replace(/<strong>/g, '**')
                .replace(/<\/strong>/g, '**')
                .replace(/<p>/g, '')
                .replace(/<\/p>/g, '\n')

            // Calculate how many chunks there are
            const numberOfChunks = Math.ceil(formattedActions.length / 1024)
            const actionSubStrings = new Array(numberOfChunks)

            // Break the string into the neccessary amount of chunks
            for (let i = 0, o = 0; i < numberOfChunks; ++i, o += 1024) {
                actionSubStrings[i] = formattedActions.substr(o, 1024)
            }

            actionSubStrings.forEach((action, index) => {
                if (index === 0) {
                    embed.addField('Actions', action)
                } else {
                    embed.addField('Actions continued....', action)
                }
            })
        }

        // Legendary actions
        if (this.legendaryActions) {
            // Remove all the HTML
            const formattedActions = this.legendaryActions
                .replace(/<em>/g, '*')
                .replace(/<\/em>/g, '*')
                .replace(/<strong>/g, '**')
                .replace(/<\/strong>/g, '**')
                .replace(/<p>/g, '')
                .replace(/<\/p>/g, '\n')

            // Calculate how many chunks there are
            const numberOfChunks = Math.ceil(formattedActions.length / 1024)
            const actionSubStrings = new Array(numberOfChunks)

            // Break the string into the neccessary amount of chunks
            for (let i = 0, o = 0; i < numberOfChunks; ++i, o += 1024) {
                actionSubStrings[i] = formattedActions.substr(o, 1024)
            }

            actionSubStrings.forEach((action, index) => {
                if (index === 0) {
                    embed.addField('Legendary Actions', action)
                } else {
                    embed.addField('Legendary Actions continued....', action)
                }
            })
        }

        embed.setThumbnail(this.img_url)

        return embed
    }
}

export type Environment =
    | 'ARCTIC'
    | 'COASTAL'
    | 'DESERT'
    | 'FOREST'
    | 'GRASSLAND'
    | 'HILL'
    | 'MOUNTAIN'
    | 'SWAMP'
    | 'UNDERDARK'
    | 'UNDERWATER'
    | 'URBAN'
