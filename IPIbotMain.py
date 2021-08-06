import discord
from discord import File
import datetime
import os
from IPIbotScreenshot import screenshot

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
                               "calendrier d'alternance(<forma> = pdf ou img | <année> li ou m1)\n!helpIPI ->"
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
                                   "calendrier d'alternance(<forma> = pdg ou img | <année> li ou m1)\n!helpIPI ->"
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
        link=ConstructionURL(author)
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
        optionAnne=str(message.content.split()[2])
        optionForma=str(message.content.split()[1])
        messages = await message.channel.history(limit=1).flatten()
        for each_message in messages:
            await each_message.delete()
        if optionForma == "img":
            if optionAnne == "li":
                await channelBot.send("Calendrier d'alternance de licence :")
                await channelBot.send(file=File("CalAlt.png"))
            elif optionAnne == "m1":
                await channelBot.send("Calendrier d'alternance de master 1 :")
                await channelBot.send(file=File("CalAltM1.png"))
            else:
             await channelBot.send("l'option 2 n'est pas valide : l = licence ; m1 = Master 1")
        elif optionForma == "pdf":
            if optionAnne == "li":
                await channelBot.send("Calendrier d'alternance de licence :")
                await channelBot.send(file=File("iPi_Digitalents_2020_2021.pdf"))
            elif optionAnne == "m1":
                await channelBot.send("Calendrier d'alternance de master 1 :")
                await channelBot.send(file=File("iPi_Digitalents_2021_2022.pdf"))
            else:
                channelBot.send("l'option année n'est pas valide : li = licence ; m1 = master 1")
        else:
            await channelBot.send("l'option forma n'est pas valide : pdf = fichier.pdf ; img = fichier.png")

    # ------- commande : !purge <channel> (etude1...etude5)  ------- #
    if message.content.startswith("!purge"):
        option=str(message.content.split()[1])


def ConstructionURL(author):
    date = datetime.datetime.now()
    mois = date.month
    jour = date.day
    anne = date.year

    if author == 'AkEricuZemmouru':
        prenomDotNom = 'hugo.mercier'
    elif author == 'GreGres':
        prenomDotNom = 'antoine.bouard'
    elif author == 'Kaarie':
        prenomDotNom = 'eymeric.sertgoz'
    elif author == 'JeanFarine LePain':
        prenomDotNom = 'cyril.portascarta'
    elif author == 'MurdererKid':
        prenomDotNom = 'maxime.decorde'
    elif author == 'PepsiMajor':
        prenomDotNom = 'semi.gokol'
    elif author == 'GetRaikt':
        prenomDotNom = 'theodore.follet'
    elif author == 'Emilien':
        prenomDotNom = 'emilien.denot'
    else:
        prenomDotNom = 'hugo.mercier'

    return "https://edtmobiliteng.wigorservices.net//WebPsDyn.aspx?action=posEDTBEECOME&Tel=" + prenomDotNom + "&date=" + str(mois) + "/" + str(jour) + "/" + str(anne)


client.run("ODcwMTk4NzgxNjc1NzE2NjI5.YQJRxQ.SQzqi03OK-PqPfoJIcXYEHNt0D8")
