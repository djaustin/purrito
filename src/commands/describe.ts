import { Message, MessageAttachment } from 'discord.js'
import config from '../config.json'
import { IMonster, Monster } from '../models/monster'
import monsters from '../monsters.json'

/**
 * Given +describe and a monster name, find that monster and print
 * the info in the channel
 * @param message
 * @param args
 */
export async function describeMonster(message: Message) {
    let messageToReturn: string

    let monsterName: string | undefined

    monsterName = message.content
        .slice(`${config.prefix}describe`.length)
        .trim()

    if (!monsterName)
        return await message.channel.send('please provide a monster name')

    const json: IMonster | undefined = monsters.find(
        monster => monster.name.toLowerCase() === monsterName?.toLowerCase()
    )

    if (json) {
        messageToReturn = new Monster(json).formatForMessage()
    } else {
        messageToReturn = `couldn't find ${monsterName}, probably having a cat nap`
    }

    if (messageToReturn.length >= 2000) {
        const numChunks = Math.ceil(messageToReturn.length / 1500)
        const chunks = new Array(numChunks)

        for (let i = 0, o = 0; i < numChunks; ++i, o += 2000) {
            chunks[i] = messageToReturn.substr(o, 2000)
        }

        chunks.forEach((messageToReturnSplit, index) => {
            if (index === chunks.length - 1) {
                message.channel.send(messageToReturnSplit, {
                    files: [new MessageAttachment(json!.img_url)],
                })
            } else {
                message.channel.send(messageToReturnSplit)
            }
        })
    } else {
        await message.channel.send(messageToReturn, {
            files: [new MessageAttachment(json!.img_url)],
        })
    }
}