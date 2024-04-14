// Flujos del bot 1

import { addKeyword, EVENTS, utils } from "@builderbot/bot";
import { join } from "path";
import { database } from "~/database";
import { provider } from "~/provider";

export const flowWelcome = addKeyword(EVENTS.WELCOME)
        .addAnswer('Hola, soy un bot muy agradable 😃')




        const discordFlow = addKeyword<typeof provider, typeof database>('doc').addAnswer(
            ['You can see the documentation here', '📄 https://builderbot.app/docs \n', 'Do you want to continue? *yes*'].join(
                '\n'
            ),
            { capture: true },
            async (ctx, { gotoFlow, flowDynamic }) => {
                if (ctx.body.toLocaleLowerCase().includes('yes')) {
                    return gotoFlow(registerFlow)
                }
                await flowDynamic('Thanks!')
                return
            }
        )
        
        //Flujo de bienvenida
        const welcomeFlow = addKeyword<typeof provider, typeof database>(['hi', 'hello', 'hola'])
            .addAnswer(`🙌 Hello welcome to this *Chatbot*`)
            .addAnswer(
                [
                    'I share with you the following links of interest about the project',
                    '👉 *doc* to view the documentation',
                ].join('\n'),
                { delay: 800, capture: true },
                async (ctx, { fallBack }) => {
                    if (!ctx.body.toLocaleLowerCase().includes('doc')) {
                        return fallBack('You should type *doc*')
                    }
                    return
                },
                [discordFlow]
            )
        
        
        //Flujo de prueba y respuesta
        const papuFlow = addKeyword<typeof provider, typeof database>(['papu', 'pa', 'paa'])
            .addAnswer('Hey, todo bien?')
            .addAnswer('a qué hora te busco?', {capture: true}, async (ctx, { flowDynamic }) => {
                await flowDynamic([`Dale, t busco ${ctx.body}`, `Te envío una imagen`])
            })
            .addAction(async(_ , {flowDynamic}) => {
                const dataApi = await fetch(`https://shibe.online/api/shibes?count=1&urls=true&httpsUrls=true`)
                const [imageUrl] = await dataApi.json()
                await flowDynamic([{body:'😜', media: imageUrl}])
            })
            .addAnswer(
                'Jaja, soy el bot de Rodolfo',
                { delay: 2000 } 
            )
            .addAnswer(
                ['me adelanté y contesté yo' ],
                { delay: 2000 }
            )
            .addAnswer('seguro Rodolfo está durmiendo o mirando tele y le dá paja levantarse a ver el celu')
        
        let animal!: string
        
        const danaFlow = addKeyword<typeof provider, typeof database>(['holis'])
        .addAnswer('Hey, todo bien?')
        .addAnswer('querés ver una imagen de un perro o de un gato?', {capture: true}, async (ctx, { flowDynamic }) => {
            animal = (ctx.body == 'perro')?'shibes':'cats'
            await flowDynamic([`Dale, envío la imagen`])
        })
        .addAction(async(_ , {flowDynamic}) => {
            const dataApi = await fetch('https://shibe.online/api/' + animal + '?count=1&urls=true&httpsUrls=true')
            const [imageUrl] = await dataApi.json()
            await flowDynamic([{body:'😜', media: imageUrl}])
        })
        .addAnswer(
            'Jaja, soy un bot',
            { delay: 2000 } 
        )
        
        const flowA = addKeyword('askme')
            .addAnswer('What is your name?', { capture: true }, async (ctx, { state }) => {
              const responseName = ctx.body
              const nameFrom = ctx.name
              const numberFrom = ctx.from
        
              console.log(`Other properties:`, ctx)
            })
        
        
        //Flujo de registro
        const registerFlow = addKeyword<typeof provider, typeof database>(utils.setEvent('REGISTER_FLOW'))
            .addAnswer(`What is your name?`, { capture: true }, async (ctx, { state }) => {
                await state.update({ name: ctx.body })
            })
            .addAnswer('What is your age?', { capture: true }, async (ctx, { state }) => {
                await state.update({ age: ctx.body })
            })
            .addAction(async (_, { flowDynamic, state }) => {
                await flowDynamic(`${state.get('name')}, thanks for your information!: Your age: ${state.get('age')}`)
            })
        
        //Flujo de envío de datos diversos
        const fullSamplesFlow = addKeyword<typeof provider, typeof database>(['samples', utils.setEvent('SAMPLES')])
            .addAnswer(`💪 I'll send you a lot files...`)
            .addAnswer(`Send image from Local`, { media: join(process.cwd(), 'assets', 'sample.png') })
            .addAnswer(`Send video from URL`, {
                media: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYTJ0ZGdjd2syeXAwMjQ4aWdkcW04OWlqcXI3Ynh1ODkwZ25zZWZ1dCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/LCohAb657pSdHv0Q5h/giphy.mp4',
            })
            .addAnswer(`Send audio from URL`, { media: 'https://cdn.freesound.org/previews/728/728142_11861866-lq.mp3' })
            .addAnswer(`Send file from URL`, {
                media: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            })