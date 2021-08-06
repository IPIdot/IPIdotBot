import discord
from discord import File
import datetime
import os
from IPIbotScreenshot import screenshot
import IPIbotRecupInfo

client = discord.Client()


@client.event
async def on_ready():
    print("Le bot est prêt !")
    channelBot = client.get_channel(870620313673674762)
    messages = await channelBot.history().flatten()
    for each_message in messages:
        await each_message.delete()
    await channelBot.send("!edt -> envoie le lien et l'image de l'empoi "
                          "du temps\n!ca <forma> <année> -> envoie le "
                          "calendrier d'alternance(<forma> = pdf ou img | <année> li ou m1 ou m2)\n!helpIPI ->"
                          " affiche toutes les commandes")


@client.event
async def on_message(message):
    channelBot = client.get_channel(870620313673674762)
    if message.content == "le j":
        await message.channel.send("c'est le S ")
    # ------- commande : !help affiche toutes les commandes ------- #
    if message.content == "!helpIPI":
        messages = await message.channel.history(limit=1).flatten()
        for each_message in messages:
            await each_message.delete()
        await channelBot.send("!edt -> envoie le lien et l'image de l'empoi "
                              "du temps\n!ca <forma> <année> -> envoie le "
                              "calendrier d'alternance(<forma> = pdg ou img | <année> li ou m1 ou m2)\n!helpIPI ->"
                              " affiche toutes les commandes")

    # ------- commande : !lien affiche le derrnier lien teams ajouter à l'empoi du temmps ------- #
    if message.content == "!lien":
        messages = await message.channel.history(limit=1).flatten()
        for each_message in messages:
            await each_message.delete()
        await channelBot.send("lien teams :")

    # ------- commande : !edt envoie le lien de l'empoi du temmps ------- #
    if message.content == "!edt":
        author = message.author.name
        link = ConstructionURL(author)
        messages = await message.channel.history(limit=1).flatten()
        for each_message in messages:
            await each_message.delete()
        await message.channel.send("J'ARRIVE...")
        await screenshot(link)
        messages = await message.channel.history(limit=1).flatten()
        for each_message in messages:
            await each_message.delete()
        await channelBot.send(f"lien de l'emploi du temps :{link}")
        await channelBot.send(file=File("edt.png"))

    if message.content == "Puceau moi ?":
        await message.channel.send(
            'Sérieusement ^^ haha on me l avait pas sortie celle la depuis loooongtemps demande a mes potes si je suis '
            'puceau tu vas voir les réponses que tu vas te prendre XD rien que la semaine passee j ai niquer dont'
            ' chuuuuut ferme la puceau de merde car toi tu m as tout tout l air d un bon puceau de merde car souvent '
            'vous etes frustrer de ne pas baiseR ses agreable de se faire un missionnaire ou un amazone avec une meuf '
            'hein ? tu peux pas répondre car tu ne sais pas ce que c ou alors tu le sais mais tu as du taper dans ta '
            'barre de recherche « missionnaire sexe » ou « amazone sexe » pour comprendre ce que c etait mdddrrr !! '
            'cest grave quoiquil en soit....pour revenir a moi, je pense que je suis le mec le moins puceau de ma bande'
            ' de 11 meilleurs amis pas psk j ai eu le plus de rapport intime mais psk j ai eu les plus jolie femme que '
            'mes amis ses pas moi qui le dit, ses eux qui commente sous mes photos insta « trop belle la fille que tu '
            'as coucher avec hier en boite notamment! » donc après si tu veux')

    # ------- commande : !ca envoie le calendrier d'alternance (img ou pdf) (licence ou master 1) ------- #
    if message.content.startswith("!ca"):
        optionAnne = str(message.content.split()[2])
        optionForma = str(message.content.split()[1])
        messages = await message.channel.history(limit=1).flatten()
        for each_message in messages:
            await each_message.delete()
        if optionForma == "img":
            if optionAnne == "li":
                path = IPIbotRecupInfo.RecupPathLicence('img')
                if path != 'none':
                    await channelBot.send("Calendrier d'alternance de licence :")
                    await channelBot.send(file=File(path))
                else:
                    await channelBot.send("L'image du calendrier d'alternance de licence n'est pas disponible")
            elif optionAnne == "m1":
                path = IPIbotRecupInfo.RecupPathMaster('img', 1)
                if path != 'none':
                    await channelBot.send("Calendrier d'alternance de master 1 :")
                    await channelBot.send(file=File(path))
                else:
                    await channelBot.send("L'image du calendrier d'alternance de master 1 n'est pas disponible")
            elif optionAnne == "m2":
                path = IPIbotRecupInfo.RecupPathMaster('img', 2)
                if path != 'none':
                    await channelBot.send("Calendrier d'alternance de master 2 :")
                    await channelBot.send(file=File(path))
                else:
                    await channelBot.send("L'image du calendrier d'alternance de master 2 n'est pas disponible")
        elif optionForma == "pdf":
            if optionAnne == "li":
                path = IPIbotRecupInfo.RecupPathLicence('pdf')
                if path != 'none':
                    await channelBot.send("Calendrier d'alternance de licence :")
                    await channelBot.send(file=File(path))
                else:
                    await channelBot.send("Le pdf du calendrier d'alternance de licence n'est pas disponible")
            elif optionAnne == "m1":
                path = IPIbotRecupInfo.RecupPathMaster('pdf', 1)
                if path != 'none':
                    await channelBot.send("Calendrier d'alternance de master 1 :")
                    await channelBot.send(file=File(path))
                else:
                    await channelBot.send("Le pdf du calendrier d'alternance de master 1 n'est pas disponible")
            elif optionAnne == "m2":
                path = IPIbotRecupInfo.RecupPathMaster('pdf', 2)
                if path != 'none':
                    await channelBot.send("Calendrier d'alternance de master 2 :")
                    await channelBot.send(file=File(path))
                else:
                    await channelBot.send("Le pdf du calendrier d'alternance de master 2 n'est pas disponible")

    # ------- commande : !purge <channel> (etude1...etude5  ------- #
    if message.content.startswith("!purge"):
        option = str(message.content.split()[1])

    if message.content.startswith("!del"):
        number = int(message.content.split()[1])
        messages = await message.channel.history(limit=number + 1).flatten()
        for each_message in messages:
            await each_message.delete()


def ConstructionURL(author):
    date = datetime.datetime.now()
    mois = date.month
    jour = date.day
    anne = date.year

    prenomDotNom = IPIbotRecupInfo.RecupName()

    return "https://edtmobiliteng.wigorservices.net//WebPsDyn.aspx?action=posEDTBEECOME&Tel=" + prenomDotNom + "&date=" + str(
        mois) + "/" + str(jour) + "/" + str(anne)


client.run(IPIbotRecupInfo.RecupToken())
